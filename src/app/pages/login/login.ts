import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  isSignUpView = false;
  email = '';
  password = '';
  errorMessage = '';


  constructor(private authService: AuthService, private router: Router) { }

  toggleView(event: Event) {
    event.preventDefault(); // Prevent the link from navigating
    this.isSignUpView = !this.isSignUpView;
    this.errorMessage = ''; // Clear errors when switching views
  }

  async login() {
    try {
       await this.authService.loginWithEmail(this.email, this.password);
      this.router.navigate(['/notes']);
    } catch (error: any) {
      this.errorMessage = this.getFriendlyErrorMessage(error);
    }
  }

  async signUp() {
    try {
      await this.authService.signUpWithEmail(this.email, this.password);
      this.router.navigate(['/notes']);
    } catch (error: any) {
      this.errorMessage = this.getFriendlyErrorMessage(error);
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/notes']);
    } catch (error: any) {
      this.errorMessage = this.getFriendlyErrorMessage(error);
    }
  }

  private getFriendlyErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid credentials. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}