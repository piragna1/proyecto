import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { TurnoService } from '../../turno/services/turno-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';
import { ToastService } from '../../shared/services/toast-service';
import { AuthService } from '../../auth/services/auth-service';
import { telefonoValidator } from '../../shared/utils/validators';
import { AvisoCambiosSinGuardar } from '../../shared/components/aviso-cambios-sin-guardar/aviso-cambios-sin-guardar';

@Component({
  selector: 'app-componente-nuevo-turno-mostrador',
  imports: [ReactiveFormsModule, AvisoCambiosSinGuardar],
  templateUrl: './componente-nuevo-turno-mostrador.html',
  styleUrl: './componente-nuevo-turno-mostrador.css',
})
export class ComponenteNuevoTurnoMostrador implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    servicio: [null as Servicio | null, [Validators.required]],
    fechaHoraInicio: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    telefono: ['', [Validators.required, telefonoValidator]],
  });
  ts: TurnoService = inject(TurnoService);
  toasts: ToastService = inject(ToastService);
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  destinoVolver = this.as.obtenerRolUsuario() === 'administrador' ? '/home-admin' : '/home-peluquero';
  enviado = signal(false);
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  /**
   * Estado inicial del formulario en formato JSON. Al tocar "Volver" se compara con
   * el valor actual para saber si hay cambios sin guardar.
   */
  snapshot = JSON.stringify(this.formulario.value);
  /**
   * Dinámica de ruteo diferente al resto de la app: el "Volver" ya no usa [routerLink].
   * Acá se intercepta el clic para avisar al usuario si hay cambios sin guardar antes de salir.
   */
  alertaSalida = signal(false);
  rutaPendiente = '';
  mensajeAlerta = 'Se perderán los cambios realizados y el turno no será creado.';
  /**
   * Intercepta el clic del "Volver". Si el formulario cambió respecto del estado inicial,
   * cancela la navegación y muestra el aviso; si no, navega directo a la ruta pedida.
   * @param evento el evento de clic del enlace
   * @param ruta destino al que se quería volver
   */
  intentarSalir(evento: Event, ruta: string) {
    if (JSON.stringify(this.formulario.value) !== this.snapshot) {
      evento.preventDefault();
      this.rutaPendiente = ruta;
      this.alertaSalida.set(true);
      return;
    }
    this.r.navigateByUrl(ruta);
  }
  /**
   * El usuario confirmó que quiere descartar los cambios: cierra el aviso y navega.
   * La navegación se retrasa hasta que termine la animación de salida del aviso
   * (150ms), ya que si ocurre en el mismo tick el componente se destruye y la animación no se ve.
   */
  confirmarSalida() {
    this.alertaSalida.set(false);
    setTimeout(() => this.r.navigateByUrl(this.rutaPendiente), 180);
  }
  /**
   * El usuario decidió quedarse editando: solo cierra el aviso.
   */
  cancelarSalida() {
    this.alertaSalida.set(false);
  }
  ngOnInit(): void {
    this.ss.limpiarServiciosSignal();
    this.ss.getServicios().subscribe({
      next: (servicios) => {
        servicios.forEach((servicio) => {
          this.ss.setServiciosSignal(formatearServicio(servicio));
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  generarTurno() {
    if (this.formulario.invalid) {
      this.enviado.set(true);
      const faltantes: string[] = [];
      if (this.formulario.controls.servicio.invalid) faltantes.push('un servicio');
      if (this.formulario.controls.fechaHoraInicio.invalid) faltantes.push('un horario');
      if (this.formulario.controls.nombre.invalid) faltantes.push('el nombre del cliente');
      if (this.formulario.controls.telefono.invalid) faltantes.push('el teléfono');
      this.toasts.mostrarMensaje('Completá ' + faltantes.join(' y '), true);
      return;
    }

    const servicio: Servicio = this.formulario.controls.servicio.value!;
    const fechaHoraInicioRaw = this.formulario.controls.fechaHoraInicio.value;
    const fechaHoraInicioDate = new Date(fechaHoraInicioRaw);
    if (isNaN(fechaHoraInicioDate.getTime())) {
      this.toasts.mostrarMensaje('Ingresá un horario válido', true);
      return;
    }

    this.ts.postTurnoMostrador({
      idServicio: servicio.id,
      fechaHoraInicio: formatearFechaSQL(fechaHoraInicioDate),
      nombre: this.formulario.controls.nombre.value.trim(),
      telefono: this.formulario.controls.telefono.value.trim(),
    }).subscribe({
      next: () => {
        this.toasts.mostrarMensaje('Turno generado exitosamente.');
        const rol = this.as.obtenerRolUsuario();
        this.r.navigateByUrl(rol === 'administrador' ? '/turnos-admin' : '/turnos-peluquero');
      },
      error: (e) => {
        console.log(e);
        this.toasts.mostrarMensaje(e.error?.mensaje || 'Error al crear turno', true);
      },
    });
  }

  hayError(campo: 'servicio' | 'fechaHoraInicio' | 'nombre' | 'telefono'): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }

  mensajeCampo(campo: 'servicio' | 'fechaHoraInicio' | 'nombre' | 'telefono'): string {
    const c = this.formulario.controls[campo];
    if (c.invalid && c.hasError('required')) {
      switch (campo) {
        case 'servicio':
          return 'Seleccioná un servicio';
        case 'fechaHoraInicio':
          return 'Seleccioná un horario';
        case 'nombre':
          return 'Ingresá el nombre del cliente';
        case 'telefono':
          return 'Ingresá el teléfono del cliente';
      }
    }
    if (c.invalid && c.hasError('telefono')) return 'El teléfono no es válido';
    return '';
  }
}