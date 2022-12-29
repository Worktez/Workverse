import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CharacterLoaderService } from 'src/app/services/character-loader.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { SceneService } from 'src/app/services/scene.service';
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;
  animationAction: any;
  private mixer: any;
  private wall1: any;
  private tv: any;
  private clock = new THREE.Clock();
  private model: any;
  private cube: any;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private wPressed = false;
  private aPressed = false;
  private sPressed = false;
  private dPressed = false;
  private qPressed = false;
  private ePressed = false;


  private fbxLoader = new FBXLoader();
  private renderer!: THREE.WebGLRenderer;
  // private scene!: THREE.Scene;

  // Keyboard Event Handling
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'w' || event.key == 'W') {
      this.wPressed = true;
    }
    if (event.key == 's' || event.key == 'S') {
      this.sPressed = true;
    }
    if (event.key == 'a' || event.key == 'A') {
      this.aPressed = true;
    }
    if (event.key == 'd' || event.key == 'D') {
      this.dPressed = true;
    }
    if (event.key == 'q' || event.key == 'Q') {
      this.qPressed = true;
    }
    if (event.key == 'e' || event.key == 'E') {
      this.ePressed = true;
    }
    if (event.key == 'z' || event.key == 'Z') {
      this.cube.position.set(0, 0, 0);
      this.cube.rotation.set(0, 0, 0);
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyevent(event: KeyboardEvent) {
    if (event.key == 'w' || event.key == 'W') {
      this.wPressed = false;
      // this.characterLoaderService.animationAction.stop();
    }
    if (event.key == 's' || event.key == 'S') {
      this.sPressed = false;
      // this.characterLoaderService.animationAction.stop();
    }
    if (event.key == 'a' || event.key == 'A') {
      this.aPressed = false;
    }
    if (event.key == 'd' || event.key == 'D') {
      this.dPressed = false;
    }
    if (event.key == 'q' || event.key == 'Q') {
      this.qPressed = false;
    }
    if (event.key == 'e' || event.key == 'E') {
      this.ePressed = false;
    }
  }


  private createScene() {
    // Scene
    this.sceneService.scene = new THREE.Scene();
    this.sceneService.scene.background = new THREE.Color(0xa0a0a0a);
    this.sceneService.scene.fog = new THREE.Fog(0xa0a0a0, 200, 3000);

    // Light
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 100);
    this.sceneService.scene.add(light);

    // Loading Character 
    this.characterLoaderService.loadNewCharacter();
    this.characterLoaderService.characterObservable.subscribe( ()=> {
      this.cube = this.characterLoaderService.character;
      this.sceneService.scene.add(this.cube);
    } )

    // Loading Static object - TV
    this.fbxLoader.load(
      'assets/TV.fbx',
      (object) => {
        this.tv = object;
        this.tv.position.set(0, 0, -900)
        this.sceneService.scene.add(this.tv)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )

    // Boundary Walls and ceilings added as a cube
    this.wall1 = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), new
      THREE.MeshPhongMaterial({ color: 0x87CEEB, depthWrite: false, side: 2 , depthTest: false}));
    this.wall1.position.set(0, 1000, 0);
    this.wall1.geometry.computeBoundingBox();
    this.sceneService.scene.add(this.wall1);

    // Floor Grid design
    // let grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
    // this.sceneService.scene.add(grid);

    // Iniatilizing camera
    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 1, 4000
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;
    this.camera.lookAt(this.sceneService.scene.position);

    // Loading Worktez Logo as a texture
    const img = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/worktez.jpg'), depthWrite: false });
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), img);
    plane.rotation.set(-Math.PI / 2, Math.PI / 2000, 2 * Math.PI);
    this.sceneService.scene.add(plane);
  }

  private update() {

    var delta = this.clock.getDelta(); // seconds.
    if (this.characterLoaderService.mixer) this.characterLoaderService.mixer.update(delta);
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = Math.PI / 4 * delta;   // pi/4 radians (45 degrees) per second

    const conditions = this.cube.position['z'] > this.wall1.geometry.boundingBox.min.z && this.cube.position['z'] < this.wall1.geometry.boundingBox.max.z && this.cube.position['y'] > this.wall1.geometry.boundingBox.min.y && this.cube.position['y'] < this.wall1.geometry.boundingBox.max.y && this.cube.position['x'] > this.wall1.geometry.boundingBox.min.x && this.cube.position['x'] < this.wall1.geometry.boundingBox.max.x;

    // Conditions to Restrict character inside the walls
    if (this.cube.position['z'] <= this.wall1.geometry.boundingBox.min.z) {
      this.cube.position['z'] = this.wall1.geometry.boundingBox.min.z + 1;
    }
    if (this.cube.position['z'] >= this.wall1.geometry.boundingBox.max.z) {
      this.cube.position['z'] = this.wall1.geometry.boundingBox.max.z - 1;
    }
    if (this.cube.position['y'] <= this.wall1.geometry.boundingBox.min.y) {
      this.cube.position['y'] = this.wall1.geometry.boundingBox.min.y + 1;
    }
    if (this.cube.position['y'] >= this.wall1.geometry.boundingBox.max.y) {
      this.cube.position['y'] = this.wall1.geometry.boundingBox.max.y - 1;
    }
    if (this.cube.position['x'] <= this.wall1.geometry.boundingBox.min.x) {
      this.cube.position['x'] = this.wall1.geometry.boundingBox.min.x + 1;
    }
    if (this.cube.position['x'] >= this.wall1.geometry.boundingBox.max.x) {
      this.cube.position['x'] = this.wall1.geometry.boundingBox.max.x - 1;
    }


    if (conditions) {
      // move forwards/backwards/left/right
      if (this.wPressed) {
        // this.characterLoaderService.animationAction.play();
        this.cube.translateZ(-moveDistance);
      }
      if (this.sPressed) {
        // this.characterLoaderService.animationAction.play();
        this.cube.translateZ(moveDistance);
      }
      if (this.qPressed)
        this.cube.translateX(-moveDistance);
      if (this.ePressed)
        this.cube.translateX(moveDistance);
      // // rotate left/right/up/down
      if (this.aPressed)
        this.cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
      if (this.dPressed)
        this.cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

      if(this.wPressed || this.sPressed || this.qPressed || this.ePressed || this.aPressed || this.dPressed)
      {
        this.characterLoaderService.userData.Position = this.cube.position;
        this.communicationService.sendMessage(this.characterLoaderService.userData);
      }

      const cameraConditions = this.camera.position['z'] > this.wall1.geometry.boundingBox.min.z && this.camera.position['z'] < this.wall1.geometry.boundingBox.max.z && this.camera.position['y'] > this.wall1.geometry.boundingBox.min.y && this.camera.position['y'] < this.wall1.geometry.boundingBox.max.y && this.camera.position['x'] > this.wall1.geometry.boundingBox.min.x && this.camera.position['x'] < this.wall1.geometry.boundingBox.max.x;

      var relativeCameraOffset = new THREE.Vector3(0, 400, 1600);
      var cameraOffset = relativeCameraOffset.applyMatrix4(this.cube.matrixWorld);
      this.camera.position.x = cameraOffset.x;
      this.camera.position.y = cameraOffset.y;
      this.camera.position.z = cameraOffset.z;
      this.camera.lookAt(this.cube.position);
    }

    this.camera.updateMatrix();
    this.camera.updateProjectionMatrix();
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.update();
      component.renderer.render(component.sceneService.scene, component.camera);
    }())
  }


  constructor(public characterLoaderService: CharacterLoaderService, public communicationService: CommunicationService, public sceneService: SceneService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }
}