import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-chatfriends',
  templateUrl: './chatfriends.component.html',
  styleUrls: ['./chatfriends.component.css']
})
export class ChatfriendsComponent implements OnInit {
  // ! ********************** VARIABLES  *********************
  private socket: any;
  private messages: string[] = [];
  public messageText ="";
  public Allmessages: any = {}; //guardar todos los mensajes
  @ViewChild('messagesList', { static: false }) private messagesList!: ElementRef;
  friends: any[] = [];
  allusers: any[] = [];
  usuario=""
  photoChat=""
  nameChat=""
  globalid=-1 // the id that will be changed for each chat
  items: any = [];
  hasNewMessage: boolean = false; // Nueva variable para la animación
  ramdom: number = 0;
  // ! ********************** CONSTRUCTOR  *********************
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
      this.obtenerAmigos();
      this.obtenerUsuarios();
    }
    this.socket = io.connect('ws://localhost:4000',{
      query: {
        userId: sessionStorage.getItem('usuario')
        // userId: 1
      }
    });
    this.socket.on('message', (data: {message:string}) => {
        // this.items.push({  //* set the message in the list of messages
        //   message: data.message,
        //   "bot": true
        // });
        this.Allmessages[this.globalid].push({  //* set the message in the list of messages
          message: data.message,
          "bot": true
        });
    });
  }
  
  ngOnInit(): void {
  }
  
  // * ========= Function to send the message ==========
  SendMessage() {
    const data = {
      recipientid: sessionStorage.getItem('usuario'),
      message: this.messageText
    };
    //* emit the message to the server
    this.socket.emit('message', data);
    //* Update the scroll of the chat position
    this.updateScroll();
    this.hasNewMessage = true;
    // this.items.push({  //* set the message in the list of messages
    //   message: this.messageText,
    //   "bot": false
    // });
    this.Allmessages[this.globalid].push({  //* set the message in the list of messages
      message: this.messageText,
      "bot": false
    });
    this.messageText = '';
  }
  // * ========= Function to get the current user==========
  getUser(usuario:any){
    this.usuario = usuario
  }
  // * ========= Function for to change the messages in chat==========
  onFriendClick(id: number) {
    console.log('Clicked friend with ID:', id);
    this.globalid = id;
    // here i take of the massive chats JSON Allmessages the chat correspond to my id 
    this.items = this.Allmessages[id]; // set the messages of the chat
    this.photoChat = this.friends[id].photo // set the photo of the chat
    this.nameChat = this.friends[id].name // set the name of the chat
    this.updateScroll(); // update the scroll of the chat position
  }
  enviarSolicitud(correo: number){
    const obj ={
      usuario: this.usuario,
      correo_user: correo
    }
    // this.backend.aceptarAmigo(obj).subscribe(
    //   data=>{
    //     const res = JSON.parse(JSON.stringify(data))
    //     console.log(res)
    //     if(res.status == "ok"){
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Solicitud enviada!',
    //         text: 'Espera a que el usuario acepte tu solicitud',
    //       })
    //     }else{
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Ha ocurrido un error!',
    //       })
    //     }
    //   },
    //   _err=>{
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'Ha ocurrido un error!',
    //     })
    //   }
    // )
  }
  addFriend(correo_amigo: string){
    const obj ={
      correo_amigo: correo_amigo,
      usuario: this.usuario
    }
    this.backend.addfriend(obj).subscribe(
      data=>{
        const res = JSON.parse(JSON.stringify(data))
        console.log(res)
        if(res.status == "ok"){
          Swal.fire({
            icon: 'success',
            title: 'Amigo agregado!',
            text: 'Ahora puedes chatear con el',
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error!',
          })
        }
      }
    )
  }


  // * ========= GET ALL THE DATA ==========
  obtenerAmigos(){
    this.backend.getfriends(this.usuario).subscribe(
      data=>{
        const res = JSON.parse(JSON.stringify(data))
        this.friends = res.amigos
        console.log(this.friends)
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
  obtenerUsuarios(){
    this.backend.getallusers(this.usuario).subscribe(
      data=>{
        const res = JSON.parse(JSON.stringify(data))
        console.log(res.usuarios)
        this.allusers = res.usuarios
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

  //*  ======== Function for update the scroll of the chat position
  private updateScroll(): void {
    setTimeout(() => {
      this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight + 500;
    }, 100);
  }
  local1() {
    // guardar en session storate:
    sessionStorage.setItem("usuario","1");
  }
  local2() {
    // guardar en session storate:
    sessionStorage.setItem("usuario","2");
  }
}
