import { Component, input, output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-confirmar-eliminacion',
  imports: [],
  templateUrl: './confirmar-eliminacion.html',
  styleUrl: './confirmar-eliminacion.css',
  animations: [
    trigger('fondo', [
      transition(':enter', [style({ opacity: 0 }), animate('150ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('aparecer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(4px)' })),
      ]),
    ]),
  ],
})
export class ConfirmarEliminacion {
  visible = input(false);
  titulo = input('Confirmar eliminación');
  mensaje = input('¿Eliminar este elemento? Esta acción no se puede deshacer.');
  nombreElemento = input('');

  confirmar = output<void>();
  cancelar = output<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }

  get mensajeCompleto(): string {
    const mensaje = this.mensaje();
    const nombre = this.nombreElemento();
    if (!nombre) return mensaje;
    const corte = mensaje.indexOf('?');
    if (corte === -1) return mensaje;
    return `${mensaje.slice(0, corte)} "${nombre}"${mensaje.slice(corte)}`;
  }
}