import { Component } from '@angular/core';
import { FormularioAdmin } from '../../components/formulario-admin/formulario-admin';

@Component({
  selector: 'app-pagina-admin',
  imports: [FormularioAdmin],
  templateUrl: './pagina-admin.html',
  styleUrl: './pagina-admin.css',
})
export class PaginaAdmin { }
