import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Import icons
const ArrowLeft = getIcon('ArrowLeft');
const Search = getIcon('Search');
const Users = getIcon('Users');
const Mail = getIcon('Mail');
const Phone = getIcon('Phone');
const Calendar = getIcon('Calendar');
const Briefcase = getIcon('Briefcase');

export default function NewHireEmployees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data for new hire employees
  const newHireEmployees = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      email: "sarah.johnson@staffsync.com",
      phone: "+1 (555) 123-4567",
      position: "Front-end Developer",
      department: "Engineering",
      joinDate: "2023-05-15",
      status: "active"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "MC",
      email: "michael.chen@staffsync.com",
      phone: "+1 (555) 987-6543",
      position: "UX Designer",
      department: "Design",
      joinDate: "2023-05-18",
      status: "training"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "ER",
      email: "emily.rodriguez@staffsync.com",
      phone: "+1 (555) 234-5678",
      position: "Marketing Specialist",
      department: "Marketing",
      joinDate: "2023-05-20",
      status: "active"
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "DK",
      email: "david.kim@staffsync.com",
      phone: "+1 (555) 876-5432",
      position: "Data Analyst",
      department: "Analytics",
      joinDate: "2023-05-22",
      status: "training"
    },
    {
      id: 5,
      name: "Jessica Patel",
      avatar: "JP",
      email: "jessica.patel@staffsync.com",
      phone: "+1 (555) 345-6789",
      position: "HR Coordinator",
      department: "Human Resources",
      joinDate: "2023-05-25",
      status: "active"
    }
  ];

  // Filter employees based on search term and filter
  const filteredEmployees = newHireEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || employee.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (employee) => {
    toast.info(`Viewing details for ${employee.name}`, {
      icon: "👤"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 sm:p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="mr-4 p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-500" />
            New Hire Employees
          </h1>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, position, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="py-2 px-4 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="training">In Training</option>
        </select>
      </div>

      {/* Employee list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-neu p-6 rounded-xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-2 h-2 m-3 rounded-full ${employee.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {employee.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{employee.position}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-sm"><Mail className="w-4 h-4 mr-2 text-surface-400" /> {employee.email}</p>
                <p className="flex items-center text-sm"><Phone className="w-4 h-4 mr-2 text-surface-400" /> {employee.phone}</p>
                <p className="flex items-center text-sm"><Briefcase className="w-4 h-4 mr-2 text-surface-400" /> {employee.department}</p>
                <p className="flex items-center text-sm"><Calendar className="w-4 h-4 mr-2 text-surface-400" /> Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleViewDetails(employee)} className="mt-4 w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">View Details</button>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center py-8 text-surface-500 dark:text-surface-400">No employees found matching your criteria.</p>
        )}
      </div>
    </motion.div>
  );
}