import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, Eye, EyeOff, AlertTriangle, ArrowLeft, Check, User, Building2, ShoppingBag } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly AlertTriangle = AlertTriangle;
  readonly ArrowLeft = ArrowLeft;
  readonly Check = Check;
  readonly User = User;
  readonly Building2 = Building2;
  readonly ShoppingBag = ShoppingBag;

  registerForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  typeCompte = signal<'ACHETEUR' | 'VENDEUR_PARTICULIER' | 'VENDEUR_PROFESSIONNEL'>('ACHETEUR');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      ifu: [''],
      nom_structure: [''],
      adresse_structure: [''],
      rccm: [''],
    }, { validators: this.passwordMatchValidator });
  }

  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get tel() { return this.registerForm.get('tel'); }
  get password() { return this.registerForm.get('password'); }
  get password_confirmation() { return this.registerForm.get('password_confirmation'); }
  get ifu() { return this.registerForm.get('ifu'); }
  get nom_structure() { return this.registerForm.get('nom_structure'); }
  get adresse_structure() { return this.registerForm.get('adresse_structure'); }
  get rccm() { return this.registerForm.get('rccm'); }

  get isAcheteur() { return this.typeCompte() === 'ACHETEUR'; }
  get isVendeurParticulier() { return this.typeCompte() === 'VENDEUR_PARTICULIER'; }
  get isVendeurProfessionnel() { return this.typeCompte() === 'VENDEUR_PROFESSIONNEL'; }
  get isVendeur() { return this.typeCompte() === 'VENDEUR_PARTICULIER' || this.typeCompte() === 'VENDEUR_PROFESSIONNEL'; }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  selectType(type: 'ACHETEUR' | 'VENDEUR_PARTICULIER' | 'VENDEUR_PROFESSIONNEL'): void {
    this.typeCompte.set(type);

    if (type === 'VENDEUR_PROFESSIONNEL') {
      this.registerForm.get('ifu')?.setValidators([Validators.required]);
      this.registerForm.get('nom_structure')?.setValidators([Validators.required]);
      this.registerForm.get('adresse_structure')?.setValidators([Validators.required]);
      this.registerForm.get('rccm')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('ifu')?.clearValidators();
      this.registerForm.get('nom_structure')?.clearValidators();
      this.registerForm.get('adresse_structure')?.clearValidators();
      this.registerForm.get('rccm')?.clearValidators();
    }

    this.registerForm.get('ifu')?.updateValueAndValidity();
    this.registerForm.get('nom_structure')?.updateValueAndValidity();
    this.registerForm.get('adresse_structure')?.updateValueAndValidity();
    this.registerForm.get('rccm')?.updateValueAndValidity();
  }

  togglePassword(): void { this.showPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload = {
      ...this.registerForm.value,
      role: this.isAcheteur ? 'ACHETEUR' : 'VENDEUR',
      type_compte: this.isVendeurProfessionnel ? 'PROFESSIONNEL' : this.isVendeurParticulier ? 'PARTICULIER' : null,
    };

    this.authService.register(payload).subscribe({
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 422) {
          const errors = err.error?.errors;
          if (errors?.email) {
            this.errorMessage.set('Cet email est déjà utilisé.');
          } else if (errors?.ifu) {
            this.errorMessage.set('Ce numéro IFU est déjà utilisé.');
          } else {
            this.errorMessage.set('Veuillez vérifier vos informations.');
          }
        } else {
          this.errorMessage.set('Une erreur est survenue. Réessayez.');
        }
      }
    });
  }
}