import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // A BehaviorSubject is a special observable that keeps track of the current value.
  // We initialize it with an empty string.
  private searchTermSource = new BehaviorSubject<string>('');

  // We expose the observable publicly so components can listen for changes.
  public searchTerm$ = this.searchTermSource.asObservable();

  /**
   * Called by the HeaderComponent to update the search term.
   */
  setSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }
}