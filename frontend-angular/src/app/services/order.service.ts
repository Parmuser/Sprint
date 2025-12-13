import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Order {
  id?: number;
  userId: number;
  restaurantId: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  specialInstructions?: string;
  orderDate?: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdDate?: Date;
  lastModifiedDate?: Date;
}

export interface OrderItem {
  id?: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  getAllOrders(): Observable<Order[]> {
    return this.apiService.getOrders();
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService.getOrderById(id);
  }

  createOrder(order: Order): Observable<Order> {
    return this.apiService.createOrder(order);
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.apiService.updateOrder(id, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.apiService.deleteOrder(id);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.apiService.updateOrderStatus(id, status);
  }

  checkHealth(): Observable<any> {
    return this.apiService.checkServiceHealth('order');
  }
}
