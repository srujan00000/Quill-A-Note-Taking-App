import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note';
import { Note } from '../../interfaces/note.interface';
import { Observable } from 'rxjs';
import { NoteCardComponent } from '../../components/note-card/note-card';
import { EditNoteModal } from "../../components/edit-note-modal/edit-note-modal";
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, EditNoteModal],
  templateUrl: './trash.html',
  styleUrls: ['./trash.scss']
})

export class Trash {
  private noteService = inject(NoteService);

  public notes$: Observable<Note[]>;
  public showConfirmationModal = false;

  public selectedNote: Note | null = null;
  openEditModal(note: Note) {
    this.selectedNote = note;
  }

  closeEditModal() {
    this.selectedNote = null;
  }

  
  //  This will store the ID of the single note we intend to delete.
  public noteIdToDelete: string | null = null;
private searchService = inject(SearchService);
  constructor() {
    this.notes$ = this.noteService.getNotesByStatus('trashed');

    const allNotes$ = this.noteService.getNotesByStatus('trashed');

    // The rest of the constructor is the same...
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

  restoreNote(noteId: string) {
    if (!noteId) return;
    this.noteService.updateNote(noteId, { isTrashed: false });
  }

  //  This just sets up the modal.
  deleteNotePermanently(noteId: string) {
    if (!noteId) return;
    this.noteIdToDelete = noteId; // Store the ID
    this.showConfirmationModal = true; // Open the modal
  }

  promptEmptyTrash() {
    this.noteIdToDelete = null; // Ensure we're not deleting a single note
    this.showConfirmationModal = true;
  }

  // This method handles BOTH "Empty Trash" and single deletion.
  confirmDeleteAction() {
    if (this.noteIdToDelete) {
      // If we have a single note ID, delete just that one.
      this.noteService.deleteNotePermanently(this.noteIdToDelete);
    } else {
      // Otherwise, empty the entire trash.
      this.noteService.emptyTrash();
    }
    this.closeModal();
  }

  // A method to close the modal and reset state.
  closeModal() {
    this.showConfirmationModal = false;
    this.noteIdToDelete = null;
  }
}