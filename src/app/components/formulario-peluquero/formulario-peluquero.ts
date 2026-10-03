import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { LoginService } from '../../login/services/login-service';
import { ToastService } from '../../shared/services/toast-service';
import { emailValidator } from '../../shared/utils/validators';
import { mensajeDeError } from '../../shared/utils/errorMessages';

@Component({
  selector: 'app-formulario-peluquero',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-peluquero.html',
  styleUrl: './formulario-peluquero.css',
})
export class FormularioPeluquero {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator]],
    clave: ['', [Validators.required]],
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  as: AuthService = inject(AuthService);
  ls: LoginService = inject(LoginService);
  r: Router = inject(Router);
  toasts: ToastService = inject(ToastService);
  mensajeError = signal('');
  onLogin() {
    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.toasts.mostrarMensaje('Los datos ingresados no son válidos. Revisá los campos marcados.', true);
      return;
    }
    this.mensajeError.set('');
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
        const mensaje = mensajeDeError(err, 'Error al iniciar sesión');
        this.mensajeError.set(mensaje);
        this.toasts.mostrarMensaje(mensaje, true);
      }
    })
  }

  hayError(campo: 'email' | 'clave'): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: 'email' | 'clave'): string {
    const c = this.formulario.controls[campo];
    if (c.invalid && c.hasError('required')) return campo === 'email' ? 'El email es requerido' : 'La clave es requerida';
    if (c.invalid && c.hasError('email')) return 'El email no es válido';
    return '';
  }
}
