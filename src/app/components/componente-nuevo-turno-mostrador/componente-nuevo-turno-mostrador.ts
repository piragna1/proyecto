import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { TurnoService } from '../../turno/services/turno-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';
import { ToastService } from '../../shared/services/toast-service';
import { AuthService } from '../../auth/services/auth-service';
import { telefonoValidator } from '../../shared/utils/validators';

@Component({
  selector: 'app-componente-nuevo-turno-mostrador',
  imports: [ReactiveFormsModule, RouterLink],
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
    if (this.formulario.invalid) return;

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
}