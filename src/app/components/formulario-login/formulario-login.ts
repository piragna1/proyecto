import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../login/services/login-service';
import { AuthService } from '../../auth/services/auth-service';
import { ToastService } from '../../shared/services/toast-service';
import { emailValidator } from '../../shared/utils/validators';

@Component({
  selector: 'app-formulario-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-login.html',
  styleUrl: './formulario-login.css',
})
export class FormularioLogin {
  fb: FormBuilder = inject(FormBuilder);
  as: AuthService = inject(AuthService);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator]],
    clave: ['', [Validators.required]],
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  ls: LoginService = inject(LoginService);
  r: Router = inject(Router);
  toasts: ToastService = inject(ToastService);
  /**
   * Metodo para iniciar sesion como cliente.
   * @returns void
   */
  iniciarSesion() {
    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.toasts.mostrarMensaje('Los datos ingresados no son válidos. Revisá los campos marcados.', true);
      return;
    }
    const { email, clave } = this.formulario.value;
    this.ls.login(email, clave).subscribe({
      next: (val) => {
        const token = val.token;
        localStorage.setItem('token', token);
        this.as.logIn();
        this.r.navigateByUrl('/home');
      },
      error: (e) => {
        console.log(e);
        this.toasts.mostrarMensaje(e.error?.mensaje || 'Error al iniciar sesión', true);
      },
    });
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
