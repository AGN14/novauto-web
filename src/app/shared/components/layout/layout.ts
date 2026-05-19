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
    <router-outlet />
    <app-footer />
  `
})
export class Layout {}