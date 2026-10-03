import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

type CampoEditarCliente = 'nombre' | 'email' | 'telefono' | 'clave';

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
    email: ['', [Validators.required, emailValidator]],
    telefono: ['', [Validators.required, telefonoValidator]],
    clave: ['', [passwordValidator, Validators.maxLength(MAX_LENGTH_CLAVE)]],
    rol: ['cliente'],
    superadmin: [false],
  });
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  toasts: ToastService = inject(ToastService);
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
    this.enviado.set(true);
    if (this.formulario.invalid) {
      this.toasts.mostrarMensaje('Completá correctamente los campos marcados en rojo.', true);
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

  hayError(campo: CampoEditarCliente): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: CampoEditarCliente): string {
    return mensajeCampoDe(this.formulario.controls[campo], campo);
  }
};
