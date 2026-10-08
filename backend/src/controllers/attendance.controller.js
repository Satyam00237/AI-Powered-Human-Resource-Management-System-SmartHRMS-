import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';

export const getAttendance = async (req, res) => {
  try {
    const list = await Attendance.find().sort({ date: -1, checkInTime: -1 }).lean();
    if (req.user.role === 'Employee') {
      const filtered = list.filter(a => a.employeeId === req.user.id);
      return res.json(filtered);
    }
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { employeeId, localDate, localTime } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'Missing employeeId' });

    // Secure Check-In restriction: employees can only check in for themselves
    if (req.user.role !== 'Admin' && req.user.id !== employeeId) {
      return res.status(403).json({ error: 'Access denied. You cannot check in for another employee.' });
    }

    const today = localDate || new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const exists = await Attendance.findOne({ employeeId, date: today });
    if (exists) return res.json(exists.toObject());

    const time = localTime || new Date().toTimeString().split(' ')[0];
    const checkInHour = parseInt(time.split(':')[0]);
    const checkInMinute = parseInt(time.split(':')[1]);

    // 09:15 AM limit for On Time
    const status = checkInHour < 9 || (checkInHour === 9 && checkInMinute <= 15) ? 'On Time' : 'Late';

    const newEntry = new Attendance({
      id: `ATT${Date.now()}`,
      employeeId,
      date: today,
      checkInTime: time,
      checkOutTime: null,
      hoursWorked: null,
      status
    });

    await newEntry.save();

    // Update employee checkInCount & onTimeRate
    const emp = await Employee.findOne({ id: employeeId });
    if (emp) {
      emp.attendanceStats.checkInCount += 1;

      const empAtt = await Attendance.find({ employeeId });
      const onTimeCount = empAtt.filter(a => a.status === 'On Time').length;
      emp.attendanceStats.onTimeRate = Math.round((onTimeCount / empAtt.length) * 100);
      await emp.save();
    }

    res.json(newEntry.toObject());
  } catch (e) {
    console.error('Check-in error:', e);
    res.status(500).json({ error: 'Check-in failed' });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { employeeId, localDate, localTime } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'Missing employeeId' });

    // Secure Check-Out restriction: employees can only check out for themselves
    if (req.user.role !== 'Admin' && req.user.id !== employeeId) {
      return res.status(403).json({ error: 'Access denied. You cannot check out for another employee.' });
    }

    const today = localDate || new Date().toISOString().split('T')[0];
    const entry = await Attendance.findOne({ employeeId, date: today, checkOutTime: null });

    if (!entry) {
      return res.status(400).json({ error: 'No active check-in found for today' });
    }

    const time = localTime || new Date().toTimeString().split(' ')[0];
    entry.checkOutTime = time;

    // Calculate hours worked
    const [inH, inM, inS] = entry.checkInTime.split(':').map(Number);
    const [outH, outM, outS] = time.split(':').map(Number);
    const inDate = new Date(2000, 0, 1, inH, inM, inS);
    const outDate = new Date(2000, 0, 1, outH, outM, outS);
    const hours = Math.round(((outDate - inDate) / 1000 / 60 / 60) * 100) / 100;

    entry.hoursWorked = hours;
    await entry.save();

    // Update employee totalHours
    const emp = await Employee.findOne({ id: employeeId });
    if (emp) {
      emp.attendanceStats.totalHours = Math.round((emp.attendanceStats.totalHours + hours) * 10) / 10;
      await emp.save();
    }

    res.json(entry.toObject());
  } catch (e) {
    console.error('Check-out error:', e);
    res.status(500).json({ error: 'Check-out failed' });
  }
};

export default {
  getAttendance,
  checkIn,
  checkOut
};
