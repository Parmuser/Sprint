import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="home-container">
      <h1>Zomato Microservices Dashboard</h1>
      <p>Welcome to the Zomato microservices management system</p>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>Users</mat-card-title>
            <mat-card-subtitle>Total registered users</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ userCount }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/users">View Users</a>
            <a mat-button routerLink="/users/new">Add User</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>restaurant</mat-icon>
            <mat-card-title>Restaurants</mat-card-title>
            <mat-card-subtitle>Active restaurants</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ restaurantCount }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/restaurants">View Restaurants</a>
            <a mat-button routerLink="/restaurants/new">Add Restaurant</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>shopping_cart</mat-icon>
            <mat-card-title>Orders</mat-card-title>
            <mat-card-subtitle>Total orders</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ orderCount }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/orders">View Orders</a>
            <a mat-button routerLink="/orders/new">New Order</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>track_changes</mat-icon>
            <mat-card-title>Live Tracking</mat-card-title>
            <mat-card-subtitle>Track orders in real-time</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-text">Real-time order tracking</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/live-tracking">View Tracking</a>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="services-status">
        <h2>Service Health Status</h2>
        <div class="services-grid">
          <mat-card class="service-card" 
                    [ngClass]="{'service-healthy': userServiceStatus, 'service-unhealthy': !userServiceStatus}">
            <mat-card-header>
              <mat-icon mat-card-avatar>account_circle</mat-icon>
              <mat-card-title>User Service</mat-card-title>
              <mat-card-subtitle>Port 8080</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="service-status">{{ userServiceStatus ? 'Healthy' : 'Unhealthy' }}</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="service-card"
                    [ngClass]="{'service-healthy': restaurantServiceStatus, 'service-unhealthy': !restaurantServiceStatus}">
            <mat-card-header>
              <mat-icon mat-card-avatar>restaurant_menu</mat-icon>
              <mat-card-title>Restaurant Service</mat-card-title>
              <mat-card-subtitle>Port 8081</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="service-status">{{ restaurantServiceStatus ? 'Healthy' : 'Unhealthy' }}</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="service-card"
                    [ngClass]="{'service-healthy': orderServiceStatus, 'service-unhealthy': !orderServiceStatus}">
            <mat-card-header>
              <mat-icon mat-card-avatar>receipt</mat-icon>
              <mat-card-title>Order Service</mat-card-title>
              <mat-card-subtitle>Port 8082</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="service-status">{{ orderServiceStatus ? 'Healthy' : 'Unhealthy' }}</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      
      h1 {
        color: #1976d2;
        margin-bottom: 8px;
      }
      
      p {
        color: #666;
        font-size: 16px;
        margin-bottom: 32px;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      .stat-number {
        font-size: 48px;
        font-weight: bold;
        color: #1976d2;
        text-align: center;
      }
      
      .stat-text {
        font-size: 18px;
        color: #666;
        text-align: center;
      }
    }

    .services-status h2 {
      color: #1976d2;
      margin-bottom: 24px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .service-card {
      .service-status {
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        padding: 8px;
        border-radius: 4px;
      }
      
      &.service-healthy .service-status {
        color: #4caf50;
        background-color: #e8f5e8;
      }
      
      &.service-unhealthy .service-status {
        color: #f44336;
        background-color: #ffeaea;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  userCount = 0;
  restaurantCount = 0;
  orderCount = 0;
  userServiceStatus = false;
  restaurantServiceStatus = false;
  orderServiceStatus = false;

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.checkServiceHealth();
  }

  private loadDashboardData(): void {
    // Load user count
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.userCount = users.length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });

    // Load restaurant count
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurantCount = restaurants.length;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
      }
    });

    // Load order count
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orderCount = orders.length;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  private checkServiceHealth(): void {
    // Check user service health
    this.userService.checkHealth().subscribe({
      next: () => {
        this.userServiceStatus = true;
      },
      error: () => {
        this.userServiceStatus = false;
      }
    });

    // Check restaurant service health
    this.restaurantService.checkHealth().subscribe({
      next: () => {
        this.restaurantServiceStatus = true;
      },
      error: () => {
        this.restaurantServiceStatus = false;
      }
    });

    // Check order service health
    this.orderService.checkHealth().subscribe({
      next: () => {
        this.orderServiceStatus = true;
      },
      error: () => {
        this.orderServiceStatus = false;
      }
    });
  }
}
