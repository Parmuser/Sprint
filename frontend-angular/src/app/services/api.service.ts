import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Base configuration
const API_BASE_URL = 'http://localhost';

// Service ports
const PORTS = {
  USER_SERVICE: 8080,
  RESTAURANT_SERVICE: 8081,
  ORDER_SERVICE: 8082,
  NOTIFICATION_SERVICE: 8083,
  EUREKA_SERVER: 8761
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  // User Service methods
  getUsers(): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.USER_SERVICE}/api/users`)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.USER_SERVICE}/api/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}:${PORTS.USER_SERVICE}/api/users`, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${API_BASE_URL}:${PORTS.USER_SERVICE}/api/users/${id}`, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}:${PORTS.USER_SERVICE}/api/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Restaurant Service methods
  getRestaurants(): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.RESTAURANT_SERVICE}/api/restaurants`)
      .pipe(catchError(this.handleError));
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.RESTAURANT_SERVICE}/api/restaurants/${id}`)
      .pipe(catchError(this.handleError));
  }

  createRestaurant(restaurant: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}:${PORTS.RESTAURANT_SERVICE}/api/restaurants`, restaurant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateRestaurant(id: number, restaurant: any): Observable<any> {
    return this.http.put(`${API_BASE_URL}:${PORTS.RESTAURANT_SERVICE}/api/restaurants/${id}`, restaurant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteRestaurant(id: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}:${PORTS.RESTAURANT_SERVICE}/api/restaurants/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Order Service methods
  getOrders(): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders`)
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders/${id}`)
      .pipe(catchError(this.handleError));
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders`, order, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders/${id}`, order, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${API_BASE_URL}:${PORTS.ORDER_SERVICE}/api/orders/${id}/status`, { status }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Health check methods
  checkServiceHealth(service: string): Observable<any> {
    let port: number;
    switch (service) {
      case 'user': port = PORTS.USER_SERVICE; break;
      case 'restaurant': port = PORTS.RESTAURANT_SERVICE; break;
      case 'order': port = PORTS.ORDER_SERVICE; break;
      case 'notification': port = PORTS.NOTIFICATION_SERVICE; break;
      default: throw new Error(`Unknown service: ${service}`);
    }
    
    return this.http.get(`${API_BASE_URL}:${port}/actuator/health`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
