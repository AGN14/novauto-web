import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { LucideAngularModule, Bell, Check } from 'lucide-angular';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css'
})
export class NotificationBell implements OnInit, OnDestroy {
  readonly Bell = Bell;
  readonly Check = Check;

  notifications = signal<any[]>([]);
  nonLuesCount = signal<number>(0);
  dropdownOuvert = signal(false);
  isLoading = signal(false);
  private pollingInterval: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.chargerNotifications();
    this.chargerNonLues();

    // Polling toutes les 30 secondes
    this.pollingInterval = setInterval(() => {
      this.chargerNonLues();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  chargerNotifications(): void {
    this.isLoading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        console.log('NotificationBell - Notifications reçues:', data);
        this.notifications.set(data.slice(0, 5));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('NotificationBell - Erreur chargement:', err);
        this.isLoading.set(false);
      }
    });
  }

  chargerNonLues(): void {
    this.notificationService.getNonLues().subscribe({
      next: (data) => {
        console.log('NotificationBell - Non lues:', data.count);
        this.nonLuesCount.set(data.count);
      },
      error: (err) => {
        console.error('NotificationBell - Erreur non lues:', err);
      }
    });
  }

  toggleDropdown(): void {
    const wasOpen = this.dropdownOuvert();
    this.dropdownOuvert.set(!wasOpen);

    if (!wasOpen) {
      this.chargerNotifications();
    }
  }

  marquerToutesLues(): void {
    this.notificationService.marquerToutesLues().subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, lu: true })));
        this.nonLuesCount.set(0);
      }
    });
  }

  cliquerNotification(notification: any): void {
    if (!notification.lu) {
      this.notificationService.marquerLue(notification.id).subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(n => n.id === notification.id ? { ...n, lu: true } : n)
          );
          this.chargerNonLues();
        }
      });
    }
    this.dropdownOuvert.set(false);
  }

  supprimerNotification(event: Event, id: number): void {
    event.stopPropagation();
    this.notificationService.supprimer(id).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(n => n.id !== id));
        this.chargerNonLues();
      }
    });
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
