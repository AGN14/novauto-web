import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
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
export class Navbar implements OnInit {

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
  isScrolled = signal(false);

  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

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
  get menuVendeurLinks() {
  return [
    { label: 'Mon Dashboard', route: '/vendeur/dashboard' },
    { label: 'Mes Annonces', route: '/vendeur/mes-annonces' },
    { label: 'Nouvelle Annonce', route: '/vendeur/nouvelle-annonce' },
    { label: 'Mes Disponibilités', route: '/vendeur/disponibilites' },
  ];
}

get menuAcheteurLinks() {
  return [
    { label: 'Mon Dashboard', route: '/acheteur/dashboard' },
    { label: 'Mes Réservations', route: '/acheteur/reservations' },
    { label: 'Mes Rendez-Vous', route: '/acheteur/rendez-vous' },
  ];
}

get menuAdminLinks() {
  return [
    { label: 'Dashboard Admin', route: '/admin/dashboard' },
    { label: 'Vendeurs', route: '/admin/vendeurs' },
    { label: 'Annonces', route: '/admin/annonces' },
    { label: 'Transactions', route: '/admin/transactions' },
  ];
}

get menuLinks() {
  if (this.authService.isAdmin()) return this.menuAdminLinks;
  if (this.authService.isVendeur()) return this.menuVendeurLinks;
  return this.menuAcheteurLinks;
}
}