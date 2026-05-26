import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Bell } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  readonly Bell = Bell;

  notifications = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        console.log('Notifications reçues:', data);
        // Afficher la première notification en détail pour voir la structure
        if (data && data.length > 0) {
          console.log('Première notification détaillée:', JSON.stringify(data[0], null, 2));
        }
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement notifications:', err);
        this.isLoading.set(false);
      }
    });
  }

  marquerLue(id: number): void {
    const notification = this.notifications().find(n => n.id === id);
    if (notification && !notification.lu) {
      this.notificationService.marquerLue(id).subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(n => n.id === id ? { ...n, lu: true } : n)
          );
        }
      });
    }
  }

  marquerToutesLues(): void {
    this.notificationService.marquerToutesLues().subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, lu: true })));
      }
    });
  }

  hasNonLues(): boolean {
    return this.notifications().some(n => !n.lu);
  }

  onNotificationClick(notification: any): void {
    // Marquer comme lue
    this.marquerLue(notification.id);

    // Rediriger si lien disponible
    // if (notification.lien) {
    //   this.router.navigate([notification.lien]);
    // }
  }

  getInitiales(notification: any): string {
    const expediteur = this.getExpediteur(notification);

    if (expediteur === 'NOVAuto') {
      return 'N';
    }

    const mots = expediteur.split(' ');
    if (mots.length >= 2) {
      return (mots[0][0] + mots[1][0]).toUpperCase();
    }
    return expediteur.substring(0, 2).toUpperCase();
  }

  getExpediteur(notification: any): string {
    // Si expéditeur disponible (nouveau système)
    if (notification.expediteur) {
      // Si l'expéditeur a un profil acheteur
      if (notification.expediteur.acheteur) {
        return `${notification.expediteur.prenom || ''} ${notification.expediteur.nom || ''}`.trim();
      }
      // Si l'expéditeur a un profil vendeur
      if (notification.expediteur.vendeur) {
        return notification.expediteur.vendeur.nom_entreprise || `${notification.expediteur.prenom || ''} ${notification.expediteur.nom || ''}`.trim();
      }
      // Sinon juste le nom de l'user
      return `${notification.expediteur.prenom || ''} ${notification.expediteur.nom || ''}`.trim() || 'Utilisateur';
    }

    // Fallback : notifications système
    return 'NOVAuto';
  }

  getTempsRelatif(date: string): string {
    const now = new Date().getTime();
    const notifDate = new Date(date).getTime();
    const diff = Math.floor((now - notifDate) / 1000);

    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
