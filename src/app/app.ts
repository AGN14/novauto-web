import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SplashScreen } from './shared/components/splash-screen/splash-screen';
import { SplashService } from './core/services/splash.service';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SplashScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'novauto-web';
  showSplash = signal(!sessionStorage.getItem('splash_shown'));
  themeService = inject(ThemeService);

  constructor(public splashService: SplashService) {
    // Afficher le splash au premier chargement
    if (!sessionStorage.getItem('splash_shown')) {
      sessionStorage.setItem('splash_shown', 'true');
    }
  }
}