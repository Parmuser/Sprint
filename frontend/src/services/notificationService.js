import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class NotificationService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.baseUrl = process.env.REACT_APP_NOTIFICATION_SERVICE_URL || 'http://localhost:8083';
  }

  // Connect to WebSocket
  connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        // Create SockJS connection
        const socket = new SockJS(`${this.baseUrl}/ws`);
        
        // Create STOMP client
        this.stompClient = new Client({
          webSocketFactory: () => socket,
          debug: (str) => console.log('STOMP Debug:', str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.stompClient.onConnect = (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.connected = true;
          
          // Subscribe to user-specific notifications
          this.subscribeToNotifications(userId);
          
          resolve(frame);
        };

        this.stompClient.onStompError = (frame) => {
          console.error('STOMP Error:', frame);
          this.connected = false;
          reject(frame);
        };

        this.stompClient.onWebSocketError = (error) => {
          console.error('WebSocket Error:', error);
          this.connected = false;
          reject(error);
        };

        this.stompClient.onDisconnect = () => {
          console.log('Disconnected from WebSocket');
          this.connected = false;
        };

        // Activate the client
        this.stompClient.activate();

      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
      this.subscriptions.clear();
      this.messageHandlers.clear();
    }
  }

  // Subscribe to general notifications
  subscribeToNotifications(userId) {
    if (!this.connected || !this.stompClient) {
      console.warn('Not connected to WebSocket');
      return;
    }

    // Subscribe to general status updates
    const statusSubscription = this.stompClient.subscribe('/topic/status', (message) => {
      try {
        const notification = JSON.parse(message.body);
        this.handleMessage('status', notification);
      } catch (error) {
        console.error('Error parsing status message:', error);
      }
    });

    this.subscriptions.set('status', statusSubscription);

    // Subscribe to user-specific notifications
    const userSubscription = this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
      try {
        const notification = JSON.parse(message.body);
        this.handleMessage('user', notification);
      } catch (error) {
        console.error('Error parsing user notification:', error);
      }
    });

    this.subscriptions.set('user', userSubscription);

    // Send subscription message
    this.sendMessage('/app/subscribe', { userId });
  }

  // Subscribe to order tracking
  subscribeToOrderTracking(orderId, userId) {
    if (!this.connected || !this.stompClient) {
      console.warn('Not connected to WebSocket');
      return;
    }

    const trackingSubscription = this.stompClient.subscribe(`/topic/delivery/${orderId}`, (message) => {
      try {
        const trackingUpdate = JSON.parse(message.body);
        this.handleMessage('tracking', trackingUpdate);
      } catch (error) {
        console.error('Error parsing tracking message:', error);
      }
    });

    this.subscriptions.set(`tracking-${orderId}`, trackingSubscription);

    // Send tracking subscription message
    this.sendMessage('/app/track', { orderId, userId });
  }

  // Unsubscribe from order tracking
  unsubscribeFromOrderTracking(orderId) {
    const subscriptionKey = `tracking-${orderId}`;
    const subscription = this.subscriptions.get(subscriptionKey);
    
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  // Send message to server
  sendMessage(destination, message) {
    if (!this.connected || !this.stompClient) {
      console.warn('Not connected to WebSocket');
      return;
    }

    try {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // Handle incoming messages
  handleMessage(type, message) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  // Add message handler
  addMessageHandler(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
  }

  // Remove message handler
  removeMessageHandler(type, handler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Get connection status
  isConnected() {
    return this.connected;
  }

  // Mock notification for testing when service is not available
  simulateNotification(type, message) {
    setTimeout(() => {
      this.handleMessage(type, {
        ...message,
        timestamp: new Date().toISOString(),
        source: 'simulation'
      });
    }, 1000);
  }

  // Mock order tracking updates
  simulateOrderTracking(orderId) {
    const statuses = [
      { status: 'PLACED', message: 'Order placed successfully' },
      { status: 'CONFIRMED', message: 'Order confirmed by restaurant' },
      { status: 'PREPARING', message: 'Restaurant is preparing your order' },
      { status: 'READY_FOR_PICKUP', message: 'Order is ready for pickup' },
      { status: 'OUT_FOR_DELIVERY', message: 'Order is out for delivery' },
      { status: 'DELIVERED', message: 'Order delivered successfully' }
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= statuses.length) {
        clearInterval(interval);
        return;
      }

      this.handleMessage('tracking', {
        orderId,
        ...statuses[currentIndex],
        timestamp: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes from now
      });

      currentIndex++;
    }, 3000); // Update every 3 seconds

    return interval;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
