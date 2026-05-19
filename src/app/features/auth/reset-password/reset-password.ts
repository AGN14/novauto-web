import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, ArrowLeft, AlertTriangle, Check, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  readonly ArrowLeft = ArrowLeft;
  readonly AlertTriangle = AlertTriangle;
  readonly Check = Check;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  private token = '';
  private email = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.email = this.route.snapshot.queryParams['email'] || '';

    if (!this.token || !this.email) {
      this.errorMessage.set('Lien de réinitialisation invalide ou expiré.');
    }
  }

  get password() { return this.form.get('password'); }
  get password_confirmation() { return this.form.get('password_confirmation'); }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  togglePassword() { this.showPassword.update(v => !v); }
  toggleConfirmPassword() { this.showConfirmPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.post('http://localhost:8000/api/auth/reset-password', {
      token: this.token,
      email: this.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Mot de passe réinitialisé avec succès !');
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 422) {
          this.errorMessage.set('Token invalide ou expiré. Demandez un nouveau lien.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Réessayez.');
        }
      }
    });
  }
}