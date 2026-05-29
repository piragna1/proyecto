import { Component } from '@angular/core';
import { FormularioPeluquero } from '../../components/formulario-peluquero/formulario-peluquero';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-peluquero',
  imports: [FormularioPeluquero, Footer],
  templateUrl: './pagina-peluquero.html',
  styleUrl: './pagina-peluquero.css',
})
export class PaginaPeluquero { }
