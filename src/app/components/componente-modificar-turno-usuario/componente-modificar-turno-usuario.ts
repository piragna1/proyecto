import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { ServicioService } from '../../servicio/services/servicio-service';
import { Turno } from '../../turno/interface/turno.interface';
import { Servicio } from '../../servicio/interface/servicio.interface';
import { TurnoService } from '../../turno/services/turno-service';
import { formatearServicio } from '../../servicio/utils/utils';
import { formatearFechaSQL } from '../../shared/utils/dateHelpers';
import { ToastService } from '../../shared/services/toast-service';
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { horarioValidator, HORARIO_MINIMO, HORARIO_MAXIMO, MENSAJE_HORARIO_FUERA_DE_RANGO } from '../../shared/utils/validators';
import { AvisoCambiosSinGuardar } from '../../shared/components/aviso-cambios-sin-guardar/aviso-cambios-sin-guardar';

@Component({
  selector: 'app-componente-modificar-turno-usuario',
  imports: [ReactiveFormsModule, AvisoCambiosSinGuardar],
  templateUrl: './componente-modificar-turno-usuario.html',
  styleUrl: './componente-modificar-turno-usuario.css',
})
export class ComponenteModificarTurnoUsuario implements OnInit {
  /** Ayuda visible junto al input: el rango sale de los mismos constantes que usa el validator. */
  readonly rangoHorario = `Turnos disponibles de ${HORARIO_MINIMO} a ${HORARIO_MAXIMO}.`;
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    servicio: [null as Servicio | null, [Validators.required]],
    fechaHoraInicio: ['', [Validators.required, horarioValidator]],
  });
  ts: TurnoService = inject(TurnoService);
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  r: Router = inject(Router);
  toastService: ToastService = inject(ToastService);
  as:AuthService= inject(AuthService);
  us:UsuarioService=inject(UsuarioService);
  formVersion = toSignal(this.formulario.valueChanges, { initialValue: null });
  enviado = signal(false);
  servicioOriginal: Servicio | null = null;
  fechaOriginal = '';
  /**
   * Marca los errores en línea recién después de intentar guardar, para no
   * molestar al usuario que todavía está completando el formulario.
   */
  hayError(campo: 'servicio' | 'fechaHoraInicio'): boolean {
    this.formVersion();
    return this.enviado() && this.formulario.controls[campo].invalid;
  }
  /**
   * Mensaje mostrado bajo el campo inválido.
   */
  mensajeCampo(campo: 'servicio' | 'fechaHoraInicio'): string {
    const control = this.formulario.controls[campo];
    if (control.invalid && control.hasError('required')) {
      return campo === 'servicio' ? 'Seleccioná un servicio' : 'Seleccioná un horario';
    }
    if (control.invalid && control.hasError('horarioFueraDeRango')) return MENSAJE_HORARIO_FUERA_DE_RANGO;
    return '';
  }
  /**
   * Considera que hay una modificación real si cambió el servicio o la fecha/hora
   * respecto del estado original del turno.
   */
  hayModificaciones(): boolean {
    return this.formulario.controls.servicio.value?.id !== this.servicioOriginal?.id ||
      this.formulario.controls.fechaHoraInicio.value !== this.fechaOriginal;
  }
  /**
   * Permite enviar la edición únicamente cuando el formulario es válido y el turno cambió.
   * El botón "Guardar" queda deshabilitado en caso contrario.
   */
  puedeEnviar(): boolean {
    this.formVersion();
    return this.formulario.valid && this.hayModificaciones();
  }
  /**
   * Dinámica de ruteo diferente al resto de la app: el "Volver" ya no usa [routerLink].
   * Acá se intercepta el clic para avisar al usuario si hay cambios sin guardar antes de salir.
   */
  alertaSalida = signal(false);
  rutaPendiente = '';
  mensajeAlerta = 'Se perderán los cambios realizados y el turno no será modificado.';
  snapshot = '';
  /**
   * Compara el valor actual del formulario contra el estado inicial (tomado después de
   * precargar el turno) para saber si hay cambios sin guardar.
   */
  hayCambiosSinGuardar(): boolean {
    return JSON.stringify(this.formulario.value) !== this.snapshot;
  }
  /**
   * Intercepta el clic del "Volver". Si el formulario cambió respecto del estado inicial,
   * cancela la navegación y muestra el aviso; si no, navega directo a la ruta pedida.
   * @param evento el evento de clic del enlace
   * @param ruta destino al que se quería volver
   */
  intentarSalir(evento: Event, ruta: string) {
    if (this.hayCambiosSinGuardar()) {
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
  compararServicios(a: Servicio | null, b: Servicio | null) {
    return a?.id === b?.id;
  }

  modificarTurno() {
    if (!this.hayModificaciones()) {
      this.toastService.mostrarMensaje('No hay modificaciones para guardar', true);
      return;
    }
    if (this.formulario.invalid) {
      this.enviado.set(true);
      // Antes este caso se iba en silencio: con la franja horaria el formulario
      // puede quedar inválido con todos los campos completos, y el botón no
      // hacía nada sin explicar por qué.
      this.toastService.mostrarMensaje(
        this.formulario.controls.fechaHoraInicio.hasError('horarioFueraDeRango')
          ? MENSAJE_HORARIO_FUERA_DE_RANGO
          : 'Revisá los datos del turno',
        true
      );
      return;
    }
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.us.getUsuarioById(payload.id).subscribe({
      next:(value)=>{
        const servicio: Servicio = this.formulario.controls.servicio.value!;
        const fechaHoraInicioRaw = this.formulario.controls.fechaHoraInicio.value;
        const fechaHoraInicioDate = new Date(fechaHoraInicioRaw);
        if (isNaN(fechaHoraInicioDate.getTime())) {
            this.toastService.mostrarMensaje('Ingresá un horario válido', true);
            return;
        }
        const inicio = formatearFechaSQL(fechaHoraInicioDate);
        const t: Turno = {
          fechaHoraInicio: inicio,
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
          error: (e) => {
            console.log(e);
            this.toastService.mostrarMensaje(e.error?.mensaje || 'No se pudo modificar el turno', true);
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
            this.servicioOriginal = serv;
            this.fechaOriginal = this.formulario.controls.fechaHoraInicio.value;
            this.snapshot = JSON.stringify(this.formulario.value);
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
