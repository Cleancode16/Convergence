const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Artisan only)
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = 'daily', startDate, endDate } = req.query;

  // Get all artisan's products
  const products = await Product.find({ artisan: req.user._id });
  const productIds = products.map(p => p._id);

  // Build date filter
  let dateFilter = {};
  const now = new Date();
  
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else {
    // Default to last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
  }

  // Get orders
  const orders = await Order.find({
    product: { $in: productIds },
    ...dateFilter
  }).populate('product', 'title price category');

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Group by period
  let groupedData = [];
  
  if (period === 'daily') {
    // Last 30 days
    const dailyData = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = { date: dateStr, revenue: 0, orders: 0, quantity: 0 };
    }
    
    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].revenue += order.totalPrice;
        dailyData[dateStr].orders += 1;
        dailyData[dateStr].quantity += order.quantity;
      }
    });
    
    groupedData = Object.values(dailyData);
  } else if (period === 'weekly') {
    // Last 12 weeks
    const weeklyData = {};
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekNum = getWeekNumber(weekStart);
      const weekLabel = `Week ${weekNum}`;
      weeklyData[weekLabel] = { date: weekLabel, revenue: 0, orders: 0, quantity: 0 };
    }
    
    orders.forEach(order => {
      const weekNum = getWeekNumber(order.createdAt);
      const weekLabel = `Week ${weekNum}`;
      if (weeklyData[weekLabel]) {
        weeklyData[weekLabel].revenue += order.totalPrice;
        weeklyData[weekLabel].orders += 1;
        weeklyData[weekLabel].quantity += order.quantity;
      }
    });
    
    groupedData = Object.values(weeklyData);
  } else if (period === 'monthly') {
    // Last 12 months
    const monthlyData = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthLabel] = { date: monthLabel, revenue: 0, orders: 0, quantity: 0 };
    }
    
    orders.forEach(order => {
      const monthLabel = order.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthLabel]) {
        monthlyData[monthLabel].revenue += order.totalPrice;
        monthlyData[monthLabel].orders += 1;
        monthlyData[monthLabel].quantity += order.quantity;
      }
    });
    
    groupedData = Object.values(monthlyData);
  }

  // Top products
  const productSales = {};
  orders.forEach(order => {
    const productId = order.product._id.toString();
    if (!productSales[productId]) {
      productSales[productId] = {
        product: order.product,
        revenue: 0,
        quantity: 0,
        orders: 0
      };
    }
    productSales[productId].revenue += order.totalPrice;
    productSales[productId].quantity += order.quantity;
    productSales[productId].orders += 1;
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Category-wise sales
  const categorySales = {};
  orders.forEach(order => {
    const category = order.product.category || 'Others';
    if (!categorySales[category]) {
      categorySales[category] = { category, revenue: 0, quantity: 0 };
    }
    categorySales[category].revenue += order.totalPrice;
    categorySales[category].quantity += order.quantity;
  });

  res.json({
    success: true,
    data: {
      summary: {
        totalRevenue,
        totalOrders,
        totalQuantity,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      timeSeriesData: groupedData,
      topProducts,
      categorySales: Object.values(categorySales),
      period
    }
  });
});

// @desc    Get product-specific analytics
// @route   GET /api/analytics/product/:id
// @access  Private (Artisan only)
const getProductAnalytics = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Get all orders for this product
  const orders = await Order.find({ product: req.params.id }).sort({ createdAt: -1 });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Daily sales for last 30 days
  const now = new Date();
  const dailyData = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyData[dateStr] = { date: dateStr, revenue: 0, quantity: 0 };
  }

  orders.forEach(order => {
    const dateStr = order.createdAt.toISOString().split('T')[0];
    if (dailyData[dateStr]) {
      dailyData[dateStr].revenue += order.totalPrice;
      dailyData[dateStr].quantity += order.quantity;
    }
  });

  res.json({
    success: true,
    data: {
      product: {
        title: product.title,
        price: product.price,
        stock: product.stock,
        sold: product.sold
      },
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        totalQuantity,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
      },
      dailySales: Object.values(dailyData),
      recentOrders: orders.slice(0, 10)
    }
  });
});

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = {
  getSalesAnalytics,
  getProductAnalytics,
};
