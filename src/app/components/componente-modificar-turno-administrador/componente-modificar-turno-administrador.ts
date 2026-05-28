import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ServicioService } from '../../servicio/services/servicio-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { TurnoService } from '../../turno/services/turno-service';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Turno } from '../../turno/interface/turno.interface';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';

@Component({
  selector: 'app-componente-modificar-turno-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-modificar-turno-administrador.html',
  styleUrl: './componente-modificar-turno-administrador.css',
})
export class ComponenteModificarTurnoAdministrador implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    servicio: [null as Servicio | null, [Validators.required]],
    fechaHoraInicio: ['', [Validators.required]],
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  ts: TurnoService = inject(TurnoService);
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ss.limpiarServiciosSignal();
    this.ss.getServicios().subscribe({
      next: (value) => {
        value.forEach((servicio) => {
          this.ss.setServiciosSignal(formatearServicio(servicio));
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        this.getTurnoById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  modificarTurno() {
    if (this.formulario.invalid) return;
    this.ts.getTurnoById(this.id).subscribe({
      next: (value: any) => {
        this.us.getUsuarioById(value.id_usuario).subscribe({
          next: (usuario) => {
            console.log('usuario obtenido:', usuario);
            const u = usuario;
            const servicio = this.formulario.controls.servicio.value!;
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
              usuario: u,
              servicio
            };
            console.log('turno armado:', t);
            this.ts.putTurno(t, this.id).subscribe({
              next: (turnoPuteado) => {
                console.log('turno puteado', turnoPuteado);
                this.ts.limpiarTurnosSignal();
                this.r.navigateByUrl('/turnos-admin');
              }
            })
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getTurnoById(id: string | null) {
    this.ts.getTurnoById(id).subscribe({
      next: (value: any) => {
        this.ss.getServicioById(value.id_servicio).subscribe({
          next: (serv) => {
            const fecha = new Date(value.fecha_hora_inicio);
            const fechaLocal = new Date(
              fecha.getTime() - fecha.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16);
            this.formulario.controls.fechaHoraInicio.setValue(fechaLocal);
          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
