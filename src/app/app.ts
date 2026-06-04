import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SplashScreen } from './shared/components/splash-screen/splash-screen';
import { SplashService } from './core/services/splash.service';
import { ScrollToTopService } from './core/services/scroll-to-top';

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

  constructor(
    public splashService: SplashService,
    private scrollToTop: ScrollToTopService
  ) {
    if (!sessionStorage.getItem('splash_shown')) {
      sessionStorage.setItem('splash_shown', 'true');
    }
  }
}