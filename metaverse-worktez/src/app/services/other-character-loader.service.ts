import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
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
        let root = new THREE.Group();
        root.add(object);
        const text = document.createElement( 'div' );
						text.className = 'label';
						text.style.color = "rgb(255,0,0)";
						text.textContent = "hiiiiiiii";
            

						const label = new CSS2DObject( text );
            label.scale.set(5,5,5)
						label.position.copy( object.position );
						root.add( label );
            // text.appendChild()
            console.log(root);
            
        this.sceneService.scene.add(label);
        this.sceneService.scene.add(object);
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
