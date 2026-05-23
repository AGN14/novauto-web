import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, ShieldCheck, ShieldX, Eye, Search } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendeurs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './vendeurs.html',
  styleUrl: './vendeurs.css'
})
export class Vendeurs implements OnInit {

  readonly ShieldCheck = ShieldCheck;
  readonly ShieldX = ShieldX;
  readonly Eye = Eye;
  readonly Search = Search;

  vendeurs = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVendeurs();
  }

  loadVendeurs(page: number = 1): void {
    this.isLoading.set(true);
    this.http.get<any>(`${this.API_URL}/admin/vendeurs?page=${page}&per_page=10`).subscribe({
      next: (data) => {
        this.vendeurs.set(data.data || data);
        this.currentPage.set(data.current_page || 1);
        this.lastPage.set(data.last_page || 1);
        this.total.set(data.total || data.length);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  certifierVendeur(id: number): void {
    this.http.post(`${this.API_URL}/admin/vendeurs/${id}/certifier`, {}).subscribe({
      next: () => {
        this.vendeurs.update(list =>
          list.map(v => v.id === id ? { ...v, certifie: true } : v)
        );
      }
    });
  }

  suspendreVendeur(id: number): void {
    this.http.post(`${this.API_URL}/admin/vendeurs/${id}/suspendre`, {}).subscribe({
      next: () => {
        this.vendeurs.update(list =>
          list.map(v => v.id === id ? { ...v, certifie: false } : v)
        );
      }
    });
  }

  filteredVendeurs() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.vendeurs();
    return this.vendeurs().filter(v =>
      v.user?.nom?.toLowerCase().includes(q) ||
      v.user?.email?.toLowerCase().includes(q)
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.loadVendeurs(page);
    }
  }
}