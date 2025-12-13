import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.apiService.getUsers();
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.getUserById(id);
  }

  createUser(user: User): Observable<User> {
    return this.apiService.createUser(user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.apiService.updateUser(id, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.deleteUser(id);
  }

  checkHealth(): Observable<any> {
    return this.apiService.checkServiceHealth('user');
  }
}
