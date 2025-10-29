const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
  userId: String,
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  courseId: String,
  coursePricing: String,
});

module.exports = mongoose.model('Order',OrderSchema);
