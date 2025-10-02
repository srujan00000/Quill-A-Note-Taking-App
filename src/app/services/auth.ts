import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, User, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // The `Auth` service is injected, giving us access to Firebase Auth.


  // Exposes the current user state as an observable.
  // Components can listen to this to know if a user is logged in or out.
  public readonly currentUser$: Observable<User | null>;
  constructor(private auth: Auth) { 
    this.currentUser$ = authState(this.auth);
  }

  // This is the SNAPSHOT (the current value).
  // It's a "getter" that directly returns the current user from the Firebase Auth instance.
  // This is what our NoteService needs.
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

 

  // Login with Email and Password
  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign Up with Email and Password
  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Sign in with Google
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }
}