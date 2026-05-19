import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, ArrowLeft, AlertTriangle, Check, Mail } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  readonly ArrowLeft = ArrowLeft;
  readonly AlertTriangle = AlertTriangle;
  readonly Check = Check;
  readonly Mail = Mail;

  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() { return this.form.get('email'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.http.post('http://localhost:8000/api/auth/forgot-password', this.form.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Un lien de réinitialisation a été envoyé à votre email.');
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 422) {
          this.errorMessage.set('Aucun compte n\'est associé à cet email.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Réessayez.');
        }
      }
    });
  }
}