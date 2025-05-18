require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRouter");
const userRoutes = require("./routes/userRoutes");

const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const productRoutes = require("./routes/productRoutes");
const promoRoutes = require("./routes/promoRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = ['http://localhost:3000']; // Add your frontend URL

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use("/api",addressRoutes)
app.use("/api",cartRoutes)
app.use("/api",categoryRoutes)
app.use("/api",complaintRoutes)
app.use("/api",inventoryRoutes)
app.use("/api",orderRoutes)
app.use("/api",paymentRoutes)
app.use("/api",productRoutes)
app.use("/api",promoRoutes)
app.use("/api",reviewRoutes)
app.use("/api",wishlistRoutes)

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
}); 

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
