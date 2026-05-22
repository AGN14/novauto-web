import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar />
    <div class="layout-content">
      <router-outlet />
    </div>
    <app-footer />
  `,
  styles: [`
    .layout-content {
      padding-top: 64px;
      min-height: 100vh;
    }
  `]
})
export class Layout {}