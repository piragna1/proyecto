import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';

@Component({
  selector: 'app-componente-editar-administrador-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-editar-administrador-administrador.html',
  styleUrl: './componente-editar-administrador-administrador.css',
})
export class ComponenteEditarAdministradorAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['']
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  us: UsuarioService = inject(UsuarioService);
  id: string | null = null;
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        this.getAdminById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  };
  editarAdministrador() {
    if (this.formulario.invalid) return;
    const a: Usuario = {
      nombre: 'Super Admin',
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      rol: 'administrador',
      superadmin: true
    };
    this.us.putUsuario(a, this.id).subscribe({
      next: (value) => {
        console.log('admin puteado:', value);
        this.us.limpiarAdminsSignal();
        this.r.navigateByUrl('/administradores-admin');
      },
      error: (err) => {
        console.log(err);
      }
    })
  };
  getAdminById(id: string | null) {
    this.us.getUsuarioById(id).subscribe({
      next: (value) => {
        console.log('admin encontrado:', value);
        this.formulario.controls.email.setValue(value.email);
        this.formulario.controls.telefono.setValue(value.telefono);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
