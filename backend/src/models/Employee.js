const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    batch: {
      type: String,
      enum: ['batch1', 'batch2'],
      required: true,
    },
    designatedSeatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      default: null,
    },
    department: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
