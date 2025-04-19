// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const MenuItem = require("../models/MenuItem");
const authenticateToken = require("../middleware/authMiddleware");

// ==================== Tính tổng tiền
const calculateTotalAmount = async (selectedDishes) => {
  let total = 0;
  for (const item of selectedDishes) {
    const menuItem = await MenuItem.findById(item.dishId);
    if (menuItem) {
      total += menuItem.price * item.quantity;
    }
  }
  return total;
};

// ==================== Đặt bàn (POST)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, phone, date, time, people, note, selectedDishes } = req.body;

    if (!name || !phone || !date || !time || !people) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    const userId = req.user.id;

    const formattedDishes =
      selectedDishes?.map((dish) => ({
        dishId: dish.dishId,
        quantity: dish.quantity || 1,
      })) || [];

    const totalAmount = await calculateTotalAmount(formattedDishes);

    const newBooking = new Booking({
      userId,
      name,
      phone,
      date,
      time,
      people,
      note,
      selectedDishes: formattedDishes,
      totalAmount,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Đặt bàn thành công!", booking: newBooking });
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn đặt bàn:", err.message);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo đơn đặt bàn. Vui lòng thử lại sau." });
  }
});

// ==================== Lịch sử đặt bàn (GET)
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .sort({ date: -1 })
      .populate("selectedDishes.dishId");

    res.json(bookings);
  } catch (err) {
    console.error("❌ Lỗi khi lấy lịch sử đặt bàn:", err.message);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử đặt bàn" });
  }
});

// ==================== Chỉnh sửa đặt bàn (PUT)
router.put("/:bookingId", authenticateToken, async (req, res) => {
  try {
    const { name, phone, date, time, people, note, selectedDishes } = req.body;
    const userId = req.user.id;

    if (!name || !phone || !date || !time || !people) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    const formattedDishes =
      selectedDishes?.map((dish) => ({
        dishId: dish.dishId,
        quantity: dish.quantity || 1,
      })) || [];

    const totalAmount = await calculateTotalAmount(formattedDishes);

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId },
      {
        name,
        phone,
        date,
        time,
        people,
        note,
        selectedDishes: formattedDishes,
        totalAmount,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt bàn cần chỉnh sửa." });
    }

    res.json({ message: "Cập nhật thành công!", booking: updatedBooking });
  } catch (err) {
    console.error("❌ Lỗi khi chỉnh sửa đặt bàn:", err.message);
    res.status(500).json({ message: "Lỗi khi chỉnh sửa đặt bàn." });
  }
});

// ==================== Thêm món ăn (PUT)
router.put("/:bookingId/addDish", authenticateToken, async (req, res) => {
  try {
    const { dishId, quantity } = req.body;
    const userId = req.user.id;

    if (!dishId || !quantity) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp dishId và quantity." });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId },
      { $push: { selectedDishes: { dishId, quantity } } },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt bàn cần thêm món." });
    }

    const totalAmount = await calculateTotalAmount(
      updatedBooking.selectedDishes
    );
    updatedBooking.totalAmount = totalAmount;
    await updatedBooking.save();

    res.json({ message: "Thêm món ăn thành công!", booking: updatedBooking });
  } catch (err) {
    console.error("❌ Lỗi khi thêm món ăn:", err.message);
    res.status(500).json({ message: "Lỗi khi thêm món ăn." });
  }
});

// ==================== Xóa món ăn (PUT)
router.put("/:bookingId/removeDish", authenticateToken, async (req, res) => {
  try {
    const { dishId } = req.body;
    const userId = req.user.id;

    if (!dishId) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp dishId để xóa." });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId },
      { $pull: { selectedDishes: { dishId } } },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt bàn cần xóa món." });
    }

    const totalAmount = await calculateTotalAmount(
      updatedBooking.selectedDishes
    );
    updatedBooking.totalAmount = totalAmount;
    await updatedBooking.save();

    res.json({ message: "Xóa món ăn thành công!", booking: updatedBooking });
  } catch (err) {
    console.error("❌ Lỗi khi xóa món ăn:", err.message);
    res.status(500).json({ message: "Lỗi khi xóa món ăn." });
  }
});

// ==================== Xóa đặt bàn (DELETE)
router.delete("/:bookingId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedBooking = await Booking.findOneAndDelete({
      _id: req.params.bookingId,
      userId,
    });

    if (!deletedBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt bàn cần xóa." });
    }

    res.json({ message: "Đặt bàn đã được xóa thành công." });
  } catch (err) {
    console.error("❌ Lỗi khi xóa đặt bàn:", err.message);
    res.status(500).json({ message: "Lỗi khi xóa đặt bàn." });
  }
});

module.exports = router;
