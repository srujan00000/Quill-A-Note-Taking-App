import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SearchService } from '../../services/search';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  @Input() isDarkMode=false;
  @Output() sidenavToggled=new EventEmitter<void>();
  @Output() themeToggled=new EventEmitter<void>();

  onToggleSidenav(){
    this.sidenavToggled.emit();
  }

  onToggleTheme(){
    this.themeToggled.emit();
  }

   private searchService = inject(SearchService);
  
  // This property will be bound to the input field
  public searchTerm = '';

  // This method is called every time the user types in the search bar
  onSearchChange(): void {
    this.searchService.setSearchTerm(this.searchTerm);
  }

}
