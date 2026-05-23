import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../login/services/login-service';

@Component({
  selector: 'app-formulario-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-login.html',
  styleUrl: './formulario-login.css',
})
export class FormularioLogin {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]],
  });
  ls: LoginService = inject(LoginService);
  r: Router = inject(Router);
  iniciarSesion() {
    if (this.formulario.invalid) return;
    const { email, clave } = this.formulario.value;
    this.ls.login(email, clave).subscribe({
      next: (val) => {
        console.log('usuario logueado:', val);
        localStorage.setItem('usuario', JSON.stringify(val.usuario));
        this.r.navigateByUrl('/home');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
