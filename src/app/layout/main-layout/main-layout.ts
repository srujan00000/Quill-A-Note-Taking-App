import { Component, HostBinding } from '@angular/core';
import { Sidenav } from "../../components/sidenav/sidenav";
import { Header } from "../../components/header/header";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  imports: [Sidenav, Header, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
// Tracks the state set by the user's CLICK on the menu button.
  private isSidenavManuallyCollapsed = false;
  
  // Tracks the current MOUSE HOVER state over the sidenav.
  private isSidenavHovered = false;

  /**
   * This is a "getter" property.
   * The template uses this to decide if the sidenav should be collapsed.
   * Its value is calculated based on the manual and hover states.
   */
  get isSidenavCollapsed(): boolean {
    // The sidenav should be collapsed ONLY IF it was manually collapsed AND the user is NOT hovering over it.
    return this.isSidenavManuallyCollapsed && !this.isSidenavHovered;
  }
  
  // --- THEME MANAGEMENT ---

  @HostBinding('class.dark-theme')
  isDarkMode = true;

  // --- EVENT HANDLERS (called from the template) ---

  /**
   * Called when the header's menu button is clicked.
   * It only changes the manual collapse state.
   */
  toggleSidenav() {
    this.isSidenavManuallyCollapsed = !this.isSidenavManuallyCollapsed;
  }

  /**
   * Called when the theme toggle button is clicked.
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
  
  /**
   * Called by (mouseenter) and (mouseleave) events on the sidenav.
   * @param isHovering - True when the mouse enters, false when it leaves.
   */
  onSidenavHover(isHovering: boolean): void {
    this.isSidenavHovered = isHovering;
  }
}
