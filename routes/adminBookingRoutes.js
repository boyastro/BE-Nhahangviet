const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/roleMiddleware");

// ==================== Lấy tất cả đơn đặt bàn (Admin)
router.get(
  "/",
  authenticateToken,
  authorizeAdmin("admin"),
  async (req, res) => {
    try {
      // Lấy danh sách tất cả các đơn đặt bàn, sắp xếp theo ngày tạo giảm dần
      const bookings = await Booking.find()
        .sort({ date: -1 })
        .populate("selectedDishes.dishId") // Lấy thông tin món ăn
        .populate("userId", "name email"); // Lấy thông tin người dùng

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "Không có đơn đặt bàn nào." });
      }

      res.json(bookings);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      res.status(500).json({ message: "Lỗi khi lấy danh sách đặt bàn." });
    }
  }
);

// ==================== Cập nhật trạng thái thanh toán (Admin)
router.patch(
  "/:bookingId/pay",
  authenticateToken,
  authorizeAdmin("admin"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn." });
      }

      // Cập nhật trạng thái thanh toán
      booking.isPaid = true;
      await booking.save();

      res.json({ message: "Cập nhật thanh toán thành công!", booking });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật thanh toán:", err.message);
      res.status(500).json({ message: "Lỗi khi cập nhật thanh toán." });
    }
  }
);

// ==================== Xóa đơn đặt bàn (Admin)
router.delete(
  "/:bookingId",
  authenticateToken,
  authorizeAdmin("admin"),
  async (req, res) => {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(
        req.params.bookingId
      );

      if (!deletedBooking) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn đặt bàn để xóa." });
      }

      res.json({ message: "Đơn đặt bàn đã được xóa thành công." });
    } catch (err) {
      console.error("❌ Lỗi khi xóa đơn đặt bàn:", err.message);
      res.status(500).json({ message: "Lỗi khi xóa đơn đặt bàn." });
    }
  }
);

// ==================== Cập nhật đơn đặt bàn (Admin)
router.patch(
  "/:bookingId",
  authenticateToken,
  authorizeAdmin("admin"),
  async (req, res) => {
    try {
      const { date, time, people, note, selectedDishes } = req.body;

      const booking = await Booking.findById(req.params.bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn." });
      }

      // Cập nhật các trường
      if (date) booking.date = date;
      if (time) booking.time = time;
      if (people) booking.people = people;
      if (note !== undefined) booking.note = note;
      if (selectedDishes) booking.selectedDishes = selectedDishes;

      const updated = await booking.save();

      res.json({
        message: "Cập nhật đơn đặt bàn thành công!",
        booking: updated,
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật đơn đặt bàn:", err.message);
      res.status(500).json({ message: "Lỗi khi cập nhật đơn đặt bàn." });
    }
  }
);

module.exports = router;
