import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.css'
})
export class SplashScreen implements OnInit {
  @Output() finished = new EventEmitter<void>();

  progress = signal(0);
  isVisible = signal(true);
  isFading = signal(false);

  ngOnInit(): void {
    // Progresser de 0 à 100 en 3 secondes
    const duration = 3000;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      this.progress.set(Math.round((current / steps) * 100));

      if (current >= steps) {
        clearInterval(timer);
        this.progress.set(100);

        // Fade out après 100%
        setTimeout(() => {
          this.isFading.set(true);
          setTimeout(() => {
            this.isVisible.set(false);
            this.finished.emit();
          }, 800);
        }, 300);
      }
    }, interval);
  }
}
