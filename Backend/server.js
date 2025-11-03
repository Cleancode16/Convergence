const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const artisanProfileRoutes = require('./routes/artisanProfileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ngoProfileRoutes = require('./routes/ngoProfileRoutes');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require('./routes/productRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const walletRoutes = require('./routes/walletRoutes');
const artistPostRoutes = require('./routes/artistPostRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const artStoryRoutes = require('./routes/artStoryRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const aiGuidanceRoutes = require('./routes/aiGuidanceRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const donationRoutes = require('./routes/donationRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artisan', artisanProfileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngo', ngoProfileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/artist-posts', artistPostRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/art-stories', artStoryRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/ai-guidance', aiGuidanceRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/user', userProfileRoutes);

// Socket.IO
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('register', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  
  socket.on('join-connection', (connectionId) => {
    socket.join(connectionId);
    console.log(`Socket ${socket.id} joined connection ${connectionId}`);
  });
  
  socket.on('send-message', (data) => {
    const { connectionId, message } = data;
    io.to(connectionId).emit('receive-message', message);
  });
  
  socket.on('edit-message', (data) => {
    const { connectionId, message } = data;
    io.to(connectionId).emit('message-edited', message);
  });
  
  socket.on('delete-message', (data) => {
    const { connectionId, messageId } = data;
    io.to(connectionId).emit('message-deleted', messageId);
  });
  
  socket.on('typing', (data) => {
    const { connectionId, userId } = data;
    socket.to(connectionId).emit('user-typing', userId);
  });
  
  socket.on('stop-typing', (data) => {
    const { connectionId, userId } = data;
    socket.to(connectionId).emit('user-stop-typing', userId);
  });
  
  socket.on('disconnect', () => {
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
