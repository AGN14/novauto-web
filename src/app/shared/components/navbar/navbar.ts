import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../.././../core/services/auth.service';
import { LucideAngularModule, Menu, X, User, LogOut, LayoutDashboard, Car, PlusCircle } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  readonly Menu = Menu;
  readonly X = X;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly LayoutDashboard = LayoutDashboard;
  readonly Car = Car;
  readonly PlusCircle = PlusCircle;

  authService = inject(AuthService);
  menuOuvert = signal(false);
  menuUserOuvert = signal(false);

  toggleMenu() { this.menuOuvert.update(v => !v); }
  toggleUserMenu() { this.menuUserOuvert.update(v => !v); }
  fermerMenu() { this.menuOuvert.set(false); }

  logout(): void {
    this.authService.logout();
    this.menuUserOuvert.set(false);
  }

  get dashboardLink(): string {
    switch (this.authService.userRole()) {
      case 'ADMINISTRATEUR': return '/admin/dashboard';
      case 'VENDEUR': return '/vendeur/dashboard';
      case 'ACHETEUR': return '/acheteur/dashboard';
      default: return '/';
    }
  }
}