import { Component } from '@angular/core';
import { NavbarInicial } from '../../components/navbar-inicial/navbar-inicial';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-inicial',
  imports: [NavbarInicial, Footer],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css',
})
export class PaginaInicial { }
