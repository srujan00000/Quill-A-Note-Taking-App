import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../interfaces/note.interface'; 

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss']
})
export class NoteCardComponent {
  // The note data is passed in from the parent component.
  @Input() note!: Note;

  // Event emitters to notify the parent of an action.
  @Output() edit = new EventEmitter<Note>();
  @Output() archive = new EventEmitter<string>();
  @Output() unarchive = new EventEmitter<string>();
  @Output() trash = new EventEmitter<string>();
  @Output() restore = new EventEmitter<string>();
  @Output() deletePermanently = new EventEmitter<string>();

  
}