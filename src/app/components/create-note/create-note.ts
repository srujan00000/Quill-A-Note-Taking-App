import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note'; // Adjust path

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-note.html',
  styleUrls: ['./create-note.scss']
})
export class CreateNoteComponent {
  
   @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  
  private noteService = inject(NoteService);

  isActive = false;
  noteTitle = '';
  noteContent = '';
  reminderDate: Date | null = null;


   openDatePicker() {
    try {
      this.dateInput.nativeElement.showPicker();
    } catch (error) {
      console.error("Browser doesn't support showPicker(), falling back to focus(). Error:", error);
      // As a fallback for older browsers, we can try focusing it.
      this.dateInput.nativeElement.focus();
    }
  }
  activateForm() {
    if (this.isActive) return;
    this.isActive = true;
    setTimeout(() => { this.titleInput.nativeElement.focus(); }, 0);
  }

  resetAndDeactivateForm() {
    this.isActive = false;
    this.noteTitle = '';
    this.noteContent = '';
    this.reminderDate = null;
    if (this.textarea) {
      this.textarea.nativeElement.style.height = 'auto';
    }
  }
  
  autoResizeTextarea() {
    const textarea = this.textarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  setReminder(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.reminderDate = new Date(input.value);
    }
  }

  clearReminder() {
    this.reminderDate = null;
  }
  
  // The `openDatePicker` method is no longer needed.

  private async _save(options: { isArchived?: boolean, isTrashed?: boolean } = {}) {
    if (!this.isActive) return;

    if (this.noteTitle.trim() || this.noteContent.trim()) {
      try {
        await this.noteService.addNote({
          title: this.noteTitle,
          content: this.noteContent,
          reminderDate: this.reminderDate,
          isArchived: options.isArchived,
          isTrashed: options.isTrashed,
        });
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
    this.resetAndDeactivateForm();
  }

  saveNote() { this._save(); }
  archiveNote() { this._save({ isArchived: true }); }
  trashNote() { this._save({ isTrashed: true }); }
}