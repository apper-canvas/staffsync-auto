/**
 * Service for leave request data operations using ApperClient
 * Based on the leave_request table structure
 */

// Initialize ApperClient with environment variables
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'leave_request';

/**
 * Fetch all leave requests with optional filtering and pagination
 */
export const fetchLeaveRequests = async (filters = {}, page = 1, limit = 20) => {
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on filters
    const whereConditions = [];
    
    if (filters.leaveType) {
      whereConditions.push({
        fieldName: "leave_type",
        operator: "ExactMatch",
        values: [filters.leaveType]
      });
    }
    
    if (filters.status) {
      whereConditions.push({
        fieldName: "status",
        operator: "ExactMatch",
        values: [filters.status]
      });
    }
    
    if (filters.employeeId) {
      whereConditions.push({
        fieldName: "employee_id",
        operator: "ExactMatch",
        values: [filters.employeeId]
      });
    }
    
    // Query parameters
    const params = {
      where: whereConditions,
      expands: [
        {
          name: "employee_id",
          alias: "employee"
        }
      ],
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      },
      orderBy: [
        {
          field: filters.sortField || "start_date",
          direction: filters.sortDirection || "desc"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

/**
 * Create a new leave request
 */
export const createLeaveRequest = async (leaveRequestData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord(TABLE_NAME, {
      records: [leaveRequestData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create leave request");
    }
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw error;
  }
};

/**
 * Update an existing leave request
 */
export const updateLeaveRequest = async (requestId, leaveRequestData) => {
  try {
    const apperClient = getApperClient();
    // Ensure the ID is included in the data
    const updatedData = { ...leaveRequestData, Id: requestId };
    
    const response = await apperClient.updateRecord(TABLE_NAME, {
      records: [updatedData]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to update leave request");
    }
  } catch (error) {
    console.error(`Error updating leave request with ID ${requestId}:`, error);
    throw error;
  }
};

/**
 * Delete a leave request
 */
export const deleteLeaveRequest = async (requestId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(TABLE_NAME, {
      RecordIds: [requestId]
    });
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting leave request with ID ${requestId}:`, error);
    throw error;
  }
};