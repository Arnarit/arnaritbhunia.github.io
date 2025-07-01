document.addEventListener('DOMContentLoaded', () => {

// --- THREE.JS 3D ANIMATION --- //
const container = document.getElementById('canvas-container');
let scene, camera, renderer, shape, stars;

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Main Animated Shape
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x9333ea, 
        emissive: 0x3b82f6, 
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true,
    });
    shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Starfield for "Space Travel" effect
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7
    });
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);


    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    camera.position.z = 5;

    // Animate
    animate();
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
});

function animate() {
    requestAnimationFrame(animate);
    shape.rotation.x += 0.001;
    shape.rotation.y += 0.001;

    // Animate stars for "deep peace" feeling
    stars.rotation.y += 0.0001;

    // Interactive camera movement
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
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


// --- SCROLL REVEAL ANIMATION --- //
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


// --- CERTIFICATE MODAL --- //
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




