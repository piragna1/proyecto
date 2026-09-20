import { Servicio } from '../interface/servicio.interface';

export function formatearServicio(s: any): Servicio {
  const serv: Servicio = {
    id: s.id,
    tipo: s.tipo,
    precio: s.precio,
  };
  return serv;
}
