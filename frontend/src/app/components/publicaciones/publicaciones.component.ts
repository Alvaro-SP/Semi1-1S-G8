import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  imageSelected?: Blob
  @ViewChild('ImageInput', { static: false }) ImageInput!: ElementRef;

  publicacion = {
    descripcion: "",
    foto: "",
    usuario: ""
  }

  pic = "";

  usuario=""

  perfil = {
    nombre_completo: "",
    foto:""
  }

  publicaciones : any = [];

  constructor(private backend: BackendService, private router: Router) {
    if (sessionStorage.getItem("usuario") == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Inicie sesion para entrar a su perfil!',
      })
      this.router.navigate([''])
    }else{
      this.getUser(sessionStorage.getItem("usuario"))
      this.obtenerUsuario();
      this.obtenerPublicaciones();
    }
  }

  ngOnInit(): void {
  }

  onImageUpload() {
    this.imageSelected = this.ImageInput.nativeElement.files[0]
    this.convertToBase64()
  }

  convertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.imageSelected as Blob);
    reader.onloadend = () => {
      this.publicacion.foto = reader.result as string
    }
  }

  obtenerUsuario(){
    this.backend.obtenerUsuario(this.usuario).subscribe(
      data=>{
        this.perfil = JSON.parse(JSON.stringify(data))
        console.log(this.perfil)
      },
      _err=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error!',
        })
      }
    )
  }

  haceTiempo(fechaPub:string){
    const fechaPublicacion = new Date(fechaPub)
    const fechaActual = new Date();

    const diferenciaMs = fechaActual.getTime() - fechaPublicacion.getTime();

    const segundos = Math.floor(diferenciaMs / 1000);

    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias>0){
      return `${dias} días`;
    }else if (horas>0){
      return `${horas % 24} horas`;
    }else if (minutos>0){
      return `${minutos % 60} minutos`;
    }else if (segundos>0){
      return `${segundos % 60} segundos`;
    }else{
      return "hace un momento"
    }
  }

  comentar(id:number, comentario:string){
    let cont_coment = {
      id: id,
      descripcion: comentario,
      nombre: this.perfil.nombre_completo,
      foto: this.perfil.foto
    }

    if (cont_coment.descripcion == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe crear un comentario!',
      })
      return
    }

    this.backend.crearComentario(cont_coment).subscribe(
      res => {
        const resp = JSON.parse(JSON.stringify(res))
        if (resp.Res) {
          Swal.fire({
            icon: 'success',
            title: 'Publicado',
            text: 'Se ha publicado tu comentario',
          })
          this.obtenerPublicaciones();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error',
          })
        }
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error!',
        })
      }
    )
  }

  obtenerPublicaciones(){
    this.backend.obtenerPublicaciones(this.usuario).subscribe(
      data=>{
        this.publicaciones = JSON.parse(JSON.stringify(data)).publicaciones
        //console.log(this.publicaciones)
      },
      _err=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error!',
        })
      }
    )
  }

  getUser(usuario:any){
    this.publicacion.usuario=usuario;
    this.usuario = usuario
  }
  crearPublicacion() {
    if (this.publicacion.foto == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe adjuntar una fotografía!',
      })
      return
    }

    let auxArr = this.publicacion.foto .split(",", 2)
    this.publicacion.foto  = auxArr[1]
    this.backend.crearPublicacion(this.publicacion).subscribe(
      res => {
        const resp = JSON.parse(JSON.stringify(res))
        if (resp.Res) {
          Swal.fire({
            icon: 'success',
            title: 'Publicado',
            text: 'Se ha publicado tu fotografía',
          })
          this.obtenerPublicaciones();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error',
          })
        }
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error!',
        })
      }
    )
  }


  async traducir(id: number, descripcion: string, pub:any){
    const { value: idioma } = await Swal.fire({
      title: 'Idioma a traducir',
      input: 'select',
      inputOptions: {
        es: 'Español',
        en: 'Inglés',
        fr: 'Francés',
        pt: 'Portugués'
      },
      inputPlaceholder: 'Selecciona al idioma a traducir',
      showCancelButton: true,
    })

    if (idioma) {
      let traduc = {
        id: id,
        descripcion: descripcion,
        idioma: idioma
      }
      this.backend.traducir(traduc).subscribe(
        res => {
          const resp = JSON.parse(JSON.stringify(res))
          if (resp.Res) {
            Swal.fire({
              icon: 'success',
              title: 'Publicado',
              text: 'Se ha traducido la publicación seleccionada',
            })
            pub.descripcion = resp.descripcion
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error',
            })
          }
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error!',
          })
        }
      )
    }
  }

}
