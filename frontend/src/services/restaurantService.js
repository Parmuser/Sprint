import { restaurantServiceClient, apiService } from './apiService';

const RESTAURANT_ENDPOINTS = {
  BASE: '/api/restaurants',
  BY_ID: (id) => `/api/restaurants/${id}`,
  BY_CUISINE: (cuisine) => `/api/restaurants/cuisine/${cuisine}`,
  SEARCH: '/api/restaurants/search',
  ACTIVE: '/api/restaurants/active',
  NEARBY: '/api/restaurants/nearby',
};

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await apiService.get(restaurantServiceClient, RESTAURANT_ENDPOINTS.BASE);
      return response.data;
    } catch (error) {
      // Return mock data if service is not available
      console.warn('Restaurant service not available, returning mock data');
      return [
        {
          id: 1,
          name: "Spice Paradise",
          description: "Authentic Indian cuisine with traditional spices and flavors",
          address: "123 Curry Lane, Food District",
          phone: "+1-555-0101",
          email: "info@spiceparadise.com",
          cuisine: "Indian",
          rating: 4.5,
          isActive: true,
          openingTime: "11:00",
          closingTime: "22:00",
          deliveryFee: 2.99,
          minimumOrder: 15.00,
          imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
          createdAt: "2024-01-01T00:00:00",
          updatedAt: "2024-01-01T00:00:00"
        },
        {
          id: 2,
          name: "Pasta & Pizza Corner",
          description: "Authentic Italian dishes made with fresh ingredients",
          address: "456 Italian Street, Little Italy",
          phone: "+1-555-0102",
          email: "orders@pastapizza.com",
          cuisine: "Italian",
          rating: 4.2,
          isActive: true,
          openingTime: "12:00",
          closingTime: "23:00",
          deliveryFee: 3.50,
          minimumOrder: 20.00,
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
          createdAt: "2024-01-01T00:00:00",
          updatedAt: "2024-01-01T00:00:00"
        },
        {
          id: 3,
          name: "Sushi Master",
          description: "Fresh sushi and Japanese delicacies",
          address: "789 Tokyo Avenue, Asian Quarter",
          phone: "+1-555-0103",
          email: "hello@sushimaster.com",
          cuisine: "Japanese",
          rating: 4.8,
          isActive: true,
          openingTime: "17:00",
          closingTime: "01:00",
          deliveryFee: 4.99,
          minimumOrder: 25.00,
          imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
          createdAt: "2024-01-01T00:00:00",
          updatedAt: "2024-01-01T00:00:00"
        }
      ];
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await apiService.get(restaurantServiceClient, RESTAURANT_ENDPOINTS.BY_ID(id));
      return response.data;
    } catch (error) {
      // Return mock data if service is not available
      const mockRestaurants = await restaurantService.getAllRestaurants();
      return mockRestaurants.find(r => r.id === parseInt(id));
    }
  },

  // Get active restaurants
  getActiveRestaurants: async () => {
    try {
      const response = await apiService.get(restaurantServiceClient, RESTAURANT_ENDPOINTS.ACTIVE);
      return response.data;
    } catch (error) {
      const allRestaurants = await restaurantService.getAllRestaurants();
      return allRestaurants.filter(r => r.isActive);
    }
  },

  // Get restaurants by cuisine
  getRestaurantsByCuisine: async (cuisine) => {
    try {
      const response = await apiService.get(restaurantServiceClient, RESTAURANT_ENDPOINTS.BY_CUISINE(cuisine));
      return response.data;
    } catch (error) {
      const allRestaurants = await restaurantService.getAllRestaurants();
      return allRestaurants.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }
  },

  // Search restaurants
  searchRestaurants: async (query) => {
    try {
      const response = await apiService.get(restaurantServiceClient, `${RESTAURANT_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      const allRestaurants = await restaurantService.getAllRestaurants();
      return allRestaurants.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Create new restaurant
  createRestaurant: async (restaurantData) => {
    const response = await apiService.post(restaurantServiceClient, RESTAURANT_ENDPOINTS.BASE, restaurantData);
    return response.data;
  },

  // Update restaurant
  updateRestaurant: async (id, restaurantData) => {
    const response = await apiService.put(restaurantServiceClient, RESTAURANT_ENDPOINTS.BY_ID(id), restaurantData);
    return response.data;
  },

  // Delete restaurant
  deleteRestaurant: async (id) => {
    await apiService.delete(restaurantServiceClient, RESTAURANT_ENDPOINTS.BY_ID(id));
    return true;
  },

  // Get available cuisines
  getAvailableCuisines: async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
    return cuisines.sort();
  },
};

export default restaurantService;
