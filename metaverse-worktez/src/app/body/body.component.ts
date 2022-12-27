import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { user } from '../interfaces/userInterface';
import { CharacterLoaderService } from '../services/character-loader.service'
import { CommunicationService } from '../services/communication.service';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {



  constructor(private characterLoaderService: CharacterLoaderService, public communicationService: CommunicationService) { }

  ngOnInit(): void {
  }


  

}
