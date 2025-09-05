import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private darkModeSubject = new BehaviorSubject<boolean>(this.getDarkModeFromStorage());
  
  isDarkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.getDarkModeFromStorage());
  }

  toggleTheme(): void {
    const newDarkMode = !this.darkModeSubject.value;
    this.setDarkMode(newDarkMode);
  }

  setDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
    this.applyTheme(isDarkMode);
    localStorage.setItem(this.THEME_KEY, isDarkMode.toString());
  }

  private getDarkModeFromStorage(): boolean {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === null) {
      // Default to dark mode if no preference is stored
      return true;
    }
    return stored === 'true';
  }

  private applyTheme(isDarkMode: boolean): void {
    const root = document.documentElement;
    
    if (isDarkMode) {
      // Dark mode colors
      root.style.setProperty('--primary-bg', 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #111111 100%)');
      root.style.setProperty('--secondary-bg', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-shadow', '0 25px 45px rgba(0, 0, 0, 0.6)');
    } else {
      // Light mode colors
      root.style.setProperty('--primary-bg', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)');
      root.style.setProperty('--secondary-bg', 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', 'rgba(30, 41, 59, 0.7)');
      root.style.setProperty('--glass-shadow', '0 25px 45px rgba(0, 0, 0, 0.1)');
    }
    
    // Add theme class to body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }
}
