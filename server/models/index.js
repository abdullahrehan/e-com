
// Import all models
const User = require('./schemas/User');
const Address = require('./schemas/Address');
const Cart = require('./schemas/Cart');
const PaymentMethod = require('./schemas/Payment');
const Product = require('./schemas/Product');
const Category = require('./schemas/Category');
const Order = require('./schemas/Order');
const Review = require('./schemas/Review');
const Wishlist = require('./schemas/Wishlist');
const Complaint = require('./schemas/Complaint');
const SalesReport = require('./schemas/SalesReport');
const UserBehavior = require('./schemas/UserBehavior');
const PromoCode = require('./schemas/Promo');
const Inventory = require('./schemas/Inventory');

// Export all models
module.exports = {
  User,
  Cart,
  Address,
  PaymentMethod,
  Product,
  Category,
  Order,
  Review,
  Wishlist,
  Complaint,
  SalesReport,
  UserBehavior,
  PromoCode,
  Inventory
};
