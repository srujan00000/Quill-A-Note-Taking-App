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
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, EditNoteModal],
  templateUrl: './reminders.html',
  styleUrls: ['./reminders.scss']
})
export class Reminders {
  private noteService = inject(NoteService);
  public notes$: Observable<Note[]>;


  public selectedNote: Note | null = null;
  openEditModal(note: Note) {
    this.selectedNote = note;
  }

  closeEditModal() {
    this.selectedNote = null;
  }
  private searchService = inject(SearchService);
  constructor() {
    this.notes$ = this.noteService.getReminders();

     // Get the special stream of reminder notes.
    const allNotes$ = this.noteService.getReminders();

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

  archiveNote(noteId: string) {
    this.noteService.updateNote(noteId, { isArchived: true });
  }

  trashNote(noteId: string) {
    this.noteService.updateNote(noteId, { isTrashed: true });
  }
}