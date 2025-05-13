import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Define icons
const ArrowLeft = getIcon('ArrowLeft');
const Briefcase = getIcon('Briefcase');
const Users = getIcon('Users');
const Calendar = getIcon('Calendar');
const Building = getIcon('Building');

export default function Departments() {
  const navigate = useNavigate();

  useEffect(() => {
    // Notify user that departments are being loaded
    toast.success('Departments loaded successfully', {
      icon: "🏢"
    });
  }, []);

  // Mock department data
  const departments = [
    { 
      id: 1, 
      name: "Engineering", 
      employees: 42, 
      manager: "John Doe", 
      budget: "$1.2M",
      projects: 8,
      icon: Building
    },
    { 
      id: 2, 
      name: "Human Resources", 
      employees: 18, 
      manager: "Jane Smith", 
      budget: "$450K",
      projects: 3,
      icon: Users
    },
    { 
      id: 3, 
      name: "Marketing", 
      employees: 35, 
      manager: "Mark Johnson", 
      budget: "$780K",
      projects: 12,
      icon: Building
    },
    { 
      id: 4, 
      name: "Finance", 
      employees: 24, 
      manager: "Sarah Williams", 
      budget: "$950K",
      projects: 5,
      icon: Building
    },
    { 
      id: 5, 
      name: "Operations", 
      employees: 31, 
      manager: "Michael Brown", 
      budget: "$680K",
      projects: 7,
      icon: Building
    },
    { 
      id: 6, 
      name: "Customer Support", 
      employees: 29, 
      manager: "Lisa Taylor", 
      budget: "$520K",
      projects: 4,
      icon: Users
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl sm:text-3xl font-bold">Departments</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dept.id * 0.1 }}
              className="card-neu hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toast.info(`Viewing ${dept.name} department details`, { icon: "🏢" })}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold">{dept.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-surface-600 dark:text-surface-300">{dept.employees} Employees</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-surface-600 dark:text-surface-300">{dept.projects} Projects</span>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-surface-200 dark:border-surface-700">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Manager: {dept.manager}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Budget: {dept.budget}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}