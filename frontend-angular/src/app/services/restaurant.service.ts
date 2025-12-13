import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Restaurant {
  id?: number;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  rating?: number;
  isActive?: boolean;
  createdDate?: Date;
  lastModifiedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private apiService: ApiService) {}

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.apiService.getRestaurants();
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.apiService.getRestaurantById(id);
  }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.apiService.createRestaurant(restaurant);
  }

  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.apiService.updateRestaurant(id, restaurant);
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.apiService.deleteRestaurant(id);
  }

  checkHealth(): Observable<any> {
    return this.apiService.checkServiceHealth('restaurant');
  }
}
