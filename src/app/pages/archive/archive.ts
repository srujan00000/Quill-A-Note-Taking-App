import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note'; // Adjust path if needed
import { Note } from '../../interfaces/note.interface';
import { Observable } from 'rxjs';
import { NoteCardComponent } from '../../components/note-card/note-card';
import { EditNoteModal } from "../../components/edit-note-modal/edit-note-modal";
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, EditNoteModal],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class Archive {
  private noteService = inject(NoteService);

  public selectedNote: Note | null = null;
  openEditModal(note: Note) {
    this.selectedNote = note;
  }

  closeEditModal() {
    this.selectedNote = null;
  }

  // This will hold the live-updating list of ARCHIVED notes.
  public notes$: Observable<Note[]>;
private searchService = inject(SearchService);
  constructor() {
    // We call the service to get only the 'archived' notes.
    this.notes$ = this.noteService.getNotesByStatus('archived');

    // Get the stream of notes with the status 'archived'.
    const allNotes$ = this.noteService.getNotesByStatus('archived');

    
    const searchTerm$ = this.searchService.searchTerm$;

    this.notes$ = combineLatest([allNotes$, searchTerm$]).pipe(
      map(([notes, term]) => {
        if (!term) {
          return notes;
        }
        const lowerCaseTerm = term.toLowerCase();
        return notes.filter(note => 
          note.title.toLowerCase().includes(lowerCaseTerm) || 
          note.content.toLowerCase().includes(lowerCaseTerm)
        );
      })
    );
  }



  // --- Event Handlers for Note Card Actions ---

  unarchiveNote(noteId: string) {
    if (!noteId) return;
    // We set isArchived back to false to move it to the main notes page.
    this.noteService.updateNote(noteId, { isArchived: false });
  }

  trashNote(noteId: string) {
    if (!noteId) return;
    // We set isTrashed to true.
    this.noteService.updateNote(noteId, { isTrashed: true });
  }
}