import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { fetchEmployees, deleteEmployee } from '../services/employeeService';

// Import icons
const Users = getIcon('Users');
const Search = getIcon('Search');
const ChevronLeft = getIcon('ChevronLeft');
const Filter = getIcon('Filter');
const ArrowUpDown = getIcon('ArrowUpDown');
const Eye = getIcon('Eye');
const Edit = getIcon('Edit');
const Trash = getIcon('Trash');
const ArrowLeft = getIcon('ArrowLeft');
const ArrowRight = getIcon('ArrowRight');

export default function AllEmployees() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch employees from API
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadEmployees = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build filters for API call
        const filters = {};
        
        if (searchTerm) {
          filters.name = searchTerm;
        }
        
        if (selectedDepartment !== 'All Departments') {
          filters.department = selectedDepartment;
        }
        
        if (statusFilter !== 'All Statuses') {
          filters.status = statusFilter;
        }
        
        // Add sorting parameters
        filters.sortField = sortField === 'name' ? 'Name' : 
                           sortField === 'department' ? 'department' : 
                           sortField === 'position' ? 'position' : 'Name';
        filters.sortDirection = sortDirection;
        
        const response = await fetchEmployees(filters, currentPage, itemsPerPage);
        setEmployees(response.data || []);
        setTotalCount(response.totalCount || 0);
      } catch (err) {
        setError('Failed to load employees. Please try again.');
        console.error(err);
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployees();
  }, [isAuthenticated, searchTerm, selectedDepartment, statusFilter, sortField, sortDirection, currentPage]);
  ];

  // Department options
  const departments = ["All Departments", "Engineering", "Marketing", "HR", "Finance", "Design", "Sales"];
  
  // Status options
  const statuses = ["All Statuses", "active", "inactive", "on leave"];

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All Departments' || 
                              employee.department === selectedDepartment;
                              
      const matchesStatus = statusFilter === 'All Statuses' || 
                          employee.status === statusFilter;
                          
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      const fieldA = a[sortField].toLowerCase();
      const fieldB = b[sortField].toLowerCase();
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle employee actions
  const handleViewEmployee = (id) => {
    navigate(`/employee/${id}`);
  };

  const handleEditEmployee = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      deleteEmployee(id)
        .then(() => {
          toast.success('Employee deleted successfully');
          // Refresh the employee list
          fetchEmployees({
            sortField: sortField,
            sortDirection: sortDirection
          }, currentPage, itemsPerPage)
            .then(response => {
              setEmployees(response.data || []);
              setTotalCount(response.totalCount || 0);
            });
        })
        .catch(err => toast.error('Failed to delete employee'))
        .finally(() => setLoading(false));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link to="/" className="mr-4 p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary" />
                All Employees
              </h1>
              <p className="text-surface-500 dark:text-surface-400 text-sm">
                View and manage all employees
              </p>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-3">
            <select
              className="input-field"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-3">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employees Table */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-surface-600 dark:text-surface-400">Loading employees...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-100 dark:bg-surface-700 text-left">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <button
                      className="flex items-center text-sm font-medium text-surface-700 dark:text-surface-300"
                      onClick={() => handleSort('name')}
                    >
                      Employee
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left hidden sm:table-cell">
                    <button
                      className="flex items-center text-sm font-medium text-surface-700 dark:text-surface-300"
                      onClick={() => handleSort('department')}
                    >
                      Department
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">
                    <button
                      className="flex items-center text-sm font-medium text-surface-700 dark:text-surface-300"
                      onClick={() => handleSort('position')}
                    >
                      Position
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">
                    <button
                      className="flex items-center text-sm font-medium text-surface-700 dark:text-surface-300"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {employees.length > 0 ? (
                  employees.map(employee => (
                    <tr key={employee.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {employee.Name?.substring(0, 2).toUpperCase() || 'NA'}
                          </div>
                          <div>
                            <div className="font-medium">{employee.Name}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400">{employee.email}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        {employee.department}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {employee.position}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          employee.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleViewEmployee(employee.Id)}
                            className="p-1 rounded-lg text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="View employee"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditEmployee(employee.Id)}
                            className="p-1 rounded-lg text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Edit employee"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.Id)}
                            className="p-1 rounded-lg text-surface-600 hover:text-accent dark:text-surface-400 dark:hover:text-accent hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Delete employee"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-surface-500 dark:text-surface-400">
                      No employees found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Add Employee Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/employee/add')}
            className="btn btn-primary flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Employee
          </button>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-surface-300 dark:border-surface-700 disabled:opacity-50 
              disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-surface-600 dark:text-surface-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-surface-300 dark:border-surface-700 disabled:opacity-50 
              disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}