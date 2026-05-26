import { Servicio } from '../../servicio/interface/servicio.interface';
import { Usuario } from '../../usuario/interface/usuario.interface';

export interface Turno {
  id?: string;
  usuario: Usuario | null;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  servicio: Servicio;
}
