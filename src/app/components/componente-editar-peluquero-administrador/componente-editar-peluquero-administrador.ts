import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';

@Component({
  selector: 'app-componente-editar-peluquero-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-editar-peluquero-administrador.html',
  styleUrl: './componente-editar-peluquero-administrador.css',
})
export class ComponenteEditarPeluqueroAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: [''],
    direccion: ['', [Validators.required, Validators.minLength(8)]]
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  us: UsuarioService = inject(UsuarioService);
  id: string | null = null;
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        this.getPeluqueroById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
  editarPeluquero() {
    if (this.formulario.invalid) return;
    const u: Usuario = {
      nombre: this.formulario.controls.nombre.value,
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      direccion: this.formulario.controls.direccion.value,
      rol: 'peluquero',
      superadmin: false
    };
    this.us.putUsuario(u, this.id).subscribe({
      next: (value) => {
        console.log('usuario puteado:', value);
        this.r.navigateByUrl('/peluqueros-admin');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getPeluqueroById(id: string | null) {
    this.us.getUsuarioById(id).subscribe({
      next: (value) => {
        console.log('value', value);
        this.formulario.controls.nombre.setValue(value.nombre);
        this.formulario.controls.email.setValue(value.email);
        this.formulario.controls.telefono.setValue(value.telefono);
        this.formulario.controls.direccion.setValue(value.direccion!);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
