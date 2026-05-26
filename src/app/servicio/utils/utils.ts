import { Servicio } from '../interface/servicio.interface';

export function formatearServicio(s: any): Servicio {
  const serv: Servicio = {
    id: s.id,
    tipo: s.tipo,
    duracionMinutos: s.duracion_minutos,
    precio: s.precio,
  };
  return serv;
}
