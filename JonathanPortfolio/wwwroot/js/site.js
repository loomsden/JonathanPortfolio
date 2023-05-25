// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.\

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';


// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const clampAbs = (num, max) => Math.min(Math.max(num, -max), max);


class CardSkewElement extends HTMLElement {
    constructor() {
        super();

        this.classList.add("skew-container")
   
        let card = document.createElement('div')
        card.className = "skew-feature border"
        let shine = document.createElement('div')
        shine.className = "shine"
        card.appendChild(shine)
        card.append(...this.childNodes)
        this.appendChild(card)

        let constrain = 600;
        let mouseOverContainer = this;
        let maxAngle = 0.45;
        function transforms(x, y) {
            let box = mouseOverContainer.getBoundingClientRect();
            let calcX = clampAbs((y - box.y - (box.height / 2)) / constrain, maxAngle);
            let calcY = clampAbs(-(x - box.x - (box.width / 2)) / constrain, maxAngle);

            return "perspective(100px) "
                + "   rotateX(" + calcX + "deg) "
                + "   rotateY(" + calcY + "deg) ";
        };

        function shineLocation(x, y) {
            let box = mouseOverContainer.getBoundingClientRect();
            let calcX = x - box.left - (box.width / 2);
            let calcY = y - box.top - (box.height / 2);

            return "translate(" + (calcX) + "px," + (calcY) + "px)";
        }

        function transformElement(xy) {
            mouseOverContainer.style.transform = transforms.apply(null, xy);
            shine.style.transform = shineLocation.apply(null, xy);
        }

        mouseOverContainer.onmouseenter = function () {
            shine.style.opacity = "0.85";
        }

        mouseOverContainer.onmousemove = function (e) {
            let xy = [e.clientX, e.clientY];
            
            window.requestAnimationFrame(function () {
                transformElement(xy);
            });
        };

        mouseOverContainer.onmouseleave = function () {
            shine.style.opacity = "0";
            mouseOverContainer.style.transform = "perspective(100px) "
                + "   rotateX(0deg) "
                + "   rotateY(0deg) ";
        }
    } 
}

customElements.define("skew-card", CardSkewElement);

class ProjectCard extends HTMLElement {
    constructor() {
        super();

        this.className = ""

        const imgContainer = this.appendChild(document.createElement("div"))
        imgContainer.className = "project-img"
        const img = imgContainer.appendChild(document.createElement("img"));
        img.src = this.hasAttribute("img")
            ? this.getAttribute("img")
            : "~/images/default.png";
        // Always include descriptive text when adding an image
        img.alt = this.hasAttribute("alt") ? this.getAttribute("alt") : "";
        img.style.width = "100 %;"
        img.style.objectFit = "contain;"

        const title = this.appendChild(document.createElement("h1"));
        title.className = "project-title";
        title.textContent = this.hasAttribute("title") ? this.getAttribute("title") : "Title Here";

        const type = this.appendChild(document.createElement("h2"));
        type.className = "project-type";
        type.textContent = this.hasAttribute("type") ? this.getAttribute("type") : "Type Here";

        const description = this.appendChild(document.createElement("p"));
        description.className = "project-description";
        description.textContent = this.hasAttribute("description") ? this.getAttribute("description") : "description Here";
    }
}

customElements.define("project-card", ProjectCard);


function gamesBig() {
    if (document.getElementById("games-col").classList.contains("big")) {
        document.getElementById("games-col").classList.remove("big");
        document.getElementById("science-col").classList.remove("small");

    } else {
        document.getElementById("games-col").classList.add("big");
        document.getElementById("games-col").classList.remove("small");

        document.getElementById("science-col").classList.add("small");
        document.getElementById("science-col").classList.remove("big");
    }
    
}

function scienceBig() {
    if (document.getElementById("science-col").classList.contains("big")) {
        document.getElementById("science-col").classList.remove("big");
        document.getElementById("games-col").classList.remove("small");
    } else {
        document.getElementById("science-col").classList.add("big");
        document.getElementById("science-col").classList.remove("small");

        document.getElementById("games-col").classList.add("small");
        document.getElementById("games-col").classList.remove("big");
    }
    
}


/*----------------JS FOR TEST----------------*/
// Scene
const scene = new THREE.Scene();

// Add a cube to the scene
/*const geometry = new THREE.BoxGeometry(3, 1, 3); // width, height, depth
const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);*/

scene.background = new THREE.Color(0xffffff);

// Set up lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 0); // x, y, z
scene.add(directionalLight);

/*
const loader = new GLTFLoader();
//loader.setPath('/images/');
loader.load('https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@glTFLoader/public/models/monkey.glb', function (gltf) {
    monkey = gltf.scene.children[0];
    monkey.scale.set(10, 10, 10);
    gltf.scene.traverse(c => {
        c.castShadow = true;
    });
    scene.add(gltf.scene);
});*/

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'images/JonLogo.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// Camera
const width = 10;
const height = width * (window.innerHeight / window.innerWidth);
const camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    1, // near
    100 // far
);

camera.position.set(4, 4, 4);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Add it to HTML
document.getElementById("home").appendChild(renderer.domElement);