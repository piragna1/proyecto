import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = 'http://localhost:3000/login';
  constructor(private http: HttpClient) { }
  login(email: string | undefined, clave: string | undefined): Observable<any> {
    return this.http.post(this.apiUrl, { email, clave });
  }
  loginAdmin(email: string | undefined, clave: string | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin`, { email, clave });
  }
}
