import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


@Injectable({
  providedIn: 'root'
})
export class CharacterLoaderService {
  private fbxLoader = new FBXLoader();
  public mixer: any
  public character: any
  private characterLoader: Subject<boolean> = new Subject<boolean>();
  public characterObservable = this.characterLoader.asObservable();
  animationAction: any;
  constructor() { }

  loadNewCharacter(){
    this.characterLoader.next(false)
    this.fbxLoader.load(
      'assets/untitled.fbx',
      (object) => {
        object.scale.set(0.5, 0.5, 0.5);
        this.mixer = new THREE.AnimationMixer(object)

        this.animationAction = this.mixer.clipAction(
          (object as THREE.Object3D).animations[0]
        )
        this.character = object
        this.characterLoader.next(true)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
