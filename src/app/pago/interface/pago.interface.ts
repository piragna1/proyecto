export interface Pago {
  id?: string;
  id_turno?: string | null;
  id_usuario?: string | null;
  monto: number;
  metodo: 'efectivo' | 'transferencia';
  fecha_pago?: string;
  nombre_cliente?: string;
  servicio_tipo?: string;
  horario_turno?: string;
}

export interface PagosResponse {
  pagos: Pago[];
  total: number;
}