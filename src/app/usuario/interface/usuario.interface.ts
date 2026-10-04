export interface Usuario {
  id?: string;
  nombre: string;
  // null solo para clientes de mostrador: el email se define al registrarse
  email: string | null;
  telefono: string;
  clave: string;
  rol: string;
  superadmin: boolean;
  direccion?: string;
  // MySQL devuelve tinyint(1) como 0/1: usar Boolean(x), nunca === true
  mostrador?: boolean | number;
}
