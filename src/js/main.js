import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as TWEEN from 'tween.js';



var model, camera, scene, renderer, lookAt, lookAtDes, controls;

lookAtDes = new THREE.Vector3(0, 0, 500);
lookAt = new THREE.Vector3(0, 0, -20);

const scrollMax = {
    "birdView": { "min": -20, "max": 90 },
    "exploreView": { "min": -100, "max": 50 },
}
const originPosition = new THREE.Vector3(0, 90, -20);
const cameraPositionDes = new THREE.Vector3(0, 10, -70);

var view = "birdView";
var moveCamera, rotateCamera;
var startRotation, endRotation;


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.copy(originPosition)

    // backup original rotation
    startRotation = new THREE.Euler().copy(camera.rotation);

    // final rotation (with lookAt)
    camera.lookAt(lookAtDes);
    endRotation = new THREE.Euler().copy(camera.rotation);

    // revert to original rotation
    camera.rotation.copy(startRotation);
    camera.lookAt(lookAt);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.copy(lookAt);
    // controls.enabled = false;

    let hlight = new THREE.AmbientLight(0x1511f1, 3);
    scene.add(hlight);

    let directionalLight = new THREE.DirectionalLight(0x1511f1, 5);
    directionalLight.position.set(-100, 350, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 0.1;
    var side = 1000;
    directionalLight.shadow.camera.top = side;
    directionalLight.shadow.camera.bottom = -side;
    directionalLight.shadow.camera.left = side;
    directionalLight.shadow.camera.right = -side;

    scene.add(directionalLight);
    let light = new THREE.PointLight(0xEE0F9B, 1);
    light.position.set(0, 300, 500);
    scene.add(light);
    let light2 = new THREE.PointLight(0xEE0F9B, 7);
    light2.position.set(500, 100, 0);
    scene.add(light2);
    let light3 = new THREE.PointLight(0xEE0F9B, 0.5);
    light3.position.set(0, 100, -500);
    scene.add(light3);
    let light4 = new THREE.PointLight(0xEE0F9B, 0.5);
    light4.position.set(-500, 300, 500);
    scene.add(light4);


    let geometry = new THREE.PlaneGeometry(200, 200);

    let material = new THREE.MeshPhongMaterial({ color: 0x120d01, side: THREE.DoubleSide });
    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    const texture = new THREE.TextureLoader().load("./assets/textures/road.jpg");

    geometry = new THREE.PlaneGeometry(8, 200);
    geometry.rotateX(-Math.PI * 0.5);
    material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
    let road = new THREE.Mesh(geometry, material);
    road.receiveShadow = true;
    road.position.x = 1.3
    road.position.y = 0.1
    scene.add(road);

    let loader = new GLTFLoader();

    loader.load("" + new URL('../assets/streetlight/scene.glb', import.meta.url), (gltf) => {
        const streetLight = gltf.scene;
        streetLight.scale.set(2, 2, 2);
        streetLight.position.y = 2;
        streetLight.position.x = -3.5;
        streetLight.position.z = 25;
        // streetLight.rotateY(Math.PI * -0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        // streetLight.emissive = THREE.Color(0xEE0F9B);
        scene.add(gltf.scene);
        let light = new THREE.PointLight(0xEE0F9B, 5, 10, 1);
        light.position.set(-3.5, 3, 25);
        scene.add(light);
    });

    loader.load("" + new URL('/src/assets/building1/scene.glb', import.meta.url), (gltf) => {
        model = gltf.scene;
        model.scale.set(250, 250, 350);
        // model.position.y = 1;
        model.position.x = 17;
        model.position.z = 40;
        model.rotateY(Math.PI * -0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }

        });
        scene.add(gltf.scene);
    });
    loader.load("" + new URL('/src/assets/building1/scene.glb', import.meta.url), (gltf) => {
        model = gltf.scene;
        model.scale.set(250, 250, 350);
        model.position.x = 17;
        model.position.z = 60;
        model.rotateY(Math.PI * -0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }

        });
        scene.add(gltf.scene);
    });

    loader.load("" + new URL('/src/assets/building1/scene.glb', import.meta.url), (gltf) => {
        model = gltf.scene;
        model.scale.set(250, 250, 350);
        // model.position.y = 1;
        model.position.x = -14;
        model.position.z = -30;
        model.rotateY(Math.PI * 0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }

        });
        scene.add(gltf.scene);
    });

    let fogColor = new THREE.Color(0x020136);

    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 1, 150);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('wheel', onMouseWheel, false);

    function tweenCamera(targetPosition, duration) {

        var position = new THREE.Vector3().copy(camera.position);

        moveCamera = new TWEEN.Tween(position)
            .to(targetPosition, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                camera.position.copy(position);


            })
            .onComplete(() => {
                camera.position.copy(targetPosition);
                console.log('completed')
            }).start()

    }
    function tweenCameraLookAt(targetRotation, duration) {
        const newRot = { x: targetRotation.x, y: targetRotation.y, z: targetRotation.z };
        const oldRot = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };

        rotateCamera = new TWEEN.Tween(oldRot).to(newRot, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                camera.rotation.x = oldRot.x;
                camera.rotation.y = oldRot.y;
                camera.rotation.z = oldRot.z;
            })
            .onComplete(() => {
                camera.rotation.x = newRot.x;
                camera.rotation.y = newRot.y;
                camera.rotation.z = newRot.z;

                // Temporary set camera look at since haven't figured out how to tween the camera back
                if (view === "birdView") {
                    camera.lookAt(lookAt);
                }
            })
            .start()


    }
    document.querySelector('#explore').addEventListener('click', () => {
        console.log("explore");

        var duration = 3000;


        tweenCamera(view === "birdView" ? cameraPositionDes : originPosition, duration);
        tweenCameraLookAt(view === "birdView" ? endRotation : startRotation, duration);


        view = view === "birdView" ? "exploreView" : "birdView";
        document.querySelector('#explore').setAttribute('value', view === "birdView" ? "explore" : "back to default")

    });
}

function render() {
    requestAnimationFrame(render);
    TWEEN.update();
    // controls.update();
    renderer.render(scene, camera);

}

function onMouseWheel(event) {

    camera.position.z += event.deltaY / 100;
    // prevent scrolling beyond a min/max value
    camera.position.clampScalar(scrollMax[view].min, scrollMax[view].max);
}

init();
render();
