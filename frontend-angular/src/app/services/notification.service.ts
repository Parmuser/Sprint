import { Injectable } from '@angular/core';
import { Client, Frame, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    const socket = new SockJS('http://localhost:8083/ws') as any;
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame: Frame) => {
      console.log('Connected to WebSocket server', frame);
      this.subscribeToGeneral();
    };

    this.stompClient.onStompError = (frame: Frame) => {
      console.error('WebSocket STOMP error', frame);
    };

    this.stompClient.onWebSocketError = (event: Event) => {
      console.error('WebSocket connection error', event);
    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket server');
    };
  }

  connect(): void {
    if (this.stompClient && !this.stompClient.connected) {
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.subscriptions.forEach((subscription, key) => {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
      });
      this.stompClient.deactivate();
    }
  }

  private subscribeToGeneral(): void {
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe('/topic/notifications', (message) => {
        try {
          const notification: NotificationMessage = JSON.parse(message.body);
          notification.timestamp = new Date();
          this.addNotification(notification);
        } catch (error) {
          console.error('Error parsing notification message:', error);
        }
      });
      this.subscriptions.set('general', subscription);
    }
  }

  subscribeToOrderUpdates(orderId: number): void {
    if (this.stompClient && this.stompClient.connected) {
      const topic = `/topic/order-updates/${orderId}`;
      const subscription = this.stompClient.subscribe(topic, (message) => {
        try {
          const notification: NotificationMessage = JSON.parse(message.body);
          notification.timestamp = new Date();
          this.addNotification(notification);
        } catch (error) {
          console.error('Error parsing order update message:', error);
        }
      });
      this.subscriptions.set(`order-${orderId}`, subscription);
    }
  }

  unsubscribeFromOrderUpdates(orderId: number): void {
    const key = `order-${orderId}`;
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  subscribeToLiveTracking(orderId: number): void {
    if (this.stompClient && this.stompClient.connected) {
      const topic = `/topic/live-tracking/${orderId}`;
      const subscription = this.stompClient.subscribe(topic, (message) => {
        try {
          const notification: NotificationMessage = JSON.parse(message.body);
          notification.timestamp = new Date();
          this.addNotification(notification);
        } catch (error) {
          console.error('Error parsing live tracking message:', error);
        }
      });
      this.subscriptions.set(`tracking-${orderId}`, subscription);
    }
  }

  unsubscribeFromLiveTracking(orderId: number): void {
    const key = `tracking-${orderId}`;
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  sendMessage(destination: string, message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(message)
      });
    } else {
      console.error('WebSocket not connected');
    }
  }

  private addNotification(notification: NotificationMessage): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications.slice(0, 49)]; // Keep last 50
    this.notificationsSubject.next(updatedNotifications);
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  markAsRead(index: number): void {
    const notifications = this.notificationsSubject.value;
    if (notifications[index]) {
      notifications.splice(index, 1);
      this.notificationsSubject.next([...notifications]);
    }
  }

  getConnectionStatus(): boolean {
    return this.stompClient ? this.stompClient.connected : false;
  }

  showBrowserNotification(title: string, message: string, icon?: string): void {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: icon || '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: icon || '/favicon.ico',
            });
          }
        });
      }
    }
  }
}
