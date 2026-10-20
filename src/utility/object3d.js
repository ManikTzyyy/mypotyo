import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function initObject3D(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );

  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);

  // Spotlight (buat intensitas/jarak sesuai kebutuhan)
  const spotLight = new THREE.SpotLight(0xffffff, 20, 5, Math.PI / 20, 0.9);
  spotLight.position.set(0, 0, 3); // Posisi lampu di depan (seperti senter)
  spotLight.visible = false;

  scene.add(spotLight);
  scene.add(spotLight.target); // Target lampu yang akan digerakkan mengikuti mouse

  // Raycaster dan Vector untuk deteksi posisi mouse di 3D
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  // Buat bidang imajiner (plane) di z = 0 tempat model berada untuk acuan raycaster
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectPoint = new THREE.Vector3();

  // Model dan target rotasi
  let model = null;
  let animationId;

  const targetRotation = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Hitung posisi mouse dalam NDC (-1 sampai 1)
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Target rotasi model mengikuti posisi mouse
    targetRotation.y = mouse.x * 0.5;
    targetRotation.x = -mouse.y * 0.25;

    // Update Raycaster dari kamera berdasarkan posisi mouse
    raycaster.setFromCamera(mouse, camera);
    
    // Cari titik potong ray dengan bidang (plane)
    raycaster.ray.intersectPlane(plane, intersectPoint);

    // Ubah target spotlight ke titik kursor di dunia 3D
    if (intersectPoint) {
      spotLight.target.position.copy(intersectPoint);
    }

    spotLight.visible = true;
  }

  renderer.domElement.addEventListener("pointermove", onMouseMove);

  // Load model
  const loader = new GLTFLoader();

  loader.load(
    "/models/model.glb",
    (gltf) => {
      model = gltf.scene;
      model.position.set(0, -2.8, 0);
      model.scale.set(1, 1, 1);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Gagal memuat model 3D:", error);
    },
  );

  // Smooth rotation
  function animate() {
    animationId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const smoothness = 1 - Math.exp(-4 * delta);

    if (model) {
      model.rotation.y = THREE.MathUtils.lerp(
        model.rotation.y,
        targetRotation.y,
        smoothness,
      );

      model.rotation.x = THREE.MathUtils.lerp(
        model.rotation.x,
        targetRotation.x,
        smoothness,
      );
    }

    // Penting: Update matrix world untuk target spotlight setiap frame
    spotLight.target.updateMatrixWorld();

    renderer.render(scene, camera);
  }

  animate();

  // Responsive
  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  resizeObserver.observe(container);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener("pointermove", onMouseMove);

    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }

    renderer.dispose();
  };
}