import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Usuario } from '../../usuario/interface/usuario.interface';
import { ToastService } from '../../shared/services/toast-service';
import {
  emailValidator,
  telefonoValidator,
  passwordValidator,
  mensajeCampo as mensajeCampoDe,
  MAX_LENGTH_CLAVE,
} from '../../shared/utils/validators';

type CampoAltaPeluquero = 'nombre' | 'email' | 'telefono' | 'clave' | 'direccion';

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
    email: ['', [Validators.required, emailValidator]],
    telefono: ['', [Validators.required, telefonoValidator]],
    clave: ['', [Validators.required, passwordValidator, Validators.maxLength(MAX_LENGTH_CLAVE)]],
    direccion: ['', [Validators.required, Validators.minLength(8)]]
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  toasts: ToastService = inject(ToastService);
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  constructor() { };
  generarPeluquero() {
    this.enviado.set(true);
    if (this.formulario.invalid) {
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
      return;
    }
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
  };

  hayError(campo: CampoAltaPeluquero): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: CampoAltaPeluquero): string {
    return mensajeCampoDe(this.formulario.controls[campo], campo);
  }
}
