import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { fetchLeaveRequests } from '../services/leaveRequestService';

// Import icons
const ArrowLeft = getIcon('ArrowLeft');
const Calendar = getIcon('Calendar');
const Users = getIcon('Users');
const Search = getIcon('Search');

export default function OnLeaveEmployees() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch leave requests
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await fetchLeaveRequests({ 
          status: 'Approved',
        });
        
        setEmployeesOnLeave(response.data || []);
      } catch (err) {
        setError('Failed to load leave requests');
        console.error('Error loading leave requests:', err);
        toast.error('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaveRequests();
  }, [isAuthenticated, searchTerm]);

  // Filter employees based on search term
  const filteredEmployees = employeesOnLeave.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle back button click
  const handleBack = () => {
    navigate('/');
    toast.info('Returned to dashboard', {
      icon: "🏠"
    });
  };

  // Handle employee details click
  const handleViewDetails = (employee) => {
    toast.info(`Viewing ${employee.name}'s details`, {
      icon: "👤"
    });
    // In a real app, you might navigate to a detailed view
    // navigate(`/employees/${employee.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="p-2 mr-4 rounded-lg bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 shadow-card transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-amber-500" />
              Employees On Leave
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              View and manage employees currently on leave
            </p>
          </div>
        </div>

        {/* Stats card */}
        <div className="card-neu mb-6 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{employeesOnLeave.length}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">Employees Currently On Leave</p>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="card mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          </div>
        </div>
        
        {/* Employees on leave list */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-surface-600 dark:text-surface-400">Loading leave requests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-surface-600 dark:text-surface-400">No employees currently on leave</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-100 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Employee</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Leave Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date Range</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredEmployees.map((leave) => (
                    <motion.tr 
                      key={leave.Id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{leave.employee?.Name || 'N/A'}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">{leave.employee?.position || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.employee?.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.leave_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{leave.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleViewDetails(leave)} className="btn btn-primary text-sm py-1">View Details</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}