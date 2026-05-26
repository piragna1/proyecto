export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  clave: string;
  rol: string;
  superadmin: boolean;
  direccion?: string;
}
