import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, default: 'password' },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joinDate: { type: String, required: true },
  status: { type: String, default: 'Active' },
  salary: { type: Number, required: true },
  leaveBalance: {
    casual: { type: Number, default: 12 },
    medical: { type: Number, default: 10 },
    earned: { type: Number, default: 18 }
  },
  attendanceStats: {
    checkInCount: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    onTimeRate: { type: Number, default: 100 }
  },
  performanceScore: { type: Number, default: 85 },
  avatar: { type: String }
}, { timestamps: true });

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;
