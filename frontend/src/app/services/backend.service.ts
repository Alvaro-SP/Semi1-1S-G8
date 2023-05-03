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

  traducir(cuerpo: any) {
    return this.http.post(`${this.URL}/traducir`, cuerpo);
  }

  obtenerUsuario2(usuario: any) {
    return this.http.get(`${this.URL}/obtenerUsuario2/${usuario}`);
  }
  
  editarPerfil(cuerpo:any){
    return this.http.put(`${this.URL}/actualizarPerfil`,cuerpo);
  }
  
  addfriend(usuario:any){
    return this.http.post(`${this.URL}/addfriend`, usuario);
  }

  getfriends(usuario:any){
    return this.http.get(`${this.URL}/getfriends/${usuario}`);
  }

  getallusers(usuario:any){
    return this.http.get(`${this.URL}/getallusers/${usuario}`);
  }

  aceptarAmigo(cuerpo:any){
    return this.http.post(`${this.URL}/aceptarAmigo`,cuerpo);
  }

  sendmessageBot(cuerpo:any){
    return this.http.post(`${this.URL}/sendmessageBot`,cuerpo);
  }

  getsolicitudes(usuario:any){
    return this.http.get(`${this.URL}/getsolicitudes/${usuario}`);
  }
}