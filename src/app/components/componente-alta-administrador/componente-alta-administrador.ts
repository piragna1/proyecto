import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from "@angular/router";
import { Usuario } from '../../usuario/interface/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ToastService } from '../../shared/services/toast-service';
import {
  emailValidator,
  telefonoValidator,
  passwordValidator,
  mensajeCampo as mensajeCampoDe,
  MAX_LENGTH_CLAVE,
} from '../../shared/utils/validators';

type CampoAltaAdministrador = 'email' | 'telefono' | 'clave';

@Component({
  selector: 'app-componente-alta-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-alta-administrador.html',
  styleUrl: './componente-alta-administrador.css',
})
export class ComponenteAltaAdministrador {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator]],
    telefono: ['', [Validators.required, telefonoValidator]],
    clave: ['', [Validators.required, passwordValidator, Validators.maxLength(MAX_LENGTH_CLAVE)]]
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  toasts: ToastService = inject(ToastService);
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  generarAdministrador() {
    this.enviado.set(true);
    if (this.formulario.invalid) {
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
      return;
    }
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
        this.r.navigateByUrl('/administradores-admin');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  hayError(campo: CampoAltaAdministrador): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: CampoAltaAdministrador): string {
    return mensajeCampoDe(this.formulario.controls[campo], campo);
  }
}
