//notificacion.interface.ts
export interface Notificacion {
  id?: string;
  tipo: string;
  motivo?: string | null;
  telefono?: string | null;
  mensaje: string;
  estado: string;
  fecha_envio?: string | null;
  usuario_nombre: string;
}