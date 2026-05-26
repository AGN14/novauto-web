import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'gold';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'novauto-theme';

  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    return (stored === 'gold' || stored === 'dark') ? stored : 'dark';
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'dark' ? 'gold' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.body.classList.remove('theme-dark', 'theme-gold');
    document.body.classList.add(`theme-${theme}`);
  }
}
