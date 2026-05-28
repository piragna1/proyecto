import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-componente-alta-peluquero',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-alta-peluquero.html',
  styleUrl: './componente-alta-peluquero.css',
})
export class ComponenteAltaPeluquero {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required, Validators.minLength(8)]]
  });
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  constructor() { };
  generarPeluquero() {
    if (this.formulario.invalid) return;
    const p = this.formulario.getRawValue();
    const peluquero: Usuario = {
      nombre: p.nombre,
      email: p.email,
      telefono: p.telefono,
      clave: p.clave,
      rol: 'peluquero',
      superadmin: false,
      direccion: p.direccion
    };
    this.us.postUsuario(peluquero).subscribe({
      next: (p) => {
        console.log('peluquero generado:', p);
        this.r.navigateByUrl('/peluqueros-admin');
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.formulario.reset();
  };
}
