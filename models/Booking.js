// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    phone: String,
    date: String,
    time: String,
    people: Number,
    note: String,
    selectedDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
  });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
