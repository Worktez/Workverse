import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  //* Stage Properties

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPane: number = 1;

  @Input('farClipping') public farClippingPane: number = 1000;

  //? Scene properties
  private camera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  private ambientLight!: THREE.AmbientLight;

  private light1!: THREE.PointLight;

  private light2!: THREE.PointLight;

  private light3!: THREE.PointLight;

  private light4!: THREE.PointLight;

  // private keyboard = new THREEx.KeyboardState();
  private clock = new THREE.Clock();

  private model: any;
  private geometry = new THREE.BoxGeometry(10,10, 10);
  private maerial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.maerial);

  private directionalLight!: THREE.DirectionalLight;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private wPressed = false;
  private aPressed = false;
  private sPressed = false;
  private dPressed = false;
  private qPressed = false;
  private ePressed = false;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'w' || event.key == 'W'){
      this.wPressed = true;
    }
    if(event.key == 's' || event.key == 'S'){
      this.sPressed = true;
    }
    if(event.key == 'a' || event.key == 'A'){
    this.aPressed = true;
    }
    if(event.key == 'd' || event.key == 'D'){
     this.dPressed = true;
    }
    if(event.key == 'q' || event.key == 'Q'){
      this.qPressed = true;
     }
     if(event.key == 'e' || event.key == 'E'){
      this.ePressed = true;
     }
     if(event.key == 'z' || event.key == 'Z'){
      this.cube.position.set(0,25.1,0);
    	this.cube.rotation.set(0,0,0);
     }
  }
  @HostListener('window:keyup', ['$event'])
  keyevent(event: KeyboardEvent) {
    if(event.key == 'w' || event.key == 'W'){
      this.wPressed = false;
    }
    if(event.key == 's' || event.key == 'S'){
      this.sPressed = false;
    }
    if(event.key == 'a' || event.key == 'A'){
      this.aPressed = false;
    }
    if(event.key == 'd' || event.key == 'D'){
      this.dPressed = false;
    }
    if(event.key == 'q' || event.key == 'Q'){
      this.qPressed = false;
     }
     if(event.key == 'e' || event.key == 'E'){
      this.ePressed = false;
     }
  }
  private loaderGLTF = new GLTFLoader();

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  /**
   *Animate the model
   *
   * @private
   * @memberof ModelComponent
   */
  private animateModel() {
    if (this.model) {
      this.model.rotation.z += 0.005;
    }
  }

  /**
   *create controls
   *
   * @private
   * @memberof ModelComponent
   */
  private createControls = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    document.body.appendChild(renderer.domElement);
    // this.controls = new OrbitControls(this.camera, renderer.domElement);
    // this.controls.autoRotate = true;
    // this.controls.enableZoom = true;
    // this.controls.enablePan = false;
    // this.controls.update();
  };


  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0a);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0,200,100);
    this.scene.add(light);
    
    this.scene.add(this.cube);
    let mesh = new THREE.Mesh( new THREE.PlaneGeometry(2000, 2000), new 
    THREE.MeshPhongMaterial({color:0x999999, depthWrite: false}));
    mesh.rotation.x = - Math.PI/2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    let grid = new THREE.GridHelper(2000,40,0x000000,0x000000);
    // grid.material.transparent = true;
    this.scene.add(grid);
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth/window.innerHeight, 1, 2000
    );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 400;
    this.camera.lookAt(this.scene.position);	
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }
  
private animate() 
{
	this.update();
}

private update()
{
	var delta = this.clock.getDelta(); // seconds.
	var moveDistance = 100 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 4 * delta;   // pi/4 radians (45 degrees) per second
	// move forwards/backwards/left/right
	if ( this.wPressed )
		this.cube.translateZ( -moveDistance );
	if ( this.sPressed )
		this.cube.translateZ(  moveDistance );
	if ( this.qPressed )
		this.cube.translateX( -moveDistance );
	if ( this.ePressed )
		this.cube.translateX(  moveDistance );	
	// // rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( this.aPressed )
		this.cube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	if ( this.dPressed )
		this.cube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	// if ( keyboard.pressed("R") )
	// 	this.cube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	// if ( keyboard.pressed("F") )
	// 	this.cube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	
	// if ( keyboard.pressed("Z") )
	// {
	// 	this.cube.position.set(0,25.1,0);
	// 	this.cube.rotation.set(0,0,0);
	// }
	
	var relativeCameraOffset = new THREE.Vector3(0,50,200);

	var cameraOffset = relativeCameraOffset.applyMatrix4( this.cube.matrixWorld );

	this.camera.position.x = cameraOffset.x;
	this.camera.position.y = cameraOffset.y;
	this.camera.position.z = cameraOffset.z;
	this.camera.lookAt( this.cube.position );
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
    component.animate();
    component.renderer.render(component.scene, component.camera);
  }())
}

 
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
  }


}