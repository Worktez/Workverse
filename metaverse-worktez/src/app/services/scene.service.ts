import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  public scene !: THREE.Scene;
  constructor() { }
}
