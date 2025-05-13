import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Define all icons
const UserPlus = getIcon('UserPlus');
const Search = getIcon('Search');
const Filter = getIcon('Filter');
const Edit = getIcon('Edit');
const Trash = getIcon('Trash');
const Check = getIcon('Check');
const X = getIcon('X');
const ChevronLeft = getIcon('ChevronLeft');
const ChevronRight = getIcon('ChevronRight');
const Plus = getIcon('Plus');

export default function MainFeature({ initialStatus = 'All Statuses' }) {
  // Initial employee data
  const initialEmployees = [
    { 
      id: 1, 
      firstName: 'Sarah', 
      lastName: 'Johnson', 
      email: 'sarah.johnson@example.com', 
      department: 'Marketing', 
      position: 'Marketing Director',
      status: 'active' 
    },
    { 
      id: 2, 
      firstName: 'Michael', 
      lastName: 'Chen', 
      email: 'michael.chen@example.com', 
      department: 'Engineering', 
      position: 'Senior Developer',
      status: 'active' 
    },
    { 
      id: 3, 
      firstName: 'Jessica', 
      lastName: 'Williams', 
      email: 'jessica.williams@example.com', 
      department: 'Human Resources', 
      position: 'HR Manager',
      status: 'on leave' 
    },
    { 
      id: 4, 
      firstName: 'David', 
      lastName: 'Smith', 
      email: 'david.smith@example.com', 
      department: 'Finance', 
      position: 'Financial Analyst',
      status: 'active' 
    },
    { 
      id: 5, 
      firstName: 'Emma', 
      lastName: 'Brown', 
      email: 'emma.brown@example.com', 
      department: 'Customer Support', 
      position: 'Support Team Lead',
      status: 'active' 
    }
  ];

  const departmentOptions = [
    'All Departments',
    'Marketing',
    'Engineering',
    'Human Resources',
    'Finance',
    'Customer Support',
    'Sales',
    'Operations'
  ];

  const statusOptions = [
    'All Statuses',
    'active',
    'on leave',
    'terminated'
  ];

  // State declarations
  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    status: 'active'
  });

  // Filter employees based on search term and filters
  useEffect(() => {
    let result = employees;
    
    // Search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(employee => 
        employee.firstName.toLowerCase().includes(lowercasedSearch) ||
        employee.lastName.toLowerCase().includes(lowercasedSearch) ||
        employee.email.toLowerCase().includes(lowercasedSearch) ||
        employee.position.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Department filter
    if (selectedDepartment !== 'All Departments') {
      result = result.filter(employee => employee.department === selectedDepartment);
    }
    
    // Status filter
    if (selectedStatus !== 'All Statuses') {
      result = result.filter(employee => employee.status === selectedStatus);
    }
    
    setFilteredEmployees(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedDepartment, selectedStatus, employees, initialStatus]);

  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Function to handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle department filter change
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Function to handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Function to toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  // Add employee form handlers
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department || !newEmployee.position) {
      toast.error("All fields are required!");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Add new employee
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeToAdd = { ...newEmployee, id: newId };
    
    setEmployees([...employees, employeeToAdd]);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      status: 'active'
    });
    
    toast.success("Employee added successfully!");
  };

  // Edit employee handlers
  const openEditModal = (employee) => {
    setEditEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  const handleEditEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editEmployee.firstName || !editEmployee.lastName || !editEmployee.email || !editEmployee.department || !editEmployee.position) {
      toast.error("All fields are required!");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmployee.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Update employee
    const updatedEmployees = employees.map(employee => 
      employee.id === editEmployee.id ? editEmployee : employee
    );
    
    setEmployees(updatedEmployees);
    setIsEditModalOpen(false);
    toast.success("Employee updated successfully!");
  };

  // Delete employee handlers
  const openDeleteModal = (employee) => {
    setDeleteEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEmployee = () => {
    const updatedEmployees = employees.filter(employee => employee.id !== deleteEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteModalOpen(false);
    toast.success("Employee deleted successfully!");
  };

  // Pagination handlers
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Employee Directory</h2>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          <button 
            onClick={toggleFilterPanel}
            className="btn btn-outline flex items-center gap-2 sm:hidden"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden sm:flex gap-4">
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="input-field min-w-[180px]"
          >
            {departmentOptions.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="input-field min-w-[150px]"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'All Statuses' ? status : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="card space-y-4">
              <div>
                <label htmlFor="mobile-department" className="label">Department</label>
                <select
                  id="mobile-department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="input-field w-full"
                >
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="mobile-status" className="label">Status</label>
                <select
                  id="mobile-status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="input-field w-full"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'All Statuses' ? status : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Employees Table/Cards */}
      <div className="overflow-x-auto rounded-2xl shadow-soft">
        {/* Desktop Table */}
        <table className="hidden md:table w-full">
          <thead className="bg-surface-100 dark:bg-surface-800 text-left">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Department</th>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Position</th>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
            {currentEmployees.length > 0 ? (
              currentEmployees.map(employee => (
                <tr key={employee.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                  </td>
                  <td className="px-6 py-4 text-surface-600 dark:text-surface-400">{employee.email}</td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">{employee.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        employee.status === 'on leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => openEditModal(employee)}
                        className="text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(employee)}
                        className="text-surface-600 hover:text-accent dark:text-surface-400 dark:hover:text-accent"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-surface-500 dark:text-surface-400">
                  No employees found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentEmployees.length > 0 ? (
            currentEmployees.map(employee => (
              <motion.div 
                key={employee.id} 
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-surface-500 dark:text-surface-400 text-sm">{employee.position}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      employee.status === 'on leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Email: </span>
                    {employee.email}
                  </p>
                  <p className="text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Department: </span>
                    {employee.department}
                  </p>
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button 
                    onClick={() => openEditModal(employee)}
                    className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(employee)}
                    className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 hover:text-accent dark:text-surface-400 dark:hover:text-accent"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="card py-12 text-center text-surface-500 dark:text-surface-400">
              No employees found matching your criteria
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {filteredEmployees.length > employeesPerPage && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 
                ? 'text-surface-400 cursor-not-allowed' 
                : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-4 py-2 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages 
                ? 'text-surface-400 cursor-not-allowed' 
                : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      )}
      
      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-lg max-w-md w-full mx-auto p-6 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Employee</h3>
                <button 
                  className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={newEmployee.firstName}
                      onChange={handleNewEmployeeChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={newEmployee.lastName}
                      onChange={handleNewEmployeeChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleNewEmployeeChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="label">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={newEmployee.department}
                    onChange={handleNewEmployeeChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="position" className="label">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleNewEmployeeChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newEmployee.status}
                    onChange={handleNewEmployeeChange}
                    className="input-field"
                    required
                  >
                    {statusOptions.slice(1).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Edit Employee Modal */}
      <AnimatePresence>
        {isEditModalOpen && editEmployee && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsEditModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-lg max-w-md w-full mx-auto p-6 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Employee</h3>
                <button 
                  className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateEmployee} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-firstName" className="label">First Name</label>
                    <input
                      type="text"
                      id="edit-firstName"
                      name="firstName"
                      value={editEmployee.firstName}
                      onChange={handleEditEmployeeChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-lastName" className="label">Last Name</label>
                    <input
                      type="text"
                      id="edit-lastName"
                      name="lastName"
                      value={editEmployee.lastName}
                      onChange={handleEditEmployeeChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-email" className="label">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editEmployee.email}
                    onChange={handleEditEmployeeChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-department" className="label">Department</label>
                  <select
                    id="edit-department"
                    name="department"
                    value={editEmployee.department}
                    onChange={handleEditEmployeeChange}
                    className="input-field"
                    required
                  >
                    {departmentOptions.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-position" className="label">Position</label>
                  <input
                    type="text"
                    id="edit-position"
                    name="position"
                    value={editEmployee.position}
                    onChange={handleEditEmployeeChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-status" className="label">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editEmployee.status}
                    onChange={handleEditEmployeeChange}
                    className="input-field"
                    required
                  >
                    {statusOptions.slice(1).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Delete Employee Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && deleteEmployee && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-lg max-w-md w-full mx-auto p-6 z-10"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Trash className="w-8 h-8 text-red-600 dark:text-red-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Delete Employee</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Are you sure you want to delete {deleteEmployee.firstName} {deleteEmployee.lastName}? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  className="btn bg-red-600 hover:bg-red-700 text-white active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}