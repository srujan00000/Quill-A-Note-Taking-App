import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, doc, updateDoc, deleteDoc, Timestamp, orderBy } from '@angular/fire/firestore';
import { AuthService } from './auth'; 
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';
import { getDocs, writeBatch } from '@angular/fire/firestore';

export type NoteStatus = 'active' | 'archived' | 'trashed';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private notesCollection = collection(this.firestore, 'notes');

  async addNote(noteData: { 
    title: string; 
    content: string; 
    reminderDate?: Date | null;
    isArchived?: boolean; 
    isTrashed?: boolean;  
  }): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not logged in!');

    const noteToAdd: Omit<Note, 'id'> = {
      title: noteData.title,
      content: noteData.content,
      userId: user.uid,
      createdAt: Timestamp.now(),
      reminderDate: noteData.reminderDate ? Timestamp.fromDate(noteData.reminderDate) : null,
      
      // Use the provided flags, or default to false.
      isArchived: noteData.isArchived || false,
      isTrashed: noteData.isTrashed || false,
    };
    await addDoc(this.notesCollection, noteToAdd);
  }

  getNotesByStatus(status: NoteStatus): Observable<Note[]> {

    const user = this.authService.currentUser; // Use the snapshot
    if (!user) throw new Error('User not logged in!');

    let q; 

    if (status === 'active') {
      q = query(this.notesCollection, 
        
        where('userId', '==', user.uid), 
        where('isArchived', '==', false),
        where('isTrashed', '==', false),
        where('reminderDate', '==', null)
      );
    } else if (status === 'archived') {
      q = query(this.notesCollection, 
        
        where('userId', '==', user.uid), 
        where('isArchived', '==', true),
        where('isTrashed', '==', false)
      );
    } else { // status === 'trashed'
      q = query(this.notesCollection, 
        
        where('userId', '==', user.uid), 
        where('isTrashed', '==', true)
      );
    }
    
    return collectionData(q, { idField: 'id' }) as Observable<Note[]>;
  }

  /**
   * Fetches all notes that are reminders and sorts them by date.
   */
  getReminders(): Observable<Note[]> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not logged in!');
    
    const q = query(this.notesCollection,
      where('userId', '==', user.uid),
      where('reminderDate', '!=', null),
      where('isArchived', '==', false), 
      where('isTrashed', '==', false),
      orderBy('reminderDate', 'asc') // <-- THIS LINE to sort ascending
    );

    return collectionData(q, { idField: 'id' }) as Observable<Note[]>;
  }


  async updateNote(noteId: string, dataToUpdate: Partial<Note>): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${noteId}`);
    await updateDoc(noteDocRef, dataToUpdate);
  }

  async deleteNotePermanently(noteId: string): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${noteId}`);
    await deleteDoc(noteDocRef);
  }

  /**
   * PERMANENTLY DELETES ALL TRASHED NOTES FOR THE CURRENT USER.
   * This is an irreversible action.
   */
  async emptyTrash(): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not logged in!');

    // 1. Create a query to find all trashed notes for this user.
    const q = query(this.notesCollection, 
      where('userId', '==', user.uid),
      where('isTrashed', '==', true)
    );

    // 2. Get the documents that match the query.
    const querySnapshot = await getDocs(q);

    // 3. Create a "batch" write to delete all found documents in one operation.
    const batch = writeBatch(this.firestore);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 4. Commit the batch.
    await batch.commit();
  }

  
}