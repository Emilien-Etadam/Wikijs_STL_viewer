<script>
window.addEventListener("load", function () {
  console.log("Initializing STL viewer with balanced lighting...");

  function computeSharpEdges(geometry, thresholdAngle) {
    const edges = new THREE.EdgesGeometry(geometry, thresholdAngle);
    return edges;
  }

  function initSTLViewer(containerId, src) {
    console.log(`Calling initSTLViewer with containerId: ${containerId} and src: ${src}`);

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    console.log(`Container dimensions - Width: ${width}, Height: ${height}`);

    // Scene
    const scene = new THREE.Scene();
    console.log("Scene created.");

    // Scene background in dark gray
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x2d2d2d); // Dark gray
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    console.log("Renderer initialized with dark gray background.");

    // Orthographic Camera
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -50 * aspect, 50 * aspect, 50, -50, 0.1, 1000
    );
    camera.position.set(100, 100, 100); // Initial isometric view
    camera.lookAt(0, 0, 0);
    console.log("Orthographic camera configured.");

// Combined Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Light ambient
scene.add(ambientLight);

// First directional light
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5); // Soft directional light
directionalLight1.position.set(50, 50, 50);
scene.add(directionalLight1);

// Second directional light (opposite)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Soft directional light
directionalLight2.position.set(-50, -50, -50);
scene.add(directionalLight2);

console.log("Ambient and two directional lights added to the scene.");


    // STL Loader
    const loader = new THREE.STLLoader();
    console.log("Starting STL file loading:", src);

    loader.load(
      src,
      function (geometry) {
        console.log("STL file loaded successfully:", geometry);

        // Center the model
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
        const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
        const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;
        geometry.translate(-centerX, -centerY, -centerZ);

        // Material for the STL model (light gray with slight shine)
        const phongMaterial = new THREE.MeshPhongMaterial({
          color: 0xd3d3d3, // Light gray
          shininess: 50, // Slight shine
          specular: 0x666666, // Soft reflection
        });
        const mesh = new THREE.Mesh(geometry, phongMaterial);
        scene.add(mesh);
        console.log("Mesh with light gray material added to the scene:", mesh);

        // Compute and display sharp edges
        const sharpEdges = computeSharpEdges(geometry, Math.PI * 5); // Threshold at 30° (in radians)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edgesMesh = new THREE.LineSegments(sharpEdges, lineMaterial);
        scene.add(edgesMesh);
        console.log("Sharp edges added to the scene:", edgesMesh);

        // Adjust orthographic camera limits based on the model
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        camera.left = -maxDim * aspect / 2;
        camera.right = maxDim * aspect / 2;
        camera.top = maxDim / 2;
        camera.bottom = -maxDim / 2;
        camera.updateProjectionMatrix();
        console.log("Camera limits adjusted to the model.");
      },
      function (xhr) {
        console.log(
          `STL file loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`
        );
      },
      function (error) {
        console.error("Error loading STL file:", error);
      }
    );

    // Controls with full rotation
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true; // Allow rotation
    controls.target.set(0, 0, 0); // Center of rotation
    controls.enableZoom = true; // Allow zoom
    console.log("OrbitControls initialized with full rotation.");

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    console.log("Animation started.");
  }

  // Initialize all STL viewers on the page
  const viewers = document.querySelectorAll(".stl-viewer");
  console.log(`Number of detected containers: ${viewers.length}`);

  viewers.forEach(function (container, index) {
    const src = container.getAttribute("data-src");
    if (!src) {
      console.error(
        `No 'data-src' attribute found for STL viewer container ${index}`
      );
      return;
    }

    console.log(`Initializing container ${index} with source: ${src}`);

    const id =
      container.id || `stl-viewer-${Math.random().toString(36).substr(2, 9)}`;
    container.id = id;
    initSTLViewer(id, src);
  });
});
</script>
