import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { emailValidator, telefonoValidator, passwordValidator, mensajeClave, MAX_LENGTH_CLAVE } from '../../shared/utils/validators';
import { RequisitosClave } from '../../shared/components/requisitos-clave/requisitos-clave';
import { mensajeDeError } from '../../shared/utils/errorMessages';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { InputComponent } from '../../shared/components/input/input';
import { ButtonComponent } from '../../shared/components/button/button';
import { LoginService } from '../../login/services/login-service';
import { AuthService } from '../../auth/services/auth-service';
import { ToastService } from '../../shared/services/toast-service';

@Component({
  selector: 'app-formulario-registro',
  imports: [ReactiveFormsModule, RequisitosClave, InputComponent, ButtonComponent],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.css',
})
export class FormularioRegistro {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, emailValidator, Validators.maxLength(255)]],
    telefono: ['', [Validators.required, telefonoValidator]],
    clave: ['', [Validators.required, passwordValidator, Validators.maxLength(MAX_LENGTH_CLAVE)]],
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  claveValor = toSignal(this.formulario.controls.clave.valueChanges, { initialValue: '' });
  enviado = signal(false);
  us: UsuarioService = inject(UsuarioService);
  ls: LoginService = inject(LoginService);
  as: AuthService = inject(AuthService);
  toasts: ToastService = inject(ToastService);
  r: Router = inject(Router);
  mensajeError = signal('');
  // En true mientras el formulario se funde antes de volver al login.
  saliendo = signal(false);
  
  generarUsuario() {
    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
      return;
    }
    this.enviado.set(true);
    this.mensajeError.set('');

    this.us.registrarUsuario(this.formulario.getRawValue()).subscribe({
      next: (value) => {
        console.log('El usuario', value, ' ha sido generado.');
        this.us.setUserSignal(value);
        const { email, clave } = this.formulario.getRawValue();
        this.ls.login(email, clave).subscribe({
          next: (val) => {
            localStorage.setItem('token', val.token);
            this.as.logIn();
            this.formulario.reset();
            this.r.navigateByUrl('/home');
            this.toasts.mostrarMensaje('Cuenta creada. Sesión iniciada.');
          },
          error: (err) => {
            console.log(err);
            this.formulario.reset();
            this.r.navigateByUrl('/login');
            this.toasts.mostrarMensaje('Cuenta creada. Iniciá sesión manualmente.', true);
          },
        });
      },
      error: (err) => {
        const mensaje = mensajeDeError(err, 'Error al registrar usuario');
        this.mensajeError.set(mensaje);
        this.toasts.mostrarMensaje(mensaje, true);
      },
    });

  }

  hayError(campo: 'nombre' | 'email' | 'telefono' | 'clave'): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  /**
   * Funde el formulario y despues vuelve al login. El retardo coincide con
   * la transicion CSS de salida (.saliendo form). Navega directo a '/'
   * para evitar la redireccion intermedia de '/login'.
   * @returns void
   */
  volverALogin() {
    if (this.saliendo()) return;
    this.saliendo.set(true);
    setTimeout(() => {
      this.r.navigateByUrl('/');
    }, 300);
  }

  mensajeCampo(campo: 'nombre' | 'email' | 'telefono' | 'clave'): string {
    const c = this.formulario.controls[campo];
    if (campo === 'clave') return mensajeClave(c);
    if (c.invalid && c.hasError('required')) return 'Este campo es requerido';
    if (c.invalid && c.hasError('email')) return 'El email no es válido';
    if (c.invalid && c.hasError('telefono')) return 'El teléfono debe ser un número de Argentina (ej. +549223XXXXXXX o 223XXXXXXX)';
    if (c.invalid && c.hasError('minlength')) {
      const requeridos = c.getError('minlength')?.requiredLength as number | undefined;
      return `Debe tener al menos ${requeridos ?? 0} caracteres`;
    }
    if (c.invalid && c.hasError('maxlength')) {
      const maximos = c.getError('maxlength')?.requiredLength as number | undefined;
      return `Debe tener como máximo ${maximos ?? 0} caracteres`;
    }
    return '';
  }
}
