import { Employee } from '../models/Employee.js';

export const getMe = async (req, res) => {
  try {
    const user = await Employee.findOne({ id: req.user.id }).lean();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Employee profile not found' });
    }
  } catch (e) {
    console.error('Error in /api/employees/me:', e);
    res.status(500).json({ error: 'Failed to retrieve profile', details: e.message || String(e) });
  }
};

export const updateMeProfile = async (req, res) => {
  try {
    const emp = await Employee.findOne({ id: req.user.id });
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const data = req.body;
    if (data.name !== undefined) emp.name = data.name;
    if (data.email !== undefined) emp.email = data.email;
    if (data.password !== undefined) emp.password = data.password;
    if (data.avatar !== undefined) emp.avatar = data.avatar;

    await emp.save();
    res.json(emp.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: 1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, role, department, designation, salary, password } = req.body;

    if (!name || !email || !role || !department || !designation || !salary || !password) {
      return res.status(400).json({ error: 'Missing required employee fields, including password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await Employee.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ error: 'An employee with this email already exists' });
    }

    const count = await Employee.countDocuments();
    const newId = `EMP${String(count + 1).padStart(3, '0')}`;

    const newEmp = new Employee({
      id: newId,
      name,
      email: normalizedEmail,
      role,
      password,
      department,
      designation,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      salary: parseFloat(salary),
      leaveBalance: { casual: 12, medical: 10, earned: 18 },
      attendanceStats: { checkInCount: 0, totalHours: 0, onTimeRate: 100 },
      performanceScore: 85,
      avatar: req.body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    });

    await newEmp.save();
    res.status(201).json(newEmp.toObject());
  } catch (e) {
    console.error('Error creating employee:', e);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findOne({ id });
    if (emp) {
      emp.status = emp.status === 'Active' ? 'Inactive' : 'Active';
      await emp.save();
      res.json(emp.toObject());
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to update employee status' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findOne({ id });
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const data = req.body;
    if (data.name !== undefined) emp.name = data.name;
    if (data.email !== undefined) emp.email = data.email.toLowerCase().trim();
    if (data.role !== undefined) emp.role = data.role;
    if (data.department !== undefined) emp.department = data.department;
    if (data.designation !== undefined) emp.designation = data.designation;
    if (data.salary !== undefined) emp.salary = parseFloat(data.salary);
    if (data.status !== undefined) emp.status = data.status;
    if (data.avatar !== undefined) emp.avatar = data.avatar;

    await emp.save();
    res.json(emp.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export default {
  getMe,
  updateMeProfile,
  getAllEmployees,
  createEmployee,
  toggleStatus,
  updateEmployee
};
