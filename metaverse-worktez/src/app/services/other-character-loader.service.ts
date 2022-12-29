import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { user } from '../interfaces/userInterface';
import { CharacterLoaderService } from './character-loader.service';
import { CommunicationService } from './communication.service';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class OtherCharacterLoaderService {

  private otherCharacterLoader: Subject<boolean> = new Subject<boolean>();
  public otherCharacterObservable = this.otherCharacterLoader.asObservable();
  private fbxLoader = new FBXLoader();
  public character: any
  userData = {} as user;
  constructor(private sceneService: SceneService ) { }

  loadOthers(user: user){
    this.otherCharacterLoader.next(false)
    this.fbxLoader.load(
      'assets/avatar.fbx',
      (object) => {
        object.scale.set(0.3, 0.3, 0.3);
        // this.character = object;
        // this.userData.Id = this.communicationService.userId;
        // this.userData.UserName = this.communicationService.userName;
        object.name = user.Id;
        this.sceneService.scene.add(object);
   
        this.sceneService.scene.children.forEach((element) => {
          console.log(element);
        })
        // this.userData.Position = this.character.position;
        // this.communicationService.sendMessage(this.userData);
        this.otherCharacterLoader.next(true)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )
  }

  updateCharacterPosition(user: user)
  {
    this.sceneService.scene.children.forEach((element)=>{
      if(element.name == user.Id)
      {
        element.position.set(user.Position.x, user.Position.y, user.Position.z);
      }
    })
  }
}
