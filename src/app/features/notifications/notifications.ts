import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { LucideAngularModule, Bell, Check, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  readonly Bell = Bell;
  readonly Check = Check;
  readonly Trash2 = Trash2;

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
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement notifications:', err);
        this.isLoading.set(false);
      }
    });
  }

  marquerToutesLues(): void {
    this.notificationService.marquerToutesLues().subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, lu: true })));
      }
    });
  }

  marquerLue(id: number): void {
    this.notificationService.marquerLue(id).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(n => n.id === id ? { ...n, lu: true } : n)
        );
      }
    });
  }

  supprimerNotification(id: number): void {
    this.notificationService.supprimer(id).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(n => n.id !== id));
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
