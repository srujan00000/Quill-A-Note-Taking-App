// src/app/interfaces/note.interface.ts
import { Timestamp } from '@angular/fire/firestore';

export interface Note {
  id?: string;
  title: string;
  content: string;
  userId: string;
  
  // Change Date to Timestamp
  createdAt: Timestamp; 
  reminderDate?: Timestamp | null;

  isArchived: boolean;
  isTrashed: boolean;
}