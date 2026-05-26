import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Usuario } from '../../usuario/interface/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-alta-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-alta-administrador.html',
  styleUrl: './componente-alta-administrador.css',
})
export class ComponenteAltaAdministrador {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10)]],
    clave: ['', [Validators.required, Validators.minLength(8)]]
  });
  us: UsuarioService = inject(UsuarioService);
  generarAdministrador() {
    if (this.formulario.invalid) return;
    console.log(this.formulario.getRawValue());
    const a: Usuario = {
      nombre: 'administrador',
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      rol: 'administrador',
      superadmin: false
    };
    this.us.postUsuario(a).subscribe({
      next: (a) => {
        console.log('admin generado:', a);
        this.us.setAdministradoresSignal(a);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
