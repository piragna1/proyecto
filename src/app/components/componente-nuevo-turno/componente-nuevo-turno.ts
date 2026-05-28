import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { Turno } from '../../turno/interface/turno.interface';
import { Usuario } from '../../usuario/interface/usuario.interface';
import { TurnoService } from '../../turno/services/turno-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';

@Component({
  selector: 'app-componente-nuevo-turno',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-nuevo-turno.html',
  styleUrl: './componente-nuevo-turno.css',
})
export class ComponenteNuevoTurno implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    servicio: [null, [Validators.required]],
    fechaHoraInicio: ['', [Validators.required]],
  });
  ts: TurnoService = inject(TurnoService);
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ss.getServicios().subscribe({
      next: (servicios) => {
        console.log(servicios);
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
    console.log(this.formulario.invalid);

    if (this.formulario.invalid) return;
    const servicio: Servicio = this.formulario.controls.servicio.value!;
    console.log('servicio:', servicio);
    const usuarioRaw = localStorage.getItem('usuario');
    const usuario: Usuario | null = usuarioRaw ? JSON.parse(usuarioRaw) : null;
    //No permitir a usuarios que no sean clientes sacar turno.
    if (usuario?.rol !== 'cliente') return;
    const fechaHoraInicioRaw = this.formulario.controls.fechaHoraInicio.value;
    const fechaHoraInicioDate = new Date(fechaHoraInicioRaw);
    const fechaHoraFinDate = new Date(
      fechaHoraInicioDate.getTime() + servicio.duracionMinutos * 60000,
    );
    const inicio = formatearFechaSQL(fechaHoraInicioDate);
    const fin = formatearFechaSQL(fechaHoraFinDate);
    const t: Turno = {
      fechaHoraInicio: inicio,
      fechaHoraFin: fin,
      usuario,
      servicio
    };
    console.log(t);
    this.ts.postTurno(t).subscribe({
      next: (turno) => {
        console.log(turno);
        this.r.navigateByUrl('/mis-turnos');
      },
      error: (e) => {
        console.log(e);
      },
    });
  };
}
