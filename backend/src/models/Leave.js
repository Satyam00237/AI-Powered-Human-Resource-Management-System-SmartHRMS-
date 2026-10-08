import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  leaveType: { type: String, required: true }, // 'Casual', 'Medical', 'Earned'
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // 'Pending', 'Approved', 'Rejected'
  approvedBy: { type: String, default: null }
}, { timestamps: true });

export const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
export default Leave;
