import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GarageAuthService } from '../../../core/services/garage-auth';
import { LucideAngularModule, LogIn, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-garage-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class GarageLogin {
  private fb = inject(FormBuilder);
  private garageAuth = inject(GarageAuthService);
  private router = inject(Router);

  readonly LogIn = LogIn;
  readonly AlertCircle = AlertCircle;

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.garageAuth.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/garage/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.'
        );
      }
    });
  }
}
