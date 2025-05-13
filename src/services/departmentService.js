/**
 * Service for department data operations using ApperClient
 * Based on the department table structure
 */

// Initialize ApperClient with environment variables
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'department';

/**
 * Fetch all departments with optional filtering and pagination
 */
export const fetchDepartments = async (filters = {}, page = 1, limit = 20) => {
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
    
    if (filters.manager) {
      whereConditions.push({
        fieldName: "manager",
        operator: "Contains",
        values: [filters.manager]
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
    console.error("Error fetching departments:", error);
    throw error;
  }
};

/**
 * Create a new department
 */
export const createDepartment = async (departmentData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord(TABLE_NAME, {
      records: [departmentData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create department");
    }
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

/**
 * Update an existing department
 */
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const apperClient = getApperClient();
    // Ensure the ID is included in the data
    const updatedData = { ...departmentData, Id: departmentId };
    
    const response = await apperClient.updateRecord(TABLE_NAME, {
      records: [updatedData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to update department");
    }
  } catch (error) {
    console.error(`Error updating department with ID ${departmentId}:`, error);
    throw error;
  }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (departmentId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(TABLE_NAME, {
      RecordIds: [departmentId]
    });
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting department with ID ${departmentId}:`, error);
    throw error;
  }
};