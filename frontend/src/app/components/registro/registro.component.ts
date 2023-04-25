import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
  }
  cuerpo: any = {
    Nombre: '',
    Correo: '',
    Dpi: '',
    Password: '',
    Foto: ''
  }

  confirmPass = ''
  public showWebcam = false;
  public webcamImage: any = null;
  public existsFoto = false;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  imageSelected?: Blob
  @ViewChild('ImageInput', { static: false }) ImageInput!: ElementRef;
  img: string = ''



  onImageUpload() {
    this.imageSelected = this.ImageInput.nativeElement.files[0]
    this.convertToBase64()
  }

  convertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.imageSelected as Blob);
    reader.onloadend = () => {
      this.cuerpo.Foto = reader.result as string
      this.existsFoto = true
      //console.log(this.cuerpo.Foto)
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = !this.showWebcam
  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.existsFoto = true
    this.cuerpo.Foto = this.webcamImage.imageAsDataUrl
    //console.log(this.cuerpo.Foto)
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  Registrar() {
    if (this.cuerpo.Usuario == "" || this.cuerpo.Nombre == "" || this.cuerpo.Password == "" || this.cuerpo.Foto == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos!',
      })
      return
    }
    if (this.confirmPass != this.cuerpo.Password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las password no coinciden!',
      })
      return
    }
    let auxArr = this.cuerpo.Foto.split(",", 2)
    this.cuerpo.Foto = auxArr[1]
    this.backend.Registro(this.cuerpo).subscribe(
      res => {
        const resp = JSON.parse(JSON.stringify(res))
        if (resp.Res) {
          this.router.navigate(['login'])
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error',
          })
          /*
          this.cuerpo.Usuario = ""
          this.cuerpo.Nombre = ""
          this.cuerpo.Correo = ""
          this.cuerpo.Dpi=""
          this.cuerpo.Password = ""
          this.cuerpo.Foto = ""
          this.confirmPass = ""
          this.existsFoto = false*/
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
