    Document.addEventListener("DOMContentLoaded", () => {
    const triggerImages = document.querySelectorAll(".trigger-image");
    const modelModal = document.getElementById("modelModal");
    const closeButton = document.getElementById("closeButton");
    const modelContainer = document.getElementById("modelContainer");
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const notAvailable = document.getElementById("notAvailable");
    const voiceButton = document.getElementById("voiceButton");

    function initialize3DModel() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xadd8e6);
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        modelContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5).normalize();
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(-10, 10, 10);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight2.position.set(10, -10, -10);
        scene.add(pointLight2);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 20;

        const loader = new THREE.GLTFLoader();
        loader.load(
            'tree.glb',
            function(gltf) {
                const model = gltf.scene;
                model.scale.set(3, 3, 3);
                model.position.set(0, -6, 0);
                scene.add(model);
                controls.minPolarAngle = Math.PI / 2;
                controls.maxPolarAngle = Math.PI / 2;
                model.rotation.y = Math.PI / 4;
            },
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error) {
                console.error('An error happened', error);
            }
        );

        camera.position.set(0, 5, 10);
        controls.update();

        const animate = function() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();
    }

    triggerImages.forEach((image) => {
        image.addEventListener('click', () => {
            const altText = image.alt.toLowerCase();
            if (altText.includes("neem")) {
                modelModal.style.display = 'block';
                initialize3DModel();
            } else {
                modelModal.style.display = 'none';
            }
        });
    });

    closeButton.addEventListener('click', () => {
        modelModal.style.display = 'none';
        while (modelContainer.firstChild) {
            modelContainer.removeChild(modelContainer.firstChild);
        }
        window.speechSynthesis.cancel(); // Stop speaking when modal is closed
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        let found = false;

        triggerImages.forEach((image) => {
            const imageName = image.dataset.name.toLowerCase();
            const altText = image.alt.toLowerCase();
            const container = image.parentElement;

            if (imageName.includes(query) || altText.includes(query)) {
                container.style.display = 'block';
                found = true;
            } else {
                container.style.display = 'none';
            }
        });

        notAvailable.style.display = found ? 'none' : 'block';
    });

    // Voice synthesis functionality
    voiceButton.addEventListener('click', () => {
        const speak1Text = document.getElementById('speak1').innerText;
        const speak2Text = document.getElementById('speak2').innerText;
        const combinedText = speak1Text + " " + speak2Text;
        const utterance = new SpeechSynthesisUtterance(combinedText);

        // Set voice parameters
        utterance.lang = 'en-US'; // You can change this to other languages if needed
        utterance.rate = 1; // Speed of the speech
        utterance.pitch = 1; // Pitch of the speech

        window.speechSynthesis.speak(utterance);
    });
});