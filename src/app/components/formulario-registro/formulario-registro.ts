import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-formulario-registro',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.css',
})
export class FormularioRegistro {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['', [Validators.required]],
    rol: ['cliente'],
    superadmin: [false],
  });
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  generarUsuario() {
    if (this.formulario.invalid) return;

    this.us.postUsuario(this.formulario.getRawValue()).subscribe({
      next: (value) => {
        console.log('El usuario', value, ' ha sido generado.');
        this.us.setUserSignal(value);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.formulario.reset();
    this.r.navigateByUrl('/login');
  }
}
