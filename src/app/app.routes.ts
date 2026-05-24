import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { acheteurGuard } from './core/guards/acheteur-guard';
import { vendeurGuard } from './core/guards/vendeur-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
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
            path: 'nouveau-rendez-vous/:id',
            loadComponent: () =>
              import('./features/acheteur/nouveau-rendez-vous/nouveau-rendez-vous').then(m => m.NouveauRendezVous)
          },
          {
            path: 'nouvelle-reservation/:id',
            loadComponent: () =>
              import('./features/acheteur/nouvelle-reservation/nouvelle-reservation').then(m => m.NouvelleReservation)
          },
          {
            path: 'mes-rendez-vous',
            loadComponent: () =>
              import('./features/acheteur/mes-rendez-vous/mes-rendez-vous').then(m => m.MesRendezVous)
          },
          {
            path: 'mes-reservations',
            loadComponent: () =>
              import('./features/acheteur/mes-reservations/mes-reservations').then(m => m.MesReservations)
          },
          {
            path: 'mes-avis',
            loadComponent: () =>
              import('./features/acheteur/mes-avis/mes-avis').then(m => m.MesAvis)
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
            path: 'mes-annonces/:id',
            loadComponent: () =>
              import('./features/vendeur/annonce-detail/annonce-detail').then(m => m.VendeurAnnonceDetail)
          },
          {
            path: 'mes-annonces/:id/certification',
            loadComponent: () =>
              import('./features/vendeur/certification/certification').then(m => m.Certification)
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
          },
          {
            path: 'reservations',
            loadComponent: () =>
              import('./features/vendeur/reservations/reservations').then(m => m.VendeurReservations)
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
          },
          {
            path: 'annonces/:id',
            loadComponent: () =>
              import('./features/admin/annonce-detail/annonce-detail').then(m => m.AdminAnnonceDetail)
          },
          {
            path: 'avis-signales',
            loadComponent: () =>
              import('./features/admin/avis-signales/avis-signales').then(m => m.AvisSignalesComponent)
          }
        ]
      },
    ]
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
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword)
      },
      {
        path: 'admin-login',
        loadComponent: () =>
          import('./features/auth/admin-login/admin-login').then(m => m.AdminLogin)
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];