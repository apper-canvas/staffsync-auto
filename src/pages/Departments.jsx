import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { fetchDepartments, deleteDepartment } from '../services/departmentService';
import { useContext } from 'react';
import { AuthContext } from '../App';

// Define icons
const ArrowLeft = getIcon('ArrowLeft');
const Briefcase = getIcon('Briefcase');
const Users = getIcon('Users');
const Calendar = getIcon('Calendar');
const Building = getIcon('Building');

export default function Departments() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadDepartments = async () => {
      setLoading(true);
      try {
        const response = await fetchDepartments();
        setDepartments(response.data || []);
        toast.success('Departments loaded successfully', {
          icon: "🏢"
        });
      } catch (err) {
        setError('Failed to load departments');
        console.error('Error loading departments:', err);
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };
    
    loadDepartments();
  }, [isAuthenticated]);

  const handleDeleteDepartment = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id)
        .then(() => {
          toast.success('Department deleted successfully');
          setDepartments(departments.filter(dept => dept.Id !== id));
        })
        .catch(err => {
          toast.error('Failed to delete department');
          console.error(err);
        });
    }
  };

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

        {/* Add Department Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/department/add')}
            className="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Department
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-surface-600 dark:text-surface-400">Loading departments...</p>
        ) : error ? (
          <p className="text-center py-8 text-red-500">{error}</p>
        ) : departments.length === 0 ? (
          <p className="text-center py-8 text-surface-600 dark:text-surface-400">No departments found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
            <motion.div
              key={dept.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-neu hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/department/${dept.Id}`)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold">{dept.Name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-surface-600 dark:text-surface-300">Employees</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-surface-600 dark:text-surface-300">{dept.projects || 0} Projects</span>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-surface-200 dark:border-surface-700">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Manager: {dept.manager || 'N/A'}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Budget: ${dept.budget?.toLocaleString() || '0'}</p>
                </div>
                <div className="col-span-2 mt-2 pt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/department/edit/${dept.Id}`);
                    }}
                    className="p-1 rounded-lg text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                    aria-label="Edit department"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDepartment(dept.Id);
                    }}
                    className="p-1 rounded-lg text-surface-600 hover:text-accent dark:text-surface-400 dark:hover:text-accent ml-2"
                    aria-label="Delete department"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}