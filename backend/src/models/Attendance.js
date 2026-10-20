import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true },
  date: { type: String, required: true },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String, default: null },
  hoursWorked: { type: Number, default: null },
  status: { type: String, required: true } // 'On Time' or 'Late'
}, { timestamps: true });

export const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;
