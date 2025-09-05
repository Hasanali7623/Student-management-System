import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Student, DashboardData, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = 'http://localhost:5000/api/students';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.API_URL}/profile`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(`${this.API_URL}/dashboard`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateProfile(profileData: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.API_URL}/profile`, profileData, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
