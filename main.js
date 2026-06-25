
import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x87ceeb);

const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,.8));
const sun=new THREE.DirectionalLight(0xffffff,1);
sun.position.set(20,40,20);
scene.add(sun);

const blocks=[];
const geo=new THREE.BoxGeometry(1,1,1);

function addBlock(x,y,z,color=0x55aa55){
 const m=new THREE.Mesh(
  geo,
  new THREE.MeshLambertMaterial({color})
 );
 m.position.set(x,y,z);
 scene.add(m);
 blocks.push(m);
 return m;
}

for(let x=-20;x<20;x++){
 for(let z=-20;z<20;z++){
   const h=Math.floor(Math.sin(x*.3)*2+Math.cos(z*.3)*2+4);
   for(let y=0;y<h;y++){
     addBlock(x,y,z,y===h-1?0x55aa55:0x8b5a2b);
   }
 }
}

camera.position.set(0,8,10);

const keys={};
addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);

let yaw=0,pitch=0;
document.body.addEventListener('click',()=>{
 document.body.requestPointerLock();
});

addEventListener('mousemove',e=>{
 if(document.pointerLockElement===document.body){
  yaw-=e.movementX*0.002;
  pitch-=e.movementY*0.002;
  pitch=Math.max(-1.5,Math.min(1.5,pitch));
 }
});

const ray=new THREE.Raycaster();

addEventListener('mousedown',e=>{
 ray.setFromCamera(new THREE.Vector2(0,0),camera);
 const hit=ray.intersectObjects(blocks)[0];
 if(!hit) return;

 if(e.button===0){
   scene.remove(hit.object);
   const i=blocks.indexOf(hit.object);
   if(i>=0) blocks.splice(i,1);
 }
 if(e.button===2){
   const p=hit.point.clone().add(hit.face.normal.clone().multiplyScalar(.5));
   addBlock(Math.round(p.x),Math.round(p.y),Math.round(p.z));
 }
});

addEventListener('contextmenu',e=>e.preventDefault());

function animate(){
 requestAnimationFrame(animate);

 camera.rotation.order='YXZ';
 camera.rotation.y=yaw;
 camera.rotation.x=pitch;

 const speed=.12;
 const forward=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
 const right=new THREE.Vector3(forward.z,0,-forward.x);

 if(keys['w']) camera.position.addScaledVector(forward,-speed);
 if(keys['s']) camera.position.addScaledVector(forward,speed);
 if(keys['a']) camera.position.addScaledVector(right,-speed);
 if(keys['d']) camera.position.addScaledVector(right,speed);
 if(keys[' ']) camera.position.y+=speed;
 if(keys['shift']) camera.position.y-=speed;

 renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
 camera.aspect=innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);
});
