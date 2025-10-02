import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note'; // Adjust path if needed
import { Note } from '../../interfaces/note.interface';
import { Observable } from 'rxjs';
import { CreateNoteComponent } from '../../components/create-note/create-note';
import { NoteCardComponent } from '../../components/note-card/note-card';
import { EditNoteModal } from '../../components/edit-note-modal/edit-note-modal';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-notes',
  standalone: true,
  // Import the components we need to use in the template
  imports: [CommonModule, CreateNoteComponent, NoteCardComponent, EditNoteModal],
  templateUrl: './notes.html',
  styleUrls: ['./notes.scss']
})
export class Notes {
  private noteService = inject(NoteService);
  public selectedNote: Note | null = null;

  // This will hold the live-updating list of active notes from Firestore.
  public notes$: Observable<Note[]>;


  private searchService = inject(SearchService); 

  constructor() {
    // We call the service to get only the 'active' notes.
    this.notes$ = this.noteService.getNotesByStatus('active');

    // 1. Get the original, unfiltered stream of notes.
    const allNotes$ = this.noteService.getNotesByStatus('active');

    // 2. Get the stream of search terms.
    const searchTerm$ = this.searchService.searchTerm$;

    // 3. Use combineLatest to merge them. This runs whenever either stream updates.
    this.notes$ = combineLatest([allNotes$, searchTerm$]).pipe(
      map(([notes, term]) => {
        if (!term) {
          return notes; // If search term is empty, return all notes.
        }
        // If there is a search term, filter the notes.
        const lowerCaseTerm = term.toLowerCase();
        return notes.filter(note => 
          note.title.toLowerCase().includes(lowerCaseTerm) || 
          note.content.toLowerCase().includes(lowerCaseTerm)
        );
      })
    );
  }


  
  openEditModal(note: Note) {
    this.selectedNote = note;
  }

  closeEditModal() {
    this.selectedNote = null;
  }
  // --- Event Handlers for Note Card Actions ---

  archiveNote(noteId: string) {
    if (!noteId) return;
    // We tell the service to update the note's `isArchived` flag.
    this.noteService.updateNote(noteId, { isArchived: true });
  }

  trashNote(noteId: string) {
    if (!noteId) return;
    // We tell the service to update the note's `isTrashed` flag.
    this.noteService.updateNote(noteId, { isTrashed: true });
  }
}