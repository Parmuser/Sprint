import { orderServiceClient, apiService } from './apiService';

const ORDER_ENDPOINTS = {
  BASE: '/api/orders',
  BY_ID: (id) => `/api/orders/${id}`,
  BY_USER: (userId) => `/api/orders/user/${userId}`,
  BY_RESTAURANT: (restaurantId) => `/api/orders/restaurant/${restaurantId}`,
  BY_STATUS: (status) => `/api/orders/status/${status}`,
  UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
};

// Order status enum matching backend
export const OrderStatus = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED', 
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await apiService.get(orderServiceClient, ORDER_ENDPOINTS.BASE);
      return response.data;
    } catch (error) {
      // Return mock data if service is not available
      console.warn('Order service not available, returning mock data');
      return [
        {
          id: 1,
          userId: 1,
          restaurantId: 1,
          totalAmount: 45.50,
          deliveryFee: 2.99,
          taxAmount: 3.60,
          status: OrderStatus.DELIVERED,
          deliveryAddress: "123 Main St, Apt 4B, City, State 12345",
          specialInstructions: "Ring doorbell twice",
          estimatedDeliveryTime: "2024-12-12T19:30:00",
          actualDeliveryTime: "2024-12-12T19:25:00",
          createdAt: "2024-12-12T18:15:00",
          updatedAt: "2024-12-12T19:25:00",
          orderItems: [
            {
              id: 1,
              name: "Butter Chicken",
              quantity: 2,
              price: 16.99,
              total: 33.98
            },
            {
              id: 2,
              name: "Basmati Rice",
              quantity: 1,
              price: 4.99,
              total: 4.99
            },
            {
              id: 3,
              name: "Garlic Naan",
              quantity: 2,
              price: 3.50,
              total: 7.00
            }
          ]
        },
        {
          id: 2,
          userId: 2,
          restaurantId: 2,
          totalAmount: 28.75,
          deliveryFee: 3.50,
          taxAmount: 2.30,
          status: OrderStatus.OUT_FOR_DELIVERY,
          deliveryAddress: "456 Oak Avenue, Suite 201, City, State 12345",
          specialInstructions: "Leave at front desk",
          estimatedDeliveryTime: "2024-12-12T20:15:00",
          actualDeliveryTime: null,
          createdAt: "2024-12-12T19:00:00",
          updatedAt: "2024-12-12T19:45:00",
          orderItems: [
            {
              id: 3,
              name: "Margherita Pizza",
              quantity: 1,
              price: 18.99,
              total: 18.99
            },
            {
              id: 4,
              name: "Caesar Salad",
              quantity: 1,
              price: 9.99,
              total: 9.99
            }
          ]
        },
        {
          id: 3,
          userId: 1,
          restaurantId: 3,
          totalAmount: 65.20,
          deliveryFee: 4.99,
          taxAmount: 5.22,
          status: OrderStatus.PREPARING,
          deliveryAddress: "123 Main St, Apt 4B, City, State 12345",
          specialInstructions: "No wasabi please",
          estimatedDeliveryTime: "2024-12-12T21:00:00",
          actualDeliveryTime: null,
          createdAt: "2024-12-12T19:30:00",
          updatedAt: "2024-12-12T19:35:00",
          orderItems: [
            {
              id: 5,
              name: "Sushi Combo",
              quantity: 1,
              price: 32.99,
              total: 32.99
            },
            {
              id: 6,
              name: "Miso Soup",
              quantity: 2,
              price: 4.99,
              total: 9.98
            },
            {
              id: 7,
              name: "Salmon Roll",
              quantity: 1,
              price: 12.99,
              total: 12.99
            }
          ]
        }
      ];
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await apiService.get(orderServiceClient, ORDER_ENDPOINTS.BY_ID(id));
      return response.data;
    } catch (error) {
      const mockOrders = await orderService.getAllOrders();
      return mockOrders.find(o => o.id === parseInt(id));
    }
  },

  // Get orders by user ID
  getOrdersByUser: async (userId) => {
    try {
      const response = await apiService.get(orderServiceClient, ORDER_ENDPOINTS.BY_USER(userId));
      return response.data;
    } catch (error) {
      const mockOrders = await orderService.getAllOrders();
      return mockOrders.filter(o => o.userId === parseInt(userId));
    }
  },

  // Get orders by restaurant ID
  getOrdersByRestaurant: async (restaurantId) => {
    try {
      const response = await apiService.get(orderServiceClient, ORDER_ENDPOINTS.BY_RESTAURANT(restaurantId));
      return response.data;
    } catch (error) {
      const mockOrders = await orderService.getAllOrders();
      return mockOrders.filter(o => o.restaurantId === parseInt(restaurantId));
    }
  },

  // Get orders by status
  getOrdersByStatus: async (status) => {
    try {
      const response = await apiService.get(orderServiceClient, ORDER_ENDPOINTS.BY_STATUS(status));
      return response.data;
    } catch (error) {
      const mockOrders = await orderService.getAllOrders();
      return mockOrders.filter(o => o.status === status);
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await apiService.post(orderServiceClient, ORDER_ENDPOINTS.BASE, orderData);
    return response.data;
  },

  // Update order
  updateOrder: async (id, orderData) => {
    const response = await apiService.put(orderServiceClient, ORDER_ENDPOINTS.BY_ID(id), orderData);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await apiService.put(orderServiceClient, ORDER_ENDPOINTS.UPDATE_STATUS(id), { status });
    return response.data;
  },

  // Delete order
  deleteOrder: async (id) => {
    await apiService.delete(orderServiceClient, ORDER_ENDPOINTS.BY_ID(id));
    return true;
  },

  // Get order statuses
  getOrderStatuses: () => {
    return Object.values(OrderStatus);
  },

  // Calculate order total
  calculateOrderTotal: (orderItems, deliveryFee = 0, taxRate = 0.08) => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + deliveryFee + taxAmount;
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  }
};

export default orderService;
