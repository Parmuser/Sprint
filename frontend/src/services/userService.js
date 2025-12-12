import { userServiceClient, apiService } from './apiService';

const USER_ENDPOINTS = {
  BASE: '/api/users',
  BY_ID: (id) => `/api/users/${id}`,
  BY_USERNAME: (username) => `/api/users/username/${username}`,
  BY_EMAIL: (email) => `/api/users/email/${email}`,
  ORDERED: '/api/users/ordered',
  SEARCH_USERNAME: '/api/users/search/username',
  SEARCH_EMAIL: '/api/users/search/email',
  EXISTS: (id) => `/api/users/${id}/exists`,
  CHECK_USERNAME: (username) => `/api/users/check/username/${username}`,
  CHECK_EMAIL: (email) => `/api/users/check/email/${email}`,
};

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.BASE);
    return response.data;
  },

  // Get all users ordered by username
  getAllUsersOrdered: async () => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.ORDERED);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  // Get user by username
  getUserByUsername: async (username) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.BY_USERNAME(username));
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.BY_EMAIL(email));
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await apiService.post(userServiceClient, USER_ENDPOINTS.BASE, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiService.put(userServiceClient, USER_ENDPOINTS.BY_ID(id), userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    await apiService.delete(userServiceClient, USER_ENDPOINTS.BY_ID(id));
    return true;
  },

  // Search users by username
  searchUsersByUsername: async (query) => {
    const response = await apiService.get(userServiceClient, `${USER_ENDPOINTS.SEARCH_USERNAME}?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Search users by email
  searchUsersByEmail: async (query) => {
    const response = await apiService.get(userServiceClient, `${USER_ENDPOINTS.SEARCH_EMAIL}?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Check if user exists by ID
  userExists: async (id) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.EXISTS(id));
    return response.data;
  },

  // Check if username exists
  usernameExists: async (username) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.CHECK_USERNAME(username));
    return response.data;
  },

  // Check if email exists
  emailExists: async (email) => {
    const response = await apiService.get(userServiceClient, USER_ENDPOINTS.CHECK_EMAIL(email));
    return response.data;
  },
};

export default userService;
