import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  URL: string = "http://localhost:4000"

  Login(cuerpo: any) {
    return this.http.post(`${this.URL}/login`, cuerpo);
  }

  Registro(cuerpo: any) {
    return this.http.post(`${this.URL}/registro`, cuerpo);
  }

  crearPublicacion(cuerpo: any) {
    return this.http.post(`${this.URL}/crearPublicacion`, cuerpo);
  }

  obtenerUsuario(usuario: any) {
    return this.http.get(`${this.URL}/obtenerUsuario/${usuario}`);
  }

  obtenerPublicaciones(usuario: any) {
    return this.http.get(`${this.URL}/obtenerPublicaciones/${usuario}`);
  }

  crearComentario(cuerpo: any) {
    return this.http.post(`${this.URL}/crearComentario`, cuerpo);
  }

  obtenerComentarios(id: any) {
    return this.http.get(`${this.URL}/obtenerComentarios/${id}`);
  }
}
