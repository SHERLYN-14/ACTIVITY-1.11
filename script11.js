import * as three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from "https://esm.sh/lil-gui"

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const fontLoader = new FontLoader()

const scene = new three.Scene()

const textureLoader = new three.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/5.png')

const sizes = 
{
  width: window.innerWidth,
  height: window.innerHeight
}

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) =>
{
  const mat = new three.MeshMatcapMaterial({matcap: matcapTexture})

  const textObj = new TextGeometry
  (
    'Sherlyn Ardiente',
    {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    }
  )
  textObj.center()

  const text = new three.Mesh(textObj, mat)
  scene.add(text)


  const coneObj = new three.ConeGeometry(0.4, 0.8, 64, 1, true)

  for(let i = 0; i < 100; i++)
  {
    const cone = new three.Mesh(coneObj, mat)
    cone.position.x = (Math.random() - 0.5) * 10
    cone.position.y = (Math.random() - 0.5) * 10
    cone.position.z = (Math.random() - 0.5) * 10
    cone.rotation.x = Math.random() * Math.PI
    cone.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    scene.add(cone)
  }

})


const cam = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
cam.position.x = 1
cam.position.y = 1
cam.position.z = 2
scene.add(cam)


const control = new OrbitControls(cam, canvas);
control.enableDamping = true;

window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  cam.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
  
  cam.updateProjectionMatrix();
}) 

window.addEventListener('dblclick', () =>
{
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!fullscreenElement)
  {
    if(canvas.requestFullscreen)
    {
      canvas.requestFullscreen();
    }
    else if(canvas.webkitFullscreenElement)
    {
      canvas.webkitFullscreenElement();
    }
  }
  else
  {
    if(document.exitFullscreen)
    {
      document.exitFullscreen();
    }
    else if(document.webkitFullscreenElement)
    {
      document.webkitFullscreenElement();
    }
  }
})

const renderer = new three.WebGLRenderer
({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene,cam);

const clock = new three.Clock()
const tick = () =>
{
  const elapsedTime = clock. getElapsedTime()
  control.update()
  renderer.render(scene, cam)
  window.requestAnimationFrame(tick)
}
tick()