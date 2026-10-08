import { Leave } from '../models/Leave.js';
import { Employee } from '../models/Employee.js';

export const getLeaves = async (req, res) => {
  try {
    const list = await Leave.find().sort({ createdAt: -1 }).lean();
    if (req.user.role === 'Employee') {
      const filtered = list.filter(l => l.employeeId === req.user.id);
      return res.json(filtered);
    }
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

export const requestLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'Missing required leave fields' });
    }

    // Secure Leave restriction: employees can only request leave for themselves
    if (req.user.role !== 'Admin' && req.user.id !== employeeId) {
      return res.status(403).json({ error: 'Access denied. You cannot request leave for another employee.' });
    }

    const emp = await Employee.findOne({ id: employeeId });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const newRequest = new Leave({
      id: `LV${Date.now()}`,
      employeeId,
      employeeName: emp ? emp.name : 'Unknown',
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending',
      approvedBy: null
    });

    await newRequest.save();
    res.status(201).json(newRequest.toObject());
  } catch (e) {
    console.error('Leave request error:', e);
    res.status(500).json({ error: 'Failed to request leave' });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approverName } = req.body;
    if (!approverName) return res.status(400).json({ error: 'Missing approverName' });

    const leave = await Leave.findOne({ id });
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.json(leave.toObject());
    }

    leave.status = 'Approved';
    leave.approvedBy = approverName;

    // Deduct leave balance
    const emp = await Employee.findOne({ id: leave.employeeId });
    if (emp) {
      const typeKey = leave.leaveType.toLowerCase();
      if (emp.leaveBalance && emp.leaveBalance[typeKey] !== undefined) {
        emp.leaveBalance[typeKey] = Math.max(0, emp.leaveBalance[typeKey] - leave.totalDays);
      }
      await emp.save();
    }

    await leave.save();
    res.json(leave.toObject());
  } catch (e) {
    console.error('Approve leave error:', e);
    res.status(500).json({ error: 'Failed to approve leave' });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approverName } = req.body;
    if (!approverName) return res.status(400).json({ error: 'Missing approverName' });

    const leave = await Leave.findOne({ id });
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = 'Rejected';
    leave.approvedBy = approverName;
    await leave.save();
    res.json(leave.toObject());
  } catch (e) {
    console.error('Reject leave error:', e);
    res.status(500).json({ error: 'Failed to reject leave' });
  }
};

export default {
  getLeaves,
  requestLeave,
  approveLeave,
  rejectLeave
};
