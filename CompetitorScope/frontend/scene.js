// Mentor Node: Wrapping Three.js scene creation in a try/catch block ensures
// that if WebGL is disabled or unsupported, the website degrades gracefully
// without breaking the search page functionality.
(function initThreeBackground() {
  try {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all globe elements for easy rotation/interaction
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const colorCyan = new THREE.Color('#06B6D4');
    const colorViolet = new THREE.Color('#8B5CF6');

    // 4. Create a Glowing Particle Globe
    // We use a SphereGeometry to place points at the vertices
    const globeRadius = 160;
    const sphereGeom = new THREE.SphereGeometry(globeRadius, 24, 24);
    
    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    // Globe Points Material
    const pointsMaterial = new THREE.PointsMaterial({
      size: 5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colorViolet
    });

    const globePoints = new THREE.Points(sphereGeom, pointsMaterial);
    globeGroup.add(globePoints);

    // 5. Add wireframe grid lines
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: colorCyan,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const globeWireframe = new THREE.Mesh(sphereGeom, wireframeMaterial);
    globeGroup.add(globeWireframe);

    // 6. Add some orbital rings
    const ringGroup = new THREE.Group();
    globeGroup.add(ringGroup);

    const ringGeometry = new THREE.RingGeometry(globeRadius + 20, globeRadius + 22, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colorCyan,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.rotation.y = Math.PI / 6;
    ringGroup.add(ringMesh);

    // 7. Add Floating Background Particles (Stars)
    const starCount = 100;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Spread stars randomly around the scene
      starPositions[i * 3] = (Math.random() - 0.5) * 1200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200 - 300;

      // Color mix
      const mixedColor = colorCyan.clone().lerp(colorViolet, Math.random());
      starColors[i * 3] = mixedColor.r;
      starColors[i * 3 + 1] = mixedColor.g;
      starColors[i * 3 + 2] = mixedColor.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starSystem = new THREE.Points(starsGeometry, starMaterial);
    scene.add(starSystem);

    // 8. Mouse Move Interactivity (Parallax Effect)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
      // Normalize mouse coordinates to [-1, 1]
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 9. Animation Loop
    let animationId;
    let isPaused = false;

    function animate() {
      animationId = requestAnimationFrame(animate);
      if (isPaused) return;

      // Rotate the globe
      globeGroup.rotation.y += 0.002;
      globeGroup.rotation.x += 0.0005;

      // Rotate stars at a different speed
      starSystem.rotation.y += 0.0002;

      // Smooth mouse interaction (Lerp)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Adjust globe tilt based on mouse position
      globeGroup.position.x = targetX * 50;
      globeGroup.position.y = targetY * 30;
      globeGroup.rotation.z = targetX * 0.2;

      renderer.render(scene, camera);
    }

    animate();

    // 10. Handle Window Resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Expose helpers to toggle scene animation when search results are loaded
    window.ThreeBg = {
      pause: () => { 
        isPaused = true;
      },
      resume: () => { 
        isPaused = false; 
      }
    };

  } catch (error) {
    console.warn("Three.js initialization failed, degrading to CSS background:", error);
  }
})();
