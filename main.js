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

	const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'data/DSC_2222-cropped.jpg') });
	const rotatingBox = new THREE.Mesh(
		new THREE.BoxGeometry(0.8, 0.8, 0.8), materials);

	boxGroup = new THREE.Group();
	boxGroup.position.z = - 2;
	boxGroup.add(rotatingBox);
	scene.add(boxGroup);

	function onSelect() {

	// 	ballGroup.position.set(0, 0, - 2).applyMatrix4(controller.matrixWorld);
	// 	ballGroup.quaternion.setFromRotationMatrix(controller.matrixWorld);

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

	// boxGroup.rotation.x += 0.01;
	boxGroup.rotation.y -= 0.015 / 4;
	renderer.render(scene, camera);

}