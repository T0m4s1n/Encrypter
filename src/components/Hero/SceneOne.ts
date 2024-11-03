import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export function initSceneOne(container: HTMLElement) {
  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, effect: AsciiEffect;
  let sphere: THREE.Mesh, plane: THREE.Mesh, controls: TrackballControls;
  const start = Date.now();

  camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.set(0, 150, 500);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);


  const light1 = new THREE.DirectionalLight(0xffffff, 3);
  light1.position.set(500, 500, 500);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(-500, -500, -500);
  scene.add(light2);

  // Objeto: esfera
  sphere = new THREE.Mesh(new THREE.SphereGeometry(200, 20, 10), new THREE.MeshPhongMaterial({ flatShading: true }));
  scene.add(sphere);

  // Plano
  plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
  plane.position.set(0, -200, 0);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Renderer y efecto ASCII
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);

  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
  effect.setSize(container.clientWidth, container.clientHeight);
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'black';

  container.appendChild(effect.domElement);

  // Controles
  controls = new TrackballControls(camera, effect.domElement);

  // Ajuste de tamaño
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    effect.setSize(container.clientWidth, container.clientHeight);
  });

  const animate = () => {
    const timer = Date.now() - start;
    sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
    sphere.rotation.x = timer * 0.0003;
    sphere.rotation.z = timer * 0.0002;
    controls.update();
    effect.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
