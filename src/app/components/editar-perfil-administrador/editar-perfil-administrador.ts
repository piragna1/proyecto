import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Usuario } from '../../usuario/interface/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ToastService } from '../../shared/services/toast-service';

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
  });
  formClave = this.fb.nonNullable.group({
    anterior: ['', [Validators.required]],
    nueva: ['', [Validators.required, Validators.minLength(10)]],
  });
  us: UsuarioService = inject(UsuarioService);
  toasts: ToastService = inject(ToastService);
  id: string | null = null;
  ar: ActivatedRoute = inject(ActivatedRoute);
  usuarioActual = signal<Usuario | null>(null);
  campoEditando = signal<string | null>(null);
  mostrandoCambioClave = signal<boolean>(false);
  errorClaveAnterior = signal<string | null>(null);
  procesandoClave = signal<boolean>(false);

  camposVisibles = computed(() => {
    const u = this.usuarioActual();
    if (!u) return [];
    return [
      { clave: 'nombre', etiqueta: 'Nombre', valor: u.nombre, editable: false },
      { clave: 'email', etiqueta: 'Email', valor: u.email, editable: true },
      { clave: 'telefono', etiqueta: 'Teléfono', valor: u.telefono, editable: true },
    ];
  });

  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
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
      next: (u) => {
        this.usuarioActual.set(u);
        this.formulario.patchValue({
          email: u.email,
          telefono: u.telefono,
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  editarCampo(campo: string) {
    if (this.mostrandoCambioClave()) this.cancelarCambioClave();
    if (this.campoEditando()) this.cancelarEdicion();
    this.campoEditando.set(campo);
  };

  cancelarEdicion() {
    const campo = this.campoEditando();
    const u = this.usuarioActual();
    if (campo && u) {
      this.formulario.controls[campo as keyof typeof this.formulario.controls].setValue(u[campo as keyof Usuario] as string);
    }
    this.campoEditando.set(null);
  };

  guardarEdicion() {
    const u = this.usuarioActual();
    if (!this.campoEditando() || !u) return;
    if (this.formulario.invalid) return;

    const payload: Usuario = {
      nombre: u.nombre,
      email: this.formulario.controls.email.value,
      telefono: this.formulario.controls.telefono.value,
      clave: '',
      rol: u.rol,
      superadmin: u.superadmin,
    };

    this.us.putUsuario(payload, this.id).subscribe({
      next: () => {
        this.usuarioActual.set({ ...u, email: payload.email, telefono: payload.telefono });
        this.campoEditando.set(null);
        this.toasts.mostrarMensaje('Perfil actualizado.');
      },
      error: (err) => {
        this.toasts.mostrarMensaje(err.error?.mensaje || 'No se pudo actualizar el perfil', true);
      }
    });
  };

  abrirCambioClave() {
    if (this.campoEditando()) this.cancelarEdicion();
    this.errorClaveAnterior.set(null);
    this.formClave.reset();
    this.mostrandoCambioClave.set(true);
  };

  cancelarCambioClave() {
    this.formClave.reset();
    this.errorClaveAnterior.set(null);
    this.procesandoClave.set(false);
    this.mostrandoCambioClave.set(false);
  };

  toggleCambioClave() {
    if (this.mostrandoCambioClave()) {
      this.cancelarCambioClave();
    } else {
      this.abrirCambioClave();
    }
  };

  guardarClave() {
    if (this.formClave.invalid) return;
    this.procesandoClave.set(true);
    this.errorClaveAnterior.set(null);
    this.us.cambiarClave(this.id, this.formClave.controls.anterior.value, this.formClave.controls.nueva.value).subscribe({
      next: () => {
        this.toasts.mostrarMensaje('Clave actualizada.');
        this.procesandoClave.set(false);
        this.cancelarCambioClave();
      },
      error: (err) => {
        this.procesandoClave.set(false);
        if (err.status === 401) {
          this.errorClaveAnterior.set('La clave anterior es incorrecta');
        } else if (err.error?.errores) {
          this.toasts.mostrarMensaje(err.error.errores.join(', '), true);
        } else {
          this.toasts.mostrarMensaje(err.error?.mensaje || 'No se pudo cambiar la clave', true);
        }
      }
    });
  };
};