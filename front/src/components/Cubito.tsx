import { useEffect, useRef } from "react";
import * as THREE from "three";

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : fallback
}

export default function CuboThree({ telemetry = {} }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionY: 0,
  })

  useEffect(() => {
    if (!mountRef.current) return;
    // escena
    const scene = new THREE.Scene();

    // cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // cubo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.18,
      roughness: 0.35,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);

    // loop
    const animate = () => {
      const target = stateRef.current;
      cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, target.rotationX, 0.08);
      cube.rotation.y = THREE.MathUtils.lerp(cube.rotation.y, target.rotationY, 0.08);
      cube.rotation.z = THREE.MathUtils.lerp(cube.rotation.z, target.rotationZ, 0.05);
      cube.position.y = THREE.MathUtils.lerp(cube.position.y, target.positionY, 0.08);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // cleanup (importante en React)
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const pitch = toNumber(telemetry.PITCH ?? telemetry["Inclinacion en X"], 0)
    const roll = toNumber(telemetry.ROLL ?? telemetry["Inclinacion en Y"], 0)
    const yawLike = toNumber(telemetry.GYRZ ?? telemetry["Aceleracion Angular en Z"], 0)
    const altitude = toNumber(telemetry.ALT ?? telemetry["Altitud"], 0)
    const verticalSpeed = toNumber(telemetry.VVEL ?? telemetry["Velocidad Vertical"], 0)

    stateRef.current.rotationX = THREE.MathUtils.clamp((pitch / 45) * Math.PI * 0.25, -0.9, 0.9)
    stateRef.current.rotationY = THREE.MathUtils.clamp((roll / 45) * Math.PI * 0.25, -0.9, 0.9)
    stateRef.current.rotationZ = THREE.MathUtils.clamp((yawLike / 90) * Math.PI * 0.18, -0.4, 0.4)
    stateRef.current.positionY = THREE.MathUtils.clamp((altitude / 1000) + (verticalSpeed / 25), -1.2, 1.2)
  }, [telemetry])

  return <div ref={mountRef} style={{ width: "100%", height: "220px" }} />;
}
