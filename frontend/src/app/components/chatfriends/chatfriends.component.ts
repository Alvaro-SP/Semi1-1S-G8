import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chatfriends',
  templateUrl: './chatfriends.component.html',
  styleUrls: ['./chatfriends.component.css']
})
export class ChatfriendsComponent implements OnInit {
  private socket: any;
  private messages: string[] = [];
  public messageText ="";
  @ViewChild('messagesList', { static: false }) private messagesList!: ElementRef;
  friends: any[] = [
    {
      "name": "Salvador Nom",
      "imageName": "https://p.kindpng.com/picc/s/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png"
    },
    {
      "name": "esturban Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },
    {
      "name": "abduzcan Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },{
      "name": "Salvador Nom",
      "imageName": "https://p.kindpng.com/picc/s/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png"
    },
    {
      "name": "esturban Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },
    {
      "name": "abduzcan Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },{
      "name": "Salvador Nom",
      "imageName": "https://p.kindpng.com/picc/s/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png"
    },
    {
      "name": "esturban Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },
    {
      "name": "abduzcan Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },{
      "name": "Salvador Nom",
      "imageName": "https://p.kindpng.com/picc/s/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png"
    },
    {
      "name": "esturban Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    },
    {
      "name": "abduzcan Nom",
      "imageName": "https://freepngimg.com/thumb/youtube/63841-profile-twitch-youtube-avatar-discord-free-download-image-thumb.png"
    }
  ];
  items: any = [
    {
      message: 'Hola, soy el bot de la pagina, en que te puedo ayudar?',
      "bot": true
    }
  ];
  hasNewMessage: boolean = false; // Nueva variable para la animación
  ramdom: number = 0;
  constructor(private backend: BackendService, private router: Router) {
    this.socket = io.connect('ws://localhost:4000',{
      query: {
        userId: sessionStorage.getItem('usuario')
        // userId: 1
      }
    });
    this.socket.on('message', (data: {message:string}) => {
        this.items.push({  //* set the message in the list of messages
          message: data.message,
          "bot": true
        });
    });
  }

  ngOnInit(): void {
  }
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
    this.items.push({  //* set the message in the list of messages
      message: this.messageText,
      "bot": false
    });
    this.messageText = '';
  }
  // Function for update the scroll of the chat position
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
