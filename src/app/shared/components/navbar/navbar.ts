import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  menuOuvert = signal(false);

  toggleMenu() {
    this.menuOuvert.update(v => !v);
  }

  fermerMenu() {
    this.menuOuvert.set(false);
  }
}