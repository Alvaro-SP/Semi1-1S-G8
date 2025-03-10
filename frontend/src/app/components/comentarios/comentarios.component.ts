import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  @Input()
  id: number = 0

  verComentarios = false;

  comentarios: any;

  constructor(private backend: BackendService, private router: Router) {

  }

  ngOnInit(): void {
    this.obtenerComentarios()
    console.log(this.comentarios)
  }

  ver(){
    this.verComentarios = !this.verComentarios;
  }


  obtenerComentarios() {
    this.backend.obtenerComentarios(this.id).subscribe(
      data => {
        this.comentarios = JSON.parse(JSON.stringify(data)).comentarios
        console.log(this.comentarios)
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

}
