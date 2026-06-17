import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ServicioService } from '../../servicio/services/servicio-service';
import { Turno } from '../../turno/interface/turno.interface';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { TurnoService } from '../../turno/services/turno-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';
import { ToastService } from '../../shared/services/toast-service';
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-modificar-turno-usuario',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-modificar-turno-usuario.html',
  styleUrl: './componente-modificar-turno-usuario.css',
})
export class ComponenteModificarTurnoUsuario implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    servicio: [null as Servicio | null, [Validators.required]],
    fechaHoraInicio: ['', [Validators.required]],
  });
  ts: TurnoService = inject(TurnoService);
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  r: Router = inject(Router);
  toastService: ToastService = inject(ToastService);
  as:AuthService= inject(AuthService);
  us:UsuarioService=inject(UsuarioService);
  ngOnInit(): void {

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
        console.log(this.id);
        this.getTurnoById(this.id);
      }, error: (err) => {
        console.log(err);
      }
    })
  }
  modificarTurno() {
    if (this.formulario.invalid) return;
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.us.getUsuarioById(payload.id).subscribe({
      next:(value)=>{
        const servicio: Servicio = this.formulario.controls.servicio.value!;
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
          usuario: value,
          servicio
        };
        this.ts.putTurno(t, this.id).subscribe({
          next: (value) => {
            console.log('turno puteado', value);
            this.ts.limpiarTurnosSignal();
            this.r.navigateByUrl('/mis-turnos');
            this.toastService.mostrarMensaje('Turno modificado correctamente.');
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error:(err)=>{
        console.log(err);
      }
    })
   
  };

  getTurnoById(id: string | null) {
    this.ts.getTurnoById(id).subscribe({
      next: (value: any) => {
        console.log('value', value);
        this.ss.getServicioById(value.id_servicio).subscribe({
          next: (serv) => {
            console.log(serv);
            
            const fecha = new Date(value.fecha_hora_inicio);
            const fechaLocal = new Date(
              fecha.getTime() - fecha.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16);

            this.formulario.controls.fechaHoraInicio.setValue(fechaLocal);
            this.formulario.controls.servicio.setValue(serv);
          }, error: (err) => {
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
