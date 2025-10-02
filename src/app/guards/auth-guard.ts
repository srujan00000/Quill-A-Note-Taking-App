import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We listen to the user state from our service.
  return authService.currentUser$.pipe(
    // take(1) is crucial. It ensures the observable completes after getting one value.
    take(1),
    map(user => {
      // If the user object exists, they are authenticated.
      if (user) {
        return true; // Allow access to the route.
      } else {
        // If the user is null, they are not authenticated.
        router.navigate(['/login']); // Redirect them to the login page.
        return false; // Block access to the route.
      }
    })
  );
};