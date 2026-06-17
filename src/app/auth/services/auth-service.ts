import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  estoyLogeado: boolean = false;
  constructor() { }
  logIn() {
    this.estoyLogeado = true;
  }
  logOut() {
    this.estoyLogeado = false;
  }
  
    obtenerPayload(){
      const token = localStorage.getItem('token');
      if(!token)return null;
      try {
        return jwtDecode<any>(token);
      } catch (error) {
        return null;
      }
    };
  
    obtenerRolUsuario(){
      const payload=this.obtenerPayload();
      return payload?.rol || null;
    };
  
    esTokenValido(){
      const payload = this.obtenerPayload();

      console.log('payload', payload);
      

      if (!payload?.exp) return false;
      return Date.now() < payload.exp * 1000;
    };

    esSuperAdmin(){
      const payload = this.obtenerPayload();
      return payload?.superadmin === 1;
    };
}
