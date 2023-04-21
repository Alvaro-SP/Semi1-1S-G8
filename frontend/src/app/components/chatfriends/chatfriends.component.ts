import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-chatfriends',
  templateUrl: './chatfriends.component.html',
  styleUrls: ['./chatfriends.component.css']
})
export class ChatfriendsComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
  }

}
