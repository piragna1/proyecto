import { Component } from '@angular/core';
import { FormularioAdmin } from '../../components/formulario-admin/formulario-admin';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-admin',
  imports: [FormularioAdmin, Footer],
  templateUrl: './pagina-admin.html',
  styleUrl: './pagina-admin.css',
})
export class PaginaAdmin { }
