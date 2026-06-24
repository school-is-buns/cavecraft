
import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x87ceeb);

const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

const light=new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

const groundMat=new THREE.MeshLambertMaterial({color:0x55aa55});
const cubeGeo=new THREE.BoxGeometry(1,1,1);

for(let x=-16;x<16;x++){
 for(let z=-16;z<16;z++){
   const cube=new THREE.Mesh(cubeGeo,groundMat);
   cube.position.set(x,0,z);
   scene.add(cube);
 }
}

camera.position.set(0,3,5);

function animate(){
 requestAnimationFrame(animate);
 renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
 camera.aspect=innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);
});
