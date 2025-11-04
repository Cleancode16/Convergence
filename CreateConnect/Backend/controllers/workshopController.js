const asyncHandler = require('express-async-handler');
const Workshop = require('../models/Workshop');

// @desc    Create workshop
// @route   POST /api/workshops
// @access  Private (Artisan)
const createWorkshop = asyncHandler(async (req, res) => {
  const { name, description, artForm, date, startTime, endTime, location, totalSlots, price, images } = req.body;

  // Only validate required fields
  if (!description || !date || !startTime || !endTime || !location?.address) {
    res.status(400);
    throw new Error('Please provide description, date, time, and address');
  }

  const workshop = await Workshop.create({
    artisan: req.user._id,
    name: name || `Workshop - ${new Date(date).toLocaleDateString()}`,
    description,
    artForm: artForm || 'General',
    date,
    startTime,
    endTime,
    location,
    totalSlots: totalSlots || 10,
    availableSlots: totalSlots || 10,
    price: price || 0,
    images: images || [],
  });

  res.status(201).json({
    success: true,
    message: 'Workshop created successfully',
    data: workshop,
  });
});

// @desc    Update workshop images
// @route   PUT /api/workshops/:id/images
// @access  Private (Artisan)
const updateWorkshopImages = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  if (workshop.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { images } = req.body;

  if (!images || !Array.isArray(images)) {
    res.status(400);
    throw new Error('Please provide images array');
  }

  workshop.images = images;
  await workshop.save();

  res.json({
    success: true,
    message: 'Images updated successfully',
    data: workshop,
  });
});

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Public
const getAllWorkshops = asyncHandler(async (req, res) => {
  const { search, artForm, status, date } = req.query;

  let query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { artForm: { $regex: search, $options: 'i' } },
    ];
  }

  if (artForm) {
    query.artForm = artForm;
  }

  if (status) {
    query.status = status;
  }

  if (date) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: searchDate, $lt: nextDay };
  }

  const workshops = await Workshop.find(query)
    .populate('artisan', 'name email')
    .sort({ date: 1 });

  res.json({
    success: true,
    count: workshops.length,
    data: workshops,
  });
});

// @desc    Get single workshop
// @route   GET /api/workshops/:id
// @access  Public
const getWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id)
    .populate('artisan', 'name email phoneNumber')
    .populate('enrolledUsers.user', 'name email');

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  res.json({
    success: true,
    data: workshop,
  });
});

// @desc    Enroll in workshop
// @route   POST /api/workshops/:id/enroll
// @access  Private
const enrollWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  if (workshop.availableSlots <= 0) {
    res.status(400);
    throw new Error('No slots available');
  }

  const alreadyEnrolled = workshop.enrolledUsers.find(
    (enrollment) => enrollment.user.toString() === req.user._id.toString()
  );

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('Already enrolled in this workshop');
  }

  workshop.enrolledUsers.push({ user: req.user._id });
  workshop.availableSlots -= 1;

  await workshop.save();

  res.json({
    success: true,
    message: 'Successfully enrolled in workshop',
    data: workshop,
  });
});

// @desc    Cancel enrollment
// @route   DELETE /api/workshops/:id/enroll
// @access  Private
const cancelEnrollment = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  const enrollmentIndex = workshop.enrolledUsers.findIndex(
    (enrollment) => enrollment.user.toString() === req.user._id.toString()
  );

  if (enrollmentIndex === -1) {
    res.status(400);
    throw new Error('Not enrolled in this workshop');
  }

  workshop.enrolledUsers.splice(enrollmentIndex, 1);
  workshop.availableSlots += 1;

  await workshop.save();

  res.json({
    success: true,
    message: 'Enrollment cancelled successfully',
    data: workshop,
  });
});

// @desc    Get my workshops (artisan)
// @route   GET /api/workshops/my/created
// @access  Private (Artisan)
const getMyWorkshops = asyncHandler(async (req, res) => {
  const workshops = await Workshop.find({ artisan: req.user._id })
    .populate('enrolledUsers.user', 'name email')
    .sort({ date: -1 });

  res.json({
    success: true,
    count: workshops.length,
    data: workshops,
  });
});

// @desc    Get enrolled workshops (user)
// @route   GET /api/workshops/my/enrolled
// @access  Private
const getEnrolledWorkshops = asyncHandler(async (req, res) => {
  const workshops = await Workshop.find({
    'enrolledUsers.user': req.user._id,
  })
    .populate('artisan', 'name email phoneNumber')
    .sort({ date: 1 });

  res.json({
    success: true,
    count: workshops.length,
    data: workshops,
  });
});

// @desc    Update workshop
// @route   PUT /api/workshops/:id
// @access  Private (Artisan)
const updateWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  if (workshop.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updatedWorkshop = await Workshop.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Workshop updated successfully',
    data: updatedWorkshop,
  });
});

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
// @access  Private (Artisan)
const deleteWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    res.status(404);
    throw new Error('Workshop not found');
  }

  if (workshop.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await workshop.deleteOne();

  res.json({
    success: true,
    message: 'Workshop deleted successfully',
  });
});

module.exports = {
  createWorkshop,
  updateWorkshopImages,
  getAllWorkshops,
  getWorkshop,
  enrollWorkshop,
  cancelEnrollment,
  getMyWorkshops,
  getEnrolledWorkshops,
  updateWorkshop,
  deleteWorkshop,
};
