// Built-in demo seed data for MongoDB (replaces local db.json on Vercel/serverless)

const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export function getDefaultSeedData() {
  const employees = [
    {
      id: 'EMP001',
      name: 'Satyam Sharma',
      email: 'satyam@company.com',
      role: 'Admin',
      department: 'Executive',
      designation: 'Chief Technology Officer',
      joinDate: getRelativeDate(-365),
      status: 'Active',
      salary: 150000,
      leaveBalance: { casual: 12, medical: 10, earned: 18 },
      attendanceStats: { checkInCount: 22, totalHours: 176, onTimeRate: 98 },
      performanceScore: 95,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam'
    },
    {
      id: 'EMP002',
      name: 'Rajesh Kumar',
      email: 'rajesh@company.com',
      role: 'Senior Manager',
      department: 'Engineering',
      designation: 'Engineering Director',
      joinDate: getRelativeDate(-280),
      status: 'Active',
      salary: 120000,
      leaveBalance: { casual: 8, medical: 9, earned: 15 },
      attendanceStats: { checkInCount: 20, totalHours: 158, onTimeRate: 90 },
      performanceScore: 91,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
    },
    {
      id: 'EMP003',
      name: 'Sarah Jenkins',
      email: 'sarah.j@company.com',
      role: 'HR Recruiter',
      department: 'Human Resources',
      designation: 'Lead Talent Acquisition',
      joinDate: getRelativeDate(-180),
      status: 'Active',
      salary: 80000,
      leaveBalance: { casual: 10, medical: 7, earned: 12 },
      attendanceStats: { checkInCount: 21, totalHours: 165, onTimeRate: 95 },
      performanceScore: 88,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: 'EMP004',
      name: 'Amit Patel',
      email: 'amit@company.com',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Full Stack Developer',
      joinDate: getRelativeDate(-90),
      status: 'Active',
      salary: 75000,
      leaveBalance: { casual: 11, medical: 10, earned: 16 },
      attendanceStats: { checkInCount: 19, totalHours: 152, onTimeRate: 92 },
      performanceScore: 85,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
    }
  ];

  const attendance = [
    {
      id: 'ATT001',
      employeeId: 'EMP001',
      date: getRelativeDate(0),
      checkInTime: '08:55:00',
      checkOutTime: null,
      hoursWorked: null,
      status: 'On Time'
    },
    {
      id: 'ATT002',
      employeeId: 'EMP002',
      date: getRelativeDate(0),
      checkInTime: '09:05:00',
      checkOutTime: null,
      hoursWorked: null,
      status: 'On Time'
    },
    {
      id: 'ATT003',
      employeeId: 'EMP003',
      date: getRelativeDate(0),
      checkInTime: '09:12:00',
      checkOutTime: null,
      hoursWorked: null,
      status: 'On Time'
    },
    {
      id: 'ATT004',
      employeeId: 'EMP004',
      date: getRelativeDate(0),
      checkInTime: '09:25:00',
      checkOutTime: null,
      hoursWorked: null,
      status: 'Late'
    }
  ];

  const leaves = [
    {
      id: 'LV001',
      employeeId: 'EMP004',
      employeeName: 'Amit Patel',
      leaveType: 'Casual',
      startDate: getRelativeDate(5),
      endDate: getRelativeDate(7),
      totalDays: 3,
      reason: 'Attending family wedding in hometown.',
      status: 'Pending',
      approvedBy: null
    },
    {
      id: 'LV002',
      employeeId: 'EMP002',
      employeeName: 'Rajesh Kumar',
      leaveType: 'Medical',
      startDate: getRelativeDate(-14),
      endDate: getRelativeDate(-13),
      totalDays: 2,
      reason: 'Dental surgery and post-op recovery.',
      status: 'Approved',
      approvedBy: 'Satyam Sharma'
    },
    {
      id: 'LV003',
      employeeId: 'EMP003',
      employeeName: 'Sarah Jenkins',
      leaveType: 'Earned',
      startDate: getRelativeDate(-30),
      endDate: getRelativeDate(-25),
      totalDays: 6,
      reason: 'Annual vacation trip.',
      status: 'Approved',
      approvedBy: 'Satyam Sharma'
    }
  ];

  const jobs = [
    {
      id: 'JOB001',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Remote, US',
      status: 'Open',
      description: 'Looking for a senior developer proficient in React, Node.js, TypeScript, and MongoDB. Minimum 4 years of experience building scalable SaaS web platforms.',
      candidatesCount: 2
    },
    {
      id: 'JOB002',
      title: 'HR Operations Specialist',
      department: 'Human Resources',
      type: 'Full-time',
      location: 'New York, NY',
      status: 'Open',
      description: 'Seeking an HR Specialist experienced in onboarding, payroll compliance, benefits administration, and HRMS tools like Workday or BambooHR.',
      candidatesCount: 1
    },
    {
      id: 'JOB003',
      title: 'Product Designer (UI/UX)',
      department: 'Design',
      type: 'Full-time',
      location: 'San Francisco, CA',
      status: 'Open',
      description: 'We need a creative UI/UX designer with extensive Figma experience, design systems expertise, and a track record of crafting intuitive web dashboards.',
      candidatesCount: 1
    }
  ];

  const candidates = [
    {
      id: 'CAN001',
      jobId: 'JOB001',
      jobTitle: 'Senior Full Stack Developer',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      resumeText: 'Senior Software Engineer with 5+ years experience building web applications using React, Node.js, Express, TypeScript, and PostgreSQL/MongoDB. Led frontend architecture at CloudScale Inc.',
      skills: 'React, Node.js, TypeScript, Express, MongoDB, REST APIs, Docker',
      matchScore: 91,
      status: 'Interviewing',
      evaluation: {
        score: 91,
        strengths: [
          'Direct match on core stack: React, Node.js, TypeScript, MongoDB',
          '5+ years of relevant experience meets senior criteria',
          'Experience leading architecture aligns with job level'
        ],
        weaknesses: [
          'PostgreSQL primary in previous role, MongoDB secondary'
        ],
        recommendation: 'Strong Match'
      },
      interviewReport: null
    },
    {
      id: 'CAN002',
      jobId: 'JOB001',
      jobTitle: 'Senior Full Stack Developer',
      name: 'Jessica Taylor',
      email: 'jessica.t@example.com',
      resumeText: 'Full Stack Web Developer with 3 years experience. Skilled in Vue.js, Python, Django, and MySQL. Eager to transition to a modern Node/React stack.',
      skills: 'Vue.js, Python, Django, MySQL, JavaScript, HTML, CSS',
      matchScore: 54,
      status: 'Screening',
      evaluation: {
        score: 54,
        strengths: [
          'Solid full stack development background with 3 years experience',
          'Good JavaScript and frontend fundamentals'
        ],
        weaknesses: [
          'Primary stack is Python/Django and Vue rather than Node.js and React',
          'Lacks TypeScript and MongoDB experience requested for this role'
        ],
        recommendation: 'Potential Match'
      },
      interviewReport: null
    },
    {
      id: 'CAN003',
      jobId: 'JOB002',
      jobTitle: 'HR Operations Specialist',
      name: 'David Miller',
      email: 'david.m@example.com',
      resumeText: 'Certified HR Professional (SHRM-CP) with 4 years experience in HR operations, benefits management, payroll coordination, and employee relations.',
      skills: 'SHRM-CP, Benefits Administration, Payroll Coordination, Employee Onboarding, Compliance',
      matchScore: 88,
      status: 'Shortlisted',
      evaluation: {
        score: 88,
        strengths: [
          'SHRM-CP certified with 4 years specialized HR operations experience',
          'Direct experience in benefits, payroll, and compliance'
        ],
        weaknesses: [
          'Limited exposure to automated AI-driven HRMS platforms'
        ],
        recommendation: 'Strong Match'
      },
      interviewReport: null
    },
    {
      id: 'CAN004',
      jobId: 'JOB003',
      jobTitle: 'Product Designer (UI/UX)',
      name: 'Aisha Patel',
      email: 'aisha.design@example.com',
      resumeText: 'Lead UI/UX Designer with 6 years experience crafting design systems, user research, interactive wireframing, and Figma component libraries for B2B SaaS products.',
      skills: 'Figma, Design Systems, User Research, Wireframing, Prototyping, B2B SaaS',
      matchScore: 94,
      status: 'Interviewing',
      evaluation: {
        score: 94,
        strengths: [
          '6 years experience specializing in B2B SaaS dashboards',
          'Expertise in Figma design systems and user research aligns perfectly'
        ],
        weaknesses: [
          'None identified for core requirements'
        ],
        recommendation: 'Strong Match'
      },
      interviewReport: null
    }
  ];

  const policies = [
    {
      title: 'Leave Policy',
      content: 'Employees are entitled to 12 days of Casual Leave, 10 days of Medical Leave, and 18 days of Earned Leave annually. Leave requests must be submitted at least 48 hours in advance through the SmartHRMS portal and require manager approval.'
    },
    {
      title: 'Working Hours & Attendance',
      content: 'Standard working hours are 9:00 AM to 6:00 PM local time, Monday through Friday. Daily check-in before 9:15 AM is considered on-time. Flexible hours may be arranged with department manager agreement.'
    },
    {
      title: 'Code of Conduct',
      content: 'SmartHRMS fosters an inclusive, safe, and professional work environment. All team members are expected to maintain the highest standards of integrity, respect, and confidentiality regarding company and customer data.'
    },
    {
      title: 'Remote Work Policy',
      content: 'Eligible roles may work remotely up to 3 days per week with manager approval. Remote employees must maintain core hours availability on Slack/Teams and ensure dependable broadband connectivity.'
    }
  ];

  return { employees, attendance, leaves, jobs, candidates, policies };
}

export default getDefaultSeedData;
