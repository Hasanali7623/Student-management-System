import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { ComplaintService } from '../../services/complaint.service';
import { ThemeService } from '../../services/theme.service';
import { DashboardData, Student, ComplaintsSummary, Complaint } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  student: Student | null = null;
  complaintsSummary: ComplaintsSummary | null = null;
  recentComplaints: Complaint[] = [];
  loading = true;
  error = '';
  currentTime = new Date();
  currentGreeting = '';
  isDarkMode = true;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private complaintService: ComplaintService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.updateTimeAndGreeting();
    
    // Update time every second for better accuracy
    setInterval(() => {
      this.updateTimeAndGreeting();
    }, 1000);
    
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.studentService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.student = response.data.profile;
          this.complaintsSummary = response.data.complaintsSummary;
          this.loadRecentComplaints();
        } else {
          this.loading = false;
          this.error = response.message;
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to load dashboard data';
      }
    });
  }

  loadRecentComplaints() {
    this.complaintService.getComplaints().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          // Get the 5 most recent complaints
          this.recentComplaints = response.data.slice(0, 5);
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Failed to load recent complaints:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToComplaints() {
    console.log('Navigating to complaints page...');
    this.router.navigate(['/complaints']).then(success => {
      if (success) {
        console.log('Navigation successful');
      } else {
        console.error('Navigation failed');
      }
    }).catch(error => {
      console.error('Navigation error:', error);
    });
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return '⏳';
      case 'In Progress': return '🔄';
      case 'Resolved': return '✅';
      default: return '📝';
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

  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'hostel': return '🏠';
      case 'classroom': return '🎓';
      case 'teacher': return '👨‍🏫';
      case 'administrative': return '📋';
      case 'other': return '📝';
      default: return '📝';
    }
  }

  trackByComplaintId(index: number, complaint: Complaint): number {
    return complaint.id;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  updateTimeAndGreeting(): void {
    this.currentTime = new Date();
    this.currentGreeting = this.getGreeting();
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  getTimeOfDay(): string {
    const hour = this.currentTime.getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon';
    } else if (hour >= 17 && hour < 20) {
      return 'Evening';
    } else {
      return 'Night';
    }
  }

  getTimeIcon(): string {
    const hour = this.currentTime.getHours();
    
    if (hour >= 6 && hour < 12) {
      return '🌅'; // Morning
    } else if (hour >= 12 && hour < 17) {
      return '☀️'; // Afternoon
    } else if (hour >= 17 && hour < 20) {
      return '🌆'; // Evening
    } else {
      return '🌙'; // Night
    }
  }

  getRelativeTime(): string {
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;
  }

  getFormattedTime(): string {
    return this.currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }
}
