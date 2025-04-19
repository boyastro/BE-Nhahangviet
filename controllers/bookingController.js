const Booking = require("../models/Booking");
const MenuItem = require("../models/MenuItem");

// ==================== Update Booking ====================
const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, phone, date, time, people, note, selectedDishes } = req.body;

    // Tính lại tổng tiền dựa trên selectedDishes mới
    let total = 0;
    for (const dish of selectedDishes) {
      const menuItem = await MenuItem.findById(dish.dishId);
      if (!menuItem) {
        return res.status(400).json({ message: "Món ăn không tồn tại." });
      }
      total += menuItem.price * dish.quantity;
    }

    // Cập nhật thông tin đặt bàn
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        name,
        phone,
        date,
        time,
        people,
        note,
        selectedDishes,
        totalAmount: total, // Gán lại tổng tiền
      },
      { new: true }
    ).populate("selectedDishes.dishId");

    res.json(updatedBooking);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật đặt bàn:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật đặt bàn." });
  }
};

module.exports = {
  updateBooking,
};
