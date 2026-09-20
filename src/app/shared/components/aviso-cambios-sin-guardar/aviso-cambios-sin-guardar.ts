import { Component, input, output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-aviso-cambios-sin-guardar',
  imports: [],
  templateUrl: './aviso-cambios-sin-guardar.html',
  styleUrl: './aviso-cambios-sin-guardar.css',
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
export class AvisoCambiosSinGuardar {
  visible = input(false);
  mensaje = input('Se perderán los cambios realizados.');
  continuar = output();
  quedarse = output();
}