import { Component, computed, input } from '@angular/core';
import { evaluarRequisitosClave } from '../../utils/validators';

@Component({
  selector: 'app-requisitos-clave',
  imports: [],
  templateUrl: './requisitos-clave.html',
  styleUrl: './requisitos-clave.css',
})
export class RequisitosClave {
  valor = input<string>('');
  requisitos = computed(() => evaluarRequisitosClave(this.valor()));
}
