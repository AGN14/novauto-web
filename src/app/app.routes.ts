import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { acheteurGuard } from './core/guards/acheteur-guard';
import { vendeurGuard } from './core/guards/vendeur-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(m => m.Register)
      }
    ]
  },

  {
    path: 'catalogue',
    loadComponent: () =>
      import('./features/catalogue/catalogue').then(m => m.Catalogue)
  },

  {
    path: 'catalogue/:id',
    loadComponent: () =>
      import('./features/catalogue/annonce-detail/annonce-detail').then(m => m.AnnonceDetail)
  },

  {
    path: 'vin-decoder',
    loadComponent: () =>
      import('./features/vin-decoder/vin-decoder').then(m => m.VinDecoder)
  },

  {
    path: 'simulateur',
    loadComponent: () =>
      import('./features/simulateur/simulateur').then(m => m.Simulateur)
  },

  {
    path: 'acheteur',
    canActivate: [acheteurGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/acheteur/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/acheteur/reservations/reservations').then(m => m.Reservations)
      },
      {
        path: 'rendez-vous',
        loadComponent: () =>
          import('./features/acheteur/rendez-vous/rendez-vous').then(m => m.RendezVous)
      }
    ]
  },

  {
    path: 'vendeur',
    canActivate: [vendeurGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/vendeur/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'mes-annonces',
        loadComponent: () =>
          import('./features/vendeur/mes-annonces/mes-annonces').then(m => m.MesAnnonces)
      },
      {
        path: 'nouvelle-annonce',
        loadComponent: () =>
          import('./features/vendeur/nouvelle-annonce/nouvelle-annonce').then(m => m.NouvelleAnnonce)
      },
      {
        path: 'disponibilites',
        loadComponent: () =>
          import('./features/vendeur/disponibilites/disponibilites').then(m => m.Disponibilites)
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'vendeurs',
        loadComponent: () =>
          import('./features/admin/vendeurs/vendeurs').then(m => m.Vendeurs)
      },
      {
        path: 'annonces',
        loadComponent: () =>
          import('./features/admin/annonces/annonces').then(m => m.Annonces)
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/admin/transactions/transactions').then(m => m.Transactions)
      },
      {
        path: 'garages',
        loadComponent: () =>
          import('./features/admin/garages/garages').then(m => m.Garages)
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];