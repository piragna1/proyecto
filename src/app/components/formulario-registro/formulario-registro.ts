import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { emailValidator } from '../../shared/utils/validators';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { LoginService } from '../../login/services/login-service';
import { AuthService } from '../../auth/services/auth-service';
import { ToastService } from '../../shared/services/toast-service';

@Component({
  selector: 'app-formulario-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.css',
})
export class FormularioRegistro {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, emailValidator, Validators.maxLength(255)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
    clave: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  us: UsuarioService = inject(UsuarioService);
  ls: LoginService = inject(LoginService);
  as: AuthService = inject(AuthService);
  toasts: ToastService = inject(ToastService);
  r: Router = inject(Router);
  mensajeError: string = '';
  
  generarUsuario() {
    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
      return;
    }
    this.enviado.set(true);
    this.mensajeError = '';

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
        
        this.mensajeError = err.error?.mensaje || 'Error al registrar usuario';
      },
    });

  }

  hayError(campo: 'nombre' | 'email' | 'telefono' | 'clave'): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: 'nombre' | 'email' | 'telefono' | 'clave'): string {
    const c = this.formulario.controls[campo];
    if (c.invalid && c.hasError('required')) return 'Este campo es requerido';
    if (c.invalid && c.hasError('email')) return 'El email no es válido';
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
