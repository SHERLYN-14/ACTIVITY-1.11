import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from "https://esm.sh/lil-gui";

// GUI
const gui = new dat.GUI();

// Canvas and Scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/5.png');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Font Loader
const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const mat = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text Geometry
  const textGeometry = new TextGeometry('Sherlyn Ardiente', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  // Center the text
  textGeometry.computeBoundingBox();
  const boundingBox = textGeometry.boundingBox;
  const offsetX = (boundingBox.max.x - boundingBox.min.x) / 2;
  const offsetY = (boundingBox.max.y - boundingBox.min.y) / 2;
  const offsetZ = (boundingBox.max.z - boundingBox.min.z) / 2;
  textGeometry.translate(-offsetX, -offsetY, -offsetZ);

  const text = new THREE.Mesh(textGeometry, mat);
  scene.add(text);

  // Cone Geometry
  const coneGeometry = new THREE.ConeGeometry(0.4, 0.8, 64, 1, true);
  for (let i = 0; i < 100; i++) {
    const cone = new THREE.Mesh(coneGeometry, mat);

    // Random Position and Rotation
    cone.position.x = (Math.random() - 0.5) * 10;
    cone.position.y = (Math.random() - 0.5) * 10;
    cone.position.z = (Math.random() - 0.5) * 10;
    cone.rotation.x = Math.random() * Math.PI;
    cone.rotation.y = Math.random() * Math.PI;

    // Random Scale
    const scale = Math.random();
    cone.scale.set(scale, scale, scale);

    scene.add(cone);
  }
});

// Camera
const cam = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
cam.position.set(1, 1, 2);
scene.add(cam);

// Controls
const controls = new OrbitControls(cam, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, cam);

// Resize Event Listener
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  cam.aspect = sizes.width / sizes.height;
  cam.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Fullscreen Event Listener
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

// Animation Loop
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, cam);

  // Loop
  window.requestAnimationFrame(tick);
};
tick();
