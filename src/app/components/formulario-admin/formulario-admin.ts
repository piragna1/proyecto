import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../login/services/login-service';
import { Router, RouterLink } from "@angular/router";

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
  onLogin() {
    console.log('aaa');

    if (this.formulario.invalid) return;
    console.log('bbb');

    const { email, clave } = this.formulario.value;
    this.ls.loginAdmin(email, clave).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        if (response.rol !== 'administrador') {
          console.log('Usuario no es administrador:', response);
          return;
        };
        localStorage.setItem('usuario', JSON.stringify(response));
        this.as.logIn();
        this.r.navigateByUrl('/home-admin');
      },
      error: (err) => {
        console.log('Error en login:', err);
      }
    })
  }
}
