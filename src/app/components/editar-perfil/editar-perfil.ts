import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-editar-perfil',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css',
})
export class EditarPerfil implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['', []],
    rol: ['cliente'],
    superadmin: [false],
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  us: UsuarioService = inject(UsuarioService);
  r:Router = inject(Router);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        console.log(value.get('id'));
        this.id = value.get('id');
        this.getUsuarioById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  };
  actualizarUsuario() {
    if (this.formulario.invalid) return;

    this.us.putUsuario(this.formulario.getRawValue(), this.id).subscribe({
      next: (u) => {
        console.log('usuario actualizado:', u);
        this.r.navigateByUrl('/home');
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
  getUsuarioById(id: string | null) {
    this.us.getUsuarioById(id).subscribe(
      {
        next: (u) => {
          console.log('usuario::');
          this.formulario.controls.nombre.setValue(u.nombre);
          this.formulario.controls.email.setValue(u.email);
          this.formulario.controls.telefono.setValue(u.telefono);
          console.log(u);
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  };
};
