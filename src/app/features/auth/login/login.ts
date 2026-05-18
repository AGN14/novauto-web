import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, Eye, EyeOff, AlertTriangle, ArrowLeft, Check } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertTriangle = AlertTriangle;
  readonly ArrowLeft = ArrowLeft;
  readonly Check = Check;

  loginForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect.');
        } else if (err.status === 422) {
          this.errorMessage.set('Veuillez vérifier vos informations.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Réessayez.');
        }
      }
    });
  }
}