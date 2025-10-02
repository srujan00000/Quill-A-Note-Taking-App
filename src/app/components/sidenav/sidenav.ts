import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {
  @Input() isCollapsed = false; // Keep the input for collapsing

  // Inject services
  private authService = inject(AuthService);
  private router = inject(Router);

  navItems = [
    { icon: 'lightbulb', name: 'Notes' },
    { icon: 'notifications', name: 'Reminders' },
    { icon: 'archive', name: 'Archive' },
    { icon: 'delete', name: 'Trash' }
  ];
  
  // Add the logout method
  async logout() {
    try {
      await this.authService.logout();
      // On successful logout, navigate to the login page
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }
}