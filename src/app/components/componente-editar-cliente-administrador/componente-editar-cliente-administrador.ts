import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';

@Component({
  selector: 'app-componente-editar-cliente-administrador',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './componente-editar-cliente-administrador.html',
  styleUrl: './componente-editar-cliente-administrador.css',
})
export class ComponenteEditarClienteAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: [''],
    rol: ['cliente'],
    superadmin: [false],
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        this.getUsuarioById(this.id);
      }
      ,
      error: (err) => {
        console.log(err);
      }
    })
  }
  getUsuarioById(id: string | null) {
    this.us.getUsuarioById(id).subscribe({
      next: (value) => {
        this.formulario.controls.nombre.setValue(value.nombre);
        this.formulario.controls.email.setValue(value.email);
        this.formulario.controls.telefono.setValue(value.telefono);
      },
      error: (err) => {
        console.log(err);
      }
    })
  };
  editarUsuario() {
    if (this.formulario.invalid) {
      console.log('formulario invalido');
      return;
    }
    const u: Usuario = {
      nombre: this.formulario.controls.nombre.value,
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      rol: this.formulario.controls.rol.value,
      superadmin: this.formulario.controls.superadmin.value
    }
    this.us.putUsuario(u, this.id).subscribe({
      next: (value) => {
        console.log('usuario puteado:', value);
        this.us.limpiarUserSignal();
        this.r.navigateByUrl('/clientes-admin');
      }
    });
  };
};
