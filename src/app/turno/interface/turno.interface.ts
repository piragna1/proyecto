import { Servicio } from '../../servicio/interface/servicio.interface';
import { Usuario } from '../../usuario/interface/usuario.interface';

export interface Turno {
  id?: string;
  usuario: Usuario | null;
  fechaHoraInicio: string;
  fechaHoraInicioRaw?: string;
  servicio: Servicio;
  motivo?: string;
  pagado?: boolean;
  monto?: number;
}
