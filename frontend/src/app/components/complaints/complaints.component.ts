import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { ThemeService } from '../../services/theme.service';
import { Complaint, ComplaintRequest } from '../../models/interfaces';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  complaintForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';
  showForm = false;
  editMode = false;
  editingComplaintId: number | null = null;
  isDarkMode = true;

  categories = [
    { value: 'hostel', label: 'Hostel Issues' },
    { value: 'classroom', label: 'Classroom Issues' },
    { value: 'teacher', label: 'Teacher Related' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'other', label: 'Other' }
  ];

  priorities = [
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  ngOnInit() {
    this.loadComplaints();
    
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  loadComplaints() {
    this.loading = true;
    this.error = '';
    
    this.complaintService.getComplaints().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.complaints = response.data;
        } else {
          this.error = response.message;
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to load complaints';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.editMode = false;
    this.editingComplaintId = null;
    this.complaintForm.reset({
      priority: 'medium' // Set default priority
    });
    this.error = '';
    this.successMessage = '';
  }

  editComplaint(complaint: Complaint) {
    this.editMode = true;
    this.editingComplaintId = complaint.id;
    this.showForm = true;
    
    this.complaintForm.patchValue({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority || 'medium'
    });

    // Scroll to form
    setTimeout(() => {
      document.querySelector('.complaint-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      this.submitting = true;
      this.error = '';
      this.successMessage = '';

      const complaintData: ComplaintRequest = this.complaintForm.value;

      if (this.editMode && this.editingComplaintId) {
        // Update existing complaint
        this.complaintService.updateComplaint(this.editingComplaintId, complaintData).subscribe({
          next: (response) => {
            this.submitting = false;
            if (response.success) {
              this.successMessage = 'Complaint updated successfully!';
              this.resetForm();
              this.showForm = false;
              this.loadComplaints();
            } else {
              this.error = response.message;
            }
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.error?.message || 'Failed to update complaint';
          }
        });
      } else {
        // Create new complaint
        this.complaintService.createComplaint(complaintData).subscribe({
          next: (response) => {
            this.submitting = false;
            if (response.success) {
              this.successMessage = 'Complaint submitted successfully!';
              this.resetForm();
              this.showForm = false;
              this.loadComplaints();
            } else {
              this.error = response.message;
            }
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.error?.message || 'Failed to submit complaint';
          }
        });
      }
    }
  }

  deleteComplaint(id: number) {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadComplaints();
          } else {
            this.error = response.message;
          }
        },
        error: (error: any) => {
          this.error = error.error?.message || 'Failed to delete complaint';
        }
      });
    }
  }

  updateStatus(complaintId: number, newStatus: string) {
    this.complaintService.updateComplaintStatus(complaintId, newStatus).subscribe({
      next: (response) => {
        this.successMessage = `Complaint status updated to ${newStatus}`;
        this.error = '';
        this.loadComplaints();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.error = 'Failed to update complaint status';
        this.successMessage = '';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isStatusResolved(status: 'Pending' | 'In Progress' | 'Resolved'): boolean {
    return status === 'Resolved';
  }

  isStatusPending(status: 'Pending' | 'In Progress' | 'Resolved'): boolean {
    return status === 'Pending';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Form getters
  get title() { return this.complaintForm.get('title'); }
  get description() { return this.complaintForm.get('description'); }
  get category() { return this.complaintForm.get('category'); }
  get priority() { return this.complaintForm.get('priority'); }
}
