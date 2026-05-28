import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Usuario } from '../../usuario/interface/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-editar-perfil-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './editar-perfil-administrador.html',
  styleUrl: './editar-perfil-administrador.css',
})
export class EditarPerfilAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['']
  });
  us: UsuarioService = inject(UsuarioService);
  id: string | null = null;
  ar: ActivatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        console.log('value:', value.get('id'));
        this.id = value.get('id');
        this.obtenerAdminPorId(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  };

  obtenerAdminPorId(id: string | null) {
    this.us.getUsuarioById(id).subscribe({
      next: (value) => {
        console.log('admin obtenido:', value);
        this.formulario.controls.email.setValue(value.email);
        this.formulario.controls.telefono.setValue(value.telefono);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  editarPerfil() {
    if (this.formulario.invalid) return;
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) return;
    const usuario = JSON.parse(usuarioData);
    const a: Usuario = {
      nombre: usuario.nombre,
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      rol: usuario.rol,
      superadmin: usuario.superadmin
    };
    this.us.putUsuario(a, this.id).subscribe({
      next: (value) => {
        console.log('admin actualizado:', value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
