/**
 * Service for employee data operations using ApperClient
 * Based on the employee1 table structure
 */

// Initialize ApperClient with environment variables
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'employee1';

/**
 * Fetch all employees with optional filtering and pagination
 */
export const fetchEmployees = async (filters = {}, page = 1, limit = 20) => {
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on filters
    const whereConditions = [];
    
    if (filters.name) {
      whereConditions.push({
        fieldName: "Name",
        operator: "Contains",
        values: [filters.name]
      });
    }
    
    if (filters.email) {
      whereConditions.push({
        fieldName: "email",
        operator: "Contains",
        values: [filters.email]
      });
    }
    
    if (filters.department) {
      whereConditions.push({
        fieldName: "department",
        operator: "ExactMatch",
        values: [filters.department]
      });
    }
    
    if (filters.status) {
      whereConditions.push({
        fieldName: "status",
        operator: "ExactMatch",
        values: [filters.status]
      });
    }
    
    // Query parameters
    const params = {
      where: whereConditions,
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      },
      orderBy: [
        {
          field: filters.sortField || "Name",
          direction: filters.sortDirection || "asc"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/**
 * Fetch a single employee by ID
 */
export const fetchEmployeeById = async (employeeId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById(TABLE_NAME, employeeId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Create a new employee
 */
export const createEmployee = async (employeeData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord(TABLE_NAME, {
      records: [employeeData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create employee");
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

/**
 * Update an existing employee
 */
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const apperClient = getApperClient();
    // Ensure the ID is included in the data
    const updatedData = { ...employeeData, Id: employeeId };
    
    const response = await apperClient.updateRecord(TABLE_NAME, {
      records: [updatedData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to update employee");
    }
  } catch (error) {
    console.error(`Error updating employee with ID ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (employeeId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(TABLE_NAME, {
      RecordIds: [employeeId]
    });
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting employee with ID ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Fetch employees on leave (status = 'on leave')
 */
export const fetchEmployeesOnLeave = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      where: [{
        fieldName: "status",
        operator: "ExactMatch",
        values: ["on leave"]
      }]
    };
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error fetching employees on leave:", error);
    throw error;
  }
};