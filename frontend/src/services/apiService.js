import axios from 'axios';
import { toast } from 'react-toastify';

// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost';

// Service ports
const PORTS = {
  USER_SERVICE: 8080,
  RESTAURANT_SERVICE: 8081,
  ORDER_SERVICE: 8082,
  NOTIFICATION_SERVICE: 8083,
  EUREKA_SERVER: 8761
};

// Create axios instances for each service
const createServiceClient = (port, serviceName) => {
  const client = axios.create({
    baseURL: `${API_BASE_URL}:${port}`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      console.log(`${serviceName} Request:`, config);
      return config;
    },
    (error) => {
      console.error(`${serviceName} Request Error:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      console.log(`${serviceName} Response:`, response);
      return response;
    },
    (error) => {
      console.error(`${serviceName} Response Error:`, error);
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        const message = data?.message || data?.error || `${serviceName} Error: ${status}`;
        toast.error(message);
      } else if (error.request) {
        // Network error
        toast.error(`${serviceName} is not available. Please check if the service is running on port ${port}.`);
      } else {
        // Other error
        toast.error(`${serviceName}: ${error.message}`);
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Service clients
export const userServiceClient = createServiceClient(PORTS.USER_SERVICE, 'User Service');
export const restaurantServiceClient = createServiceClient(PORTS.RESTAURANT_SERVICE, 'Restaurant Service');
export const orderServiceClient = createServiceClient(PORTS.ORDER_SERVICE, 'Order Service');
export const notificationServiceClient = createServiceClient(PORTS.NOTIFICATION_SERVICE, 'Notification Service');

// Generic API service
export const apiService = {
  // Generic GET request
  get: (client, endpoint) => client.get(endpoint),
  
  // Generic POST request
  post: (client, endpoint, data) => client.post(endpoint, data),
  
  // Generic PUT request
  put: (client, endpoint, data) => client.put(endpoint, data),
  
  // Generic DELETE request
  delete: (client, endpoint) => client.delete(endpoint),
  
  // Health check for all services
  healthCheck: async () => {
    const services = [
      { name: 'User Service', client: userServiceClient, endpoint: '/actuator/health' },
      { name: 'Restaurant Service', client: restaurantServiceClient, endpoint: '/actuator/health' },
      { name: 'Order Service', client: orderServiceClient, endpoint: '/actuator/health' },
      { name: 'Notification Service', client: notificationServiceClient, endpoint: '/actuator/health' },
    ];

    const results = [];
    for (const service of services) {
      try {
        const response = await service.client.get(service.endpoint);
        results.push({
          name: service.name,
          status: 'UP',
          details: response.data
        });
      } catch (error) {
        results.push({
          name: service.name,
          status: 'DOWN',
          error: error.message
        });
      }
    }
    return results;
  }
};

export default apiService;
