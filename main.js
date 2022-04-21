import * as THREE from 'three';
import * as quicknoise from 'quick-perlin-noise-js'

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { TextBufferGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, controls, scene, renderer;
let controller;
let allGroup,
	boxGroup,
	textGroup;
let allTextMeshs,
	text = "Sebastian",
	font = undefined;
const numElements = 30;
let textTransforms = new Map();

init();
animate();

function init() {

	const container = document.createElement('div');
	document.body.appendChild(container);

	scene = new THREE.Scene();
	allGroup = new THREE.Group();
	boxGroup = new THREE.Group();
	allGroup.add(boxGroup);
	textGroup = new THREE.Group();
	allGroup.add(textGroup);
	allGroup.position.z = - 2;
	scene.add(allGroup);

	loadFont();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// renderer.xr.enabled = true;
	container.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, container);
	controls.listenToKeyEvents(window);
	controls.enabled = true;
	// controls.update();

	//-----
	controls.addEventListener('mousedown', myOnMouseDownFunction, false);
	function myOnMouseDownFunction(evt) {
		// evt.preventDefault();
		// var array = getMousePosition( contB1, evt.clientX, evt.clientY );
		// onClickPosition.fromArray( array );
		// var intersects = getIntersects( onClickPosition, sceneB1.children );
		// if ( intersects.length > 0 && intersects[ 0 ].uv ) {
		// 	 controls.enabled = false;
		// 	 var uv = intersects[ 0 ].uv;
		// 	 console.log(uv);
		// }else {
		// 	 controls.enabled = true;
		// }
		console.log("I am being called");
	}
	//-----

	// document.body.appendChild(ARButton.createButton(renderer));

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
		// 	all.position.set(0, 0, - 2).applyMatrix4(controller.matrixWorld);
		// 	allGroup.quaternion.setFromRotationMatrix(controller.matrixWorld);
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
	boxGroup.rotation.y -= 0.015 / 4;
	//textGroup.rotation.y -= 0.015 / 2;
	//textGroup.rotation.x -= 0.015 / 10;

	if (allTextMeshs) {
		let newTransforms = new Map();
		for (let [instance, matrix] of textTransforms.entries()) {

			var translation = new THREE.Vector3();
			translation.setFromMatrixPosition(matrix);

			translation.y = translation.y - (Math.random() * 0.002);
			if (translation.y < -1.5) {
				translation.y = 0.0;
			}
			translation.x = translation.x + (0.01 * quicknoise.noise(instance, translation.y, 0));

			let newMatrix = new THREE.Matrix4().makeTranslation(translation.x, translation.y, translation.z);
			newTransforms.set(instance, newMatrix);
			allTextMeshs.setMatrixAt(instance, newMatrix);

			if (instance == 0) {
				// console.log(translation);
				console.log( 0.001 * quicknoise.noise(0, translation.y, 0));
			}
		}
		textTransforms = newTransforms;
		allTextMeshs.instanceMatrix.needsUpdate = true;
	}

	renderer.render(scene, camera);
}

function createText() {
	if (font === undefined) {
		console.log("Font not loaded");
		return;
	}

	let textGeo = new TextGeometry(text, {
		font: font,

		size: 0.1,
		height: 0.03
		// curveSegments: curveSegments,

		// bevelThickness: bevelThickness,
		// bevelSize: bevelSize,
		// bevelEnabled: bevelEnabled
	});

	// textGeo.computeBoundingBox();
	// const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

	let materials = [
		new THREE.MeshBasicMaterial({ color: 0xff0000 }), // front
		new THREE.MeshBasicMaterial({ color: 0x444444 }) // side
	];

	allTextMeshs = new THREE.InstancedMesh(textGeo, materials, numElements);
	allTextMeshs.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
	for (let instance = 0; instance < numElements; instance++) {
		let textMatrix = new THREE.Matrix4().makeTranslation(0.1 * instance, -1.0, 0);
		textTransforms.set(instance, textMatrix);
		allTextMeshs.setMatrixAt(instance, textMatrix);
	}

	textGroup.add(allTextMeshs);
}

function loadFont() {

	const loader = new FontLoader();
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (response) {
		font = response;
		createText();
	});
}