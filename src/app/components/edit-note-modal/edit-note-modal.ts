import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../interfaces/note.interface'; 
import { NoteService } from '../../services/note'; 

@Component({
  selector: 'app-edit-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-note-modal.html',
  styleUrls: ['./edit-note-modal.scss']
})
export class EditNoteModal implements OnInit {

 
  @Output() archive = new EventEmitter<string>();
  @Output() unarchive = new EventEmitter<string>();
  @Output() trash = new EventEmitter<string>();
  @Output() restore = new EventEmitter<string>();
  @Output() deletePermanently = new EventEmitter<string>();
  // Receive the note to be edited from the parent.
  @Input() note!: Note;
  
  // Emit events to notify the parent to close the modal or update the note.
  @Output() closeModal = new EventEmitter<void>();
  
  // A local copy of the note to edit, so we don't modify the original directly.
  editableNote!: Partial<Note>;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    // Create a safe, editable copy of the note when the component loads.
    this.editableNote = { ...this.note };
  }

  // Called by the "Close" button.
  saveAndClose(): void {
    if (this.editableNote.id) {
      this.noteService.updateNote(this.editableNote.id, {
        title: this.editableNote.title,
        content: this.editableNote.content,
      });
    }
    this.closeModal.emit();
  }

  // Called by the backdrop.
  closeWithoutSaving(): void {
    this.closeModal.emit();
  }

  // Each method emits the note's ID and then closes the modal.
  onArchive() {
    this.archive.emit(this.note.id);
    this.closeModal.emit();
  }

  onUnarchive() {
    this.unarchive.emit(this.note.id);
    this.closeModal.emit();
  }

  onTrash() {
    this.trash.emit(this.note.id);
    this.closeModal.emit();
  }

  onRestore() {
    this.restore.emit(this.note.id);
    this.closeModal.emit();
  }

  onDeletePermanently() {
    this.deletePermanently.emit(this.note.id);
    this.closeModal.emit();
  }
}