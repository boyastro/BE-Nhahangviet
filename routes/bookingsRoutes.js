const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authenticateToken = require('../middleware/authMiddleware');

// Đặt bàn (bao gồm lưu thông tin userId)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, date, time, people, note, selectedDishes } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !phone || !date || !time || !people) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const userId = req.user.id; // Lấy userId từ thông tin người dùng đã đăng nhập (ví dụ từ token)

    const newBooking = new Booking({
      userId,
      name,
      phone,
      date,
      time,
      people,
      note,
      selectedDishes
    });

    // Lưu đặt bàn vào cơ sở dữ liệu
    await newBooking.save();
    res.status(201).json({ message: 'Đặt bàn thành công!', booking: newBooking });
  } catch (err) {
    console.error('❌ Lỗi khi tạo đơn đặt bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi tạo đơn đặt bàn. Vui lòng thử lại sau.' });
  }
});

// Lấy lịch sử đặt bàn của người dùng (chỉ lấy đặt bàn của người dùng đã đăng nhập)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .sort({ date: -1 })
      .populate('selectedDishes'); // 👈 thêm dòng này để lấy đầy đủ thông tin món ăn

    res.json(bookings);
  } catch (err) {
    console.error('❌ Lỗi khi lấy lịch sử đặt bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử đặt bàn' });
  }
});

// Chỉnh sửa thông tin đặt bàn (ngày, giờ, số người, ghi chú, ... )
router.put('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { name, phone, date, time, people, note, selectedDishes } = req.body;
    const userId = req.user.id;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !phone || !date || !time || !people) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId }, // Chỉ cho phép chỉnh sửa của user đang đăng nhập
      { name, phone, date, time, people, note, selectedDishes },
      { new: true } // Trả về booking đã được cập nhật
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn cần chỉnh sửa.' });
    }

    res.json({ message: 'Cập nhật thành công!', booking: updatedBooking });
  } catch (err) {
    console.error('❌ Lỗi khi chỉnh sửa đặt bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi chỉnh sửa đặt bàn.' });
  }
});

// Thêm món ăn vào đặt bàn
router.put('/:bookingId/addDish', authenticateToken, async (req, res) => {
  try {
    const { dishId, name, image } = req.body;
    const userId = req.user.id;

    // Kiểm tra món ăn
    if (!dishId || !name || !image) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin món ăn.' });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId },
      { $push: { selectedDishes: { _id: dishId, name, image } } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn cần thêm món.' });
    }

    res.json({ message: 'Thêm món ăn thành công!', booking: updatedBooking });
  } catch (err) {
    console.error('❌ Lỗi khi thêm món ăn:', err.message);
    res.status(500).json({ message: 'Lỗi khi thêm món ăn.' });
  }
});

// Xóa món ăn khỏi đặt bàn
router.put('/:bookingId/removeDish', authenticateToken, async (req, res) => {
  try {
    const { dishId } = req.body;
    const userId = req.user.id;

    if (!dishId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp món ăn cần xóa.' });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId },
      { $pull: { selectedDishes: { _id: dishId } } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn cần xóa món.' });
    }

    res.json({ message: 'Xóa món ăn thành công!', booking: updatedBooking });
  } catch (err) {
    console.error('❌ Lỗi khi xóa món ăn:', err.message);
    res.status(500).json({ message: 'Lỗi khi xóa món ăn.' });
  }
});

// Xóa đặt bàn
router.delete('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedBooking = await Booking.findOneAndDelete({ _id: req.params.bookingId, userId });

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn cần xóa.' });
    }

    res.json({ message: 'Đặt bàn đã được xóa thành công.' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa đặt bàn:', err.message);
    res.status(500).json({ message: 'Lỗi khi xóa đặt bàn.' });
  }
});

module.exports = router;
