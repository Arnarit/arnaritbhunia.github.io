document.addEventListener('DOMContentLoaded', () => {

// --- THREE.JS 3D ANIMATION --- //
const container = document.getElementById('canvas-container');
let scene, camera, renderer, shape, stars, planets, lasers;

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // --- Main Animated Shape ---
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x9333ea,
        emissive: 0x3b82f6,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true,
    });
    shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // --- Space Travel Starfield ---
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.8
    });
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // --- Flowing Lasers ---
    lasers = [];
    for (let i = 0; i < 50; i++) {
        const laserGeometry = new THREE.BufferGeometry();
        const laserPositions = new Float32Array(2 * 3); // 2 vertices, 3 coordinates each
        laserPositions[0] = (Math.random() - 0.5) * 50;
        laserPositions[1] = (Math.random() - 0.5) * 50;
        laserPositions[2] = (Math.random() - 0.5) * 1000;
        laserPositions[3] = laserPositions[0];
        laserPositions[4] = laserPositions[1];
        laserPositions[5] = laserPositions[2] - 50; // Length of the laser
        
        laserGeometry.setAttribute('position', new THREE.BufferAttribute(laserPositions, 3));
        const laserMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
        const laser = new THREE.Line(laserGeometry, laserMaterial);
        lasers.push(laser);
        scene.add(laser);
    }
    
    // --- Distant Celestial Bodies ---
    planets = [];
    const planetGeometries = [
        new THREE.SphereGeometry(15, 16, 16),
        new THREE.SphereGeometry(10, 16, 16),
        new THREE.SphereGeometry(8, 16, 16)
    ];
    const planetMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.6 }),
        new THREE.MeshStandardMaterial({ color: 0x45b7d1, metalness: 0.3, roughness: 0.4 })
    ];
    
    for(let i=0; i<3; i++) {
        const planet = new THREE.Mesh(planetGeometries[i], planetMaterials[i]);
        planet.position.x = (Math.random() - 0.5) * 800;
        planet.position.y = (Math.random() - 0.5) * 400;
        planet.position.z = - (Math.random() * 800 + 400);
        planets.push(planet);
        scene.add(planet);
    }

    // --- Dynamic Lighting ---
    const pointLight1 = new THREE.PointLight(0x9333ea, 1.5, 500);
    pointLight1.position.set(100, 100, -100);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x3b82f6, 2, 600);
    pointLight2.position.set(-200, -100, -300);
    scene.add(pointLight2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    camera.position.z = 5;

    animate();
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
});

function animate() {
    requestAnimationFrame(animate);

    // Main shape rotation
    shape.rotation.x += 0.001;
    shape.rotation.y += 0.0015;

    // --- Space Travel Animation ---
    const positions = stars.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        // Move stars towards the camera
        positions[i + 2] += 4;
        
        // If a star passes the camera, reset it to the back
        if (positions[i + 2] > camera.position.z) {
            positions[i + 2] = -1000;
        }
    }
    stars.geometry.attributes.position.needsUpdate = true;
    
    // --- Flowing Laser Animation ---
    lasers.forEach(laser => {
        laser.position.z += 10;
        if (laser.position.z > camera.position.z) {
            laser.position.z = -1000;
            laser.position.x = (Math.random() - 0.5) * 50;
            laser.position.y = (Math.random() - 0.5) * 50;
        }
    });

    // --- Distant Planet Animation ---
    planets.forEach(planet => {
        planet.rotation.y += 0.0008;
        planet.rotation.x += 0.0002;
    });

    // Interactive camera movement for a "looking around" feel
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
init3D();

// --- SCROLL REVEAL ANIMATION (NO CHANGE) --- //
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
});

// --- CERTIFICATE MODAL (NO CHANGE) --- //
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const certItems = document.querySelectorAll('.cert-item');
const closeModal = document.querySelector(".close-modal");

certItems.forEach(item => {
    item.addEventListener('click', () => {
        modal.style.display = "flex";
        modalImg.src = item.dataset.cert;
    });
});

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

});




