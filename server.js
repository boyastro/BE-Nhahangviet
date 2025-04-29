// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");
const blogRoutes = require("./routes/blogRoutes");
const adminbookingsRoutes = require("./routes/adminBookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin/bookings", adminbookingsRoutes);
app.use("/api/contact", contactRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
