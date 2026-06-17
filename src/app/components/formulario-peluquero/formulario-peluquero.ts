import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { LoginService } from '../../login/services/login-service';

@Component({
  selector: 'app-formulario-peluquero',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-peluquero.html',
  styleUrl: './formulario-peluquero.css',
})
export class FormularioPeluquero {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(8)]],
  });
  as: AuthService = inject(AuthService);
  ls: LoginService = inject(LoginService);
  r: Router = inject(Router);
  onLogin() {
    if (this.formulario.invalid) return;
    const { email, clave } = this.formulario.value;
    this.ls.login(email, clave).subscribe({
      next: (res) => {
        console.log('respuesta del login:', res);
        localStorage.setItem('token', res.token);
        this.as.logIn();
        this.r.navigateByUrl('/home-peluquero');
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
