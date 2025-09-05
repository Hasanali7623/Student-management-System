import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Complaint, ComplaintRequest, ComplaintsSummary, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private readonly API_URL = 'http://localhost:5000/api/complaints';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getComplaints(): Observable<ApiResponse<Complaint[]>> {
    return this.http.get<ApiResponse<Complaint[]>>(this.API_URL, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getComplaint(id: number): Observable<ApiResponse<Complaint>> {
    return this.http.get<ApiResponse<Complaint>>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createComplaint(complaintData: ComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.post<ApiResponse<Complaint>>(this.API_URL, complaintData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateComplaint(id: number, complaintData: ComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.API_URL}/${id}`, complaintData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateComplaintStatus(id: number, status: string): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.API_URL}/${id}/status`, { status }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteComplaint(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getComplaintsSummary(): Observable<ApiResponse<ComplaintsSummary>> {
    return this.http.get<ApiResponse<ComplaintsSummary>>(`${this.API_URL}/summary/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
