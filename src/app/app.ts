import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],  // ← retirer RouterOutlet si vous ne l'utilisez pas encore
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'novauto-web';
}