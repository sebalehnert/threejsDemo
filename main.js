import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XREstimatedLight } from 'three/examples/jsm/webxr/XREstimatedLight.js';

let camera, scene, renderer;
let controller;
let defaultEnvironment;
let boxGroup;

init();
animate();

function init() {

	const container = document.createElement('div');
	document.body.appendChild(container);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

	// const defaultLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
	// defaultLight.position.set(0.5, 1, 0.25);
	// scene.add(defaultLight);

	//

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// renderer.outputEncoding = THREE.sRGBEncoding;
	// renderer.physicallyCorrectLights = true;
	renderer.xr.enabled = true;
	container.appendChild(renderer.domElement);

	// Don't add the XREstimatedLight to the scene initially.
	// It doesn't have any estimated lighting values until an AR session starts.

	// const xrLight = new XREstimatedLight(renderer);

	// xrLight.addEventListener('estimationstart', () => {

	// 	// Swap the default light out for the estimated one one we start getting some estimated values.
	// 	scene.add(xrLight);
	// 	scene.remove(defaultLight);

	// 	// The estimated lighting also provides an environment cubemap, which we can apply here.
	// 	if (xrLight.environment) {

	// 		scene.environment = xrLight.environment;

	// 	}

	// });

	// xrLight.addEventListener('estimationend', () => {

	// 	// Swap the lights back when we stop receiving estimated values.
	// 	scene.add(defaultLight);
	// 	scene.remove(xrLight);

	// 	// Revert back to the default environment.
	// 	scene.environment = defaultEnvironment;

	// });

	// //

	// new RGBELoader()
	// 	.setPath('textures/equirectangular/')
	// 	.load('royal_esplanade_1k.hdr', function (texture) {

	// 		texture.mapping = THREE.EquirectangularReflectionMapping;

	// 		defaultEnvironment = texture;

	// 		scene.environment = defaultEnvironment;

	// 	});

	//

	// In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
	document.body.appendChild(ARButton.createButton(renderer));

	//------------------
	// var materials = [
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	}),
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	}),
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	}),
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	}),
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	}),
	// 	new THREE.MeshLambertMaterial({
	// 		map: new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg')
	// 	})
	// ];

	//const material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'data/DSC_2222-cropped.jpg') } );
	//const texture1 = new THREE.TextureLoader().load('data/crate.gif');
	const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'data/DSC_2222-cropped.jpg') });
	const rotatingBox = new THREE.Mesh(
		new THREE.BoxGeometry(0.8, 0.8, 0.8), material);
	rotatingBox.position.y += 0.8;

	// const texture = new THREE.TextureLoader().load('data/crate.gif');
	const texture = new THREE.TextureLoader().load('data/DSC_2222-cropped.jpg');
	const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
	const material2 = new THREE.MeshBasicMaterial({ map: texture });
	var mesh = new THREE.Mesh(geometry, material2);
	// scene.add(mesh);

	boxGroup = new THREE.Group();
	boxGroup.position.z = - 2;
	boxGroup.add(rotatingBox);
	boxGroup.add(mesh);
	scene.add(boxGroup);

	//------------------

	// const ballGeometry = new THREE.SphereBufferGeometry(0.175, 32, 32);
	// const ballGroup = new THREE.Group();
	// ballGroup.position.z = - 2;

	// const rows = 3;
	// const cols = 3;

	// for (let i = 0; i < rows; i++) {

	// 	for (let j = 0; j < cols; j++) {

	// 		const ballMaterial = new THREE.MeshStandardMaterial({
	// 			color: 0xdddddd,
	// 			roughness: i / rows,
	// 			metalness: j / cols
	// 		});
	// 		const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
	// 		ballMesh.position.set((i + 0.5 - rows * 0.5) * 0.4, (j + 0.5 - cols * 0.5) * 0.4, 0);
	// 		ballGroup.add(ballMesh);

	// 	}

	// }

	// scene.add(ballGroup);

	//

	function onSelect() {

		ballGroup.position.set(0, 0, - 2).applyMatrix4(controller.matrixWorld);
		ballGroup.quaternion.setFromRotationMatrix(controller.matrixWorld);

	}

	controller = renderer.xr.getController(0);
	controller.addEventListener('select', onSelect);
	scene.add(controller);

	//

	window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
	renderer.setAnimationLoop(render);

}

function render() {

	boxGroup.rotation.x += 0.01;
	boxGroup.rotation.y += 0.015;
	renderer.render(scene, camera);

}