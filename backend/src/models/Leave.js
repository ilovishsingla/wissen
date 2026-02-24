const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['personal', 'sick', 'casual', 'other'],
      default: 'casual',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

leaveSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
