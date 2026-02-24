const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['designated', 'flooder'],
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for unique booking per employee per date
bookingSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
