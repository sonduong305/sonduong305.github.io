
const key = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    a: 97,
    w: 119,
    s: 115,
    d: 100
}
var car, camera, scene, renderer;
// var geometry, material, mesh;

init();
render();


async function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 100, 0)
    camera.up.set(0, 2, 0)
    camera.lookAt(0, 0, 0)


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

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // // controls.enabled = false;
    // // controls.enablePan = false;
    // // controls.maxDistance = 50;
    // // controls.minDistance = 3;
    // controls.mouseButtons = {
    //     LEFT: THREE.MOUSE.ROTATE,
    //     MIDDLE: THREE.MOUSE.DOLLY,
    //     RIGHT: THREE.MOUSE.PAN
    // }
    // controls.touches = {
    //     ONE: THREE.TOUCH.PAN,
    //     TWO: THREE.TOUCH.DOLLY_PAN
    // }
    // controls.update()


    let geometry = new THREE.PlaneGeometry(200, 200, 0, 30);

    let material = new THREE.MeshPhongMaterial({ color: 0x120d01, side: THREE.DoubleSide });
    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    let texture = THREE.ImageUtils.loadTexture("./assets/textures/road.jpg");

    let tree;

    geometry = new THREE.PlaneGeometry(8, 200, 0, 31);
    geometry.rotateX(-Math.PI * 0.5);
    material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
    let road = new THREE.Mesh(geometry, material);
    road.receiveShadow = true;
    road.position.x = 1.3
    road.position.y = 0.001
    scene.add(road);

    var offset_x = -3
    let loader = new THREE.GLTFLoader();

    loader.load('./assets/streetlight/scene.gltf', function (gltf) {
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

    loader.load('./assets/building1/scene.gltf', function (gltf) {
        car = gltf.scene;
        car.scale.set(250, 250, 350);
        // car.position.y = 1;
        car.position.x = 17;
        car.position.z = 40;
        car.rotateY(Math.PI * -0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }

        });
        scene.add(gltf.scene);
    });
    loader.load('./assets/building1/scene.gltf', function (gltf) {
        car = gltf.scene;
        car.scale.set(250, 250, 350);
        // car.position.y = 1;
        car.position.x = 17;
        car.position.z = 60;
        car.rotateY(Math.PI * -0.5)
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }

        });
        scene.add(gltf.scene);
    });

    loader.load('./assets/building1/scene.gltf', function (gltf) {
        car = gltf.scene;
        car.scale.set(250, 250, 350);
        // car.position.y = 1;
        car.position.x = -14;
        car.position.z = -30;
        car.rotateY(Math.PI * 0.5)
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

    scene.add(new THREE.AxesHelper());

    document.body.appendChild(renderer.domElement);

    window.addEventListener('wheel', onMouseWheel, false);



}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function onMouseWheel(event) {
    camera.position.z += event.deltaY / 10;
}
