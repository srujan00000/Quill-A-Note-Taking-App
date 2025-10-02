import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { Notes } from './pages/notes/notes';
import { Reminders } from './pages/reminders/reminders';
import { Archive } from './pages/archive/archive';
import { Trash } from './pages/trash/trash';

export const routes: Routes = [// The login route is public.
  { path: 'login', component: LoginComponent },
  
  // The main application route is protected by the authGuard.
  { 
    path: '', 
    component: MainLayout,
    canActivate: [authGuard], // Apply the guard here.
    children: [
      // These routes are children of MainLayoutComponent and are all protected.
      { path: 'notes', component: Notes },
      { path: 'reminders', component: Reminders },
      { path: 'archive', component: Archive },
      { path: 'trash', component: Trash },
      // Redirect empty path to '/notes' by default.
      { path: '', redirectTo: 'notes', pathMatch: 'full' }
    ]
  },
  
  // A catch-all route to redirect any unknown URLs to the notes page.
  { path: '**', redirectTo: 'notes', pathMatch: 'full' }];
