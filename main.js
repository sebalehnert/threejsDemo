import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, controls, scene, renderer;
let controller;
let allGroup,
	boxGroup,
	textGroup;
let text = "Sebastian",
	font = undefined;

init();
animate();

function init() {

	const container = document.createElement('div');
	document.body.appendChild(container);

	scene = new THREE.Scene();
	allGroup = new THREE.Group();
	boxGroup = new THREE.Group();
	// allGroup.add(boxGroup);
	textGroup = new THREE.Group();
	allGroup.add(textGroup);
	allGroup.position.z = - 2;
	scene.add(allGroup);

	loadFont();
	createText();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.xr.enabled = true;
	container.appendChild(renderer.domElement);
	controls = new OrbitControls( camera, renderer.domElement );
	controls.update();

	document.body.appendChild(ARButton.createButton(renderer));

	const materials = [
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/1.jpg')
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/2.jpg')
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/3.jpg')
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/4.jpg')
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/5.jpg')
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('data/6.jpg')
		})
	];

	const rotatingBox = new THREE.Mesh(
		new THREE.BoxGeometry(0.8, 0.8, 0.8), materials);

	boxGroup.add(rotatingBox);

	function onSelect() {
		// 	ballGroup.position.set(0, 0, - 2).applyMatrix4(controller.matrixWorld);
		// 	ballGroup.quaternion.setFromRotationMatrix(controller.matrixWorld);
	}

	// controller = renderer.xr.getController(0);
	// controller.addEventListener('select', onSelect);
	// scene.add(controller);

	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	controls.update();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(render);

}

function render() {
	// boxGroup.rotation.x += 0.01;
	boxGroup.rotation.y -= 0.015 / 4;
	renderer.render(scene, camera);
}

function createText() {
	let textGeo = new TextGeometry(text, {
		font: font,

		size: 1,
		height: 0.3
		// curveSegments: curveSegments,

		// bevelThickness: bevelThickness,
		// bevelSize: bevelSize,
		// bevelEnabled: bevelEnabled
	});

	// textGeo.computeBoundingBox();
	// const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

	let materials = [
		new THREE.MeshPhongMaterial( { color: 0x222222, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0x222222 } ) // side
	];

	let textMesh1 = new THREE.Mesh(textGeo, materials);

	// textMesh1.position.x = centerOffset;
	// textMesh1.position.y = hover;
	// textMesh1.position.z = 0;

	// textMesh1.rotation.x = 0;
	// textMesh1.rotation.y = Math.PI * 2;

	textGroup.add(textMesh1);
}

function loadFont() {

	const loader = new FontLoader();
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (response) {
		font = response;
	});
}