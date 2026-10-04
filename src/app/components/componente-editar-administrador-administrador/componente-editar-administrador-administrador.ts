import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
import { RequisitosClave } from '../../shared/components/requisitos-clave/requisitos-clave';

type CampoEditarAdministrador = 'email' | 'telefono' | 'clave';

@Component({
  selector: 'app-componente-editar-administrador-administrador',
  imports: [RouterLink, ReactiveFormsModule, RequisitosClave],
  templateUrl: './componente-editar-administrador-administrador.html',
  styleUrl: './componente-editar-administrador-administrador.css',
})
export class ComponenteEditarAdministradorAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator]],
    telefono: ['', [Validators.required, telefonoValidator]],
    clave: ['', [passwordValidator, Validators.maxLength(MAX_LENGTH_CLAVE)]]
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  claveValor = toSignal(this.formulario.controls.clave.valueChanges, { initialValue: '' });
  enviado = signal(false);
  toasts: ToastService = inject(ToastService);
  ar: ActivatedRoute = inject(ActivatedRoute);
  us: UsuarioService = inject(UsuarioService);
  id: string | null = null;
  adminActual: Usuario | null = null;
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
    this.enviado.set(true);
    if (this.formulario.invalid) {
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
      return;
    }
    const administrador = this.adminActual;
    if (!administrador) return;
    const a: Usuario = {
      nombre: administrador.nombre,
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: this.formulario.controls.clave.value,
      rol: administrador.rol,
      superadmin: !!administrador.superadmin
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
        this.adminActual = value;
        this.formulario.controls.email.setValue(value.email ?? '');
        this.formulario.controls.telefono.setValue(value.telefono);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  hayError(campo: CampoEditarAdministrador): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: CampoEditarAdministrador): string {
    return mensajeCampoDe(this.formulario.controls[campo], campo);
  }
}
