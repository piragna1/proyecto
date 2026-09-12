import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../login/services/login-service';
import { Router } from "@angular/router";
import { ToastService } from '../../shared/services/toast-service';

@Component({
  selector: 'app-formulario-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-admin.html',
  styleUrl: './formulario-admin.css',
})
export class FormularioAdmin {
  as: AuthService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  ls: LoginService = inject(LoginService);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]]
  });
  r: Router = inject(Router);
  toasts: ToastService = inject(ToastService);
  onLogin() {

    if (this.formulario.invalid) return;

    const { email, clave } = this.formulario.value;
    this.ls.loginAdmin(email, clave).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token);
        this.as.logIn();
        this.r.navigateByUrl('/home-admin');
      },
      error: (err) => {
        console.log('Error en login:', err);
        this.toasts.mostrarMensaje(err.error?.mensaje || 'Error al iniciar sesión', true);
      }
    })
  }
}
