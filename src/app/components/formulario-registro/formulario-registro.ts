import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['', [Validators.required, Validators.minLength(10)]],
  });
  us: UsuarioService = inject(UsuarioService);
  ls: LoginService = inject(LoginService);
  as: AuthService = inject(AuthService);
  toasts: ToastService = inject(ToastService);
  r: Router = inject(Router);
  mensajeError: string = '';
  
  generarUsuario() {
    if (this.formulario.invalid) return;
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
        
        this.cdr.markForCheck();
      },
    });

  }
}
