export interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  department: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  student_id: string;
  name: string;
  email: string;
  department: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    student: Student;
    token: string;
  };
  errors?: any[];
}

export interface Complaint {
  id: number;
  student_id: number;
  title: string;
  description: string;
  category: 'hostel' | 'classroom' | 'teacher' | 'administrative' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'Pending' | 'In Progress' | 'Resolved';
  created_at: string;
  updated_at: string;
}

export interface ComplaintRequest {
  title: string;
  description: string;
  category: 'hostel' | 'classroom' | 'teacher' | 'administrative' | 'other';
  priority: 'low' | 'medium' | 'high';
}

export interface ComplaintsSummary {
  pending: number;
  inProgress: number;
  resolved: number;
  total: number;
}

export interface DashboardData {
  profile: Student;
  complaintsSummary: ComplaintsSummary;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}
