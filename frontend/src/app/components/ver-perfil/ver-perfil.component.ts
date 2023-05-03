import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent implements OnInit {

  cuerpo: any = {
    Correo: '',
    Nombre: '',
    Dpi: '',
    Foto: ''
  }
  cuerpoPas = '';


  confirmPass = ''
  User = ""
  public showWebcam = false;
  public webcamImage: any = null;
  public cambiarFoto = false;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public cFoto(): void {
    this.cambiarFoto = !this.cambiarFoto;
  }

  imageSelected?: Blob
  @ViewChild('ImageInput', { static: false }) ImageInput!: ElementRef;
  img: string = ''



  constructor(private backend: BackendService, private router: Router) {
    if (sessionStorage.getItem("usuario") == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Inicie sesion para entrar a su perfil!',
      })
      this.router.navigate([''])
    } else {
      this.obtenerInfo()
    }

  }

  obtenerInfo() {
    this.backend.obtenerUsuario2(sessionStorage.getItem("usuario")).subscribe(
      res => {
        var data = JSON.parse(JSON.stringify(res))
        if (data.Res == false) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error!',
          })
        } else {
          this.cuerpo.Correo = data.correo
          this.cuerpo.Nombre = data.nombre
          this.cuerpo.Dpi = data.dpi
          this.cuerpo.Foto = data.foto
        }
      },
      _err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error!',
        })
      }
    )

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
      this.cuerpo.Foto = reader.result as string
      //console.log(this.cuerpo.Foto)
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = !this.showWebcam
  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.cuerpo.Foto = this.webcamImage.imageAsDataUrl
    //console.log(this.cuerpo.Foto)
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  Actualizar() {
    Swal.fire({
      title: 'Ingresa tu contraseña',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      showConfirmButton: true,
      preConfirm: async (pass) => {
        this.cuerpoPas = pass
        if (this.cuerpo.Nombre == '' || this.cuerpo.Dpi == '' || this.cuerpoPas == '' || this.cuerpo.Foto == '') {
          Swal.fire({
            icon: 'error',
            title: 'Ooops...',
            text: 'Complete todos los campos!'
          })
          return
        } else {
          this.User = this.cuerpo.Correo
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
      .then(() => {
        let backupFoto = this.cuerpo.Foto
        try {
          if (!this.cuerpo.Foto.includes("http")) {
            let auxArr = this.cuerpo.Foto.split(",", 2)
            this.cuerpo.Foto = auxArr[1]
          }
        } catch (e) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No ha cargado una imagen!',
          })
          return
        }
        let cuerpoEnvio = {
          Correo: sessionStorage.getItem("usuario"),
          Pass: this.cuerpoPas,
          Nombre: this.cuerpo.Nombre,
          Dpi: this.cuerpo.Dpi,
          Foto: this.cuerpo.Foto
        }

        this.backend.editarPerfil(cuerpoEnvio).subscribe(
          res => {
            const resp = JSON.parse(JSON.stringify(res))
            if (resp.Res) {
              this.obtenerInfo()
              Swal.fire({
                icon: 'success',
                text: 'Información actualizada con éxito',
              })
              this.router.navigate(['publicaciones'])
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Contraseña erronea',
              })
              this.router.navigate(['publicaciones'])
            }
           
          },
          err => {
            console.log(err)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error!',
            })
            this.router.navigate(['publicaciones'])
          }
        )
      })
  }
}
// const { Correo, Pass, Nombre, Dpi, Foto } = req.body
