import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginService } from '../../login/services/login-service';
import { Router } from "@angular/router";
import { ToastService } from '../../shared/services/toast-service';
import { emailValidator } from '../../shared/utils/validators';

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
    email: ['', [Validators.required, emailValidator]],
    clave: ['', [Validators.required]]
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  r: Router = inject(Router);
  toasts: ToastService = inject(ToastService);
  onLogin() {

    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.toasts.mostrarMensaje('Los datos ingresados no son válidos. Revisá los campos marcados.', true);
      return;
    }

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
