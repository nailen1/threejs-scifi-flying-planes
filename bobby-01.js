import * as THREE from "three";
import Stats from '../examples/jsm/libs/stats.module.js';
import { EffectComposer } from "../examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../examples/jsm/postprocessing/UnrealBloomPass.js";

const stats = new Stats();
document.body.appendChild(stats.dom);
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.y = 2;
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0;
bloomPass.strength = 2.0;
bloomPass.radius = 0;
composer.addPass(bloomPass);

function getSquare() {
    const x = Math.round(Math.random() * 30) - 15.5;
    const y = Math.round(Math.random()) * 4;
    const z = Math.round(Math.random() * -80) - 0.5;

    const squareGeo = new THREE.PlaneGeometry(2, 2);
    const colors = [0x156064, 0x00C49A, 0xF8E16C, 0xFFC2B4, 0xFFC2B4];
    const basicMat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(squareGeo, basicMat);
    mesh.position.set(x, y, z)
    mesh.rotation.x = 90 * Math.PI / 180;

    const limit = 81;
    const speed = 0.1;
    function update() {
        mesh.position.z += speed;
        if (mesh.position.z > 4) {
            mesh.position.z = -limit;
        }
    }
    return {
        mesh,
        update
    };
}

const squares = [];
const numSquares = 60;
for (let i = 0; i < numSquares; i++) {
    let square = getSquare();
    scene.add(square.mesh);
    squares.push(square);
}

function animate() {
    requestAnimationFrame(animate);
    squares.forEach(s => s.update());
    camera.rotation.z += 0.001;
    composer.render(scene, camera);
    stats.update();
}
animate();