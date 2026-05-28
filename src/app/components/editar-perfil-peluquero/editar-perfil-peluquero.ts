import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';

@Component({
  selector: 'app-editar-perfil-peluquero',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './editar-perfil-peluquero.html',
  styleUrl: './editar-perfil-peluquero.css',
})
export class EditarPerfilPeluquero implements OnInit {
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
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        this.getPeluqueroById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getPeluqueroById(id: string | null) {
    this.us.getUsuarioById(id).subscribe(
      {
        next: (val) => {
          console.log('usuario por id:', val);
          this.formulario.controls.nombre.setValue(val.nombre);
          this.formulario.controls.email.setValue(val.email);
          this.formulario.controls.telefono.setValue(val.telefono);
          this.formulario.controls.direccion.setValue(val.direccion!);
        }, error: (err) => {
          console.log(err);
        }
      }
    );
  };

  editarPeluquero() {
    if (this.formulario.invalid) return;
    const p: Usuario = {
      ...this.formulario.getRawValue(),
      rol: 'peluquero',
      superadmin: false
    };
    this.us.putUsuario(p, this.id).subscribe({
      next: (value) => {
        console.log('Usuario editado', value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
