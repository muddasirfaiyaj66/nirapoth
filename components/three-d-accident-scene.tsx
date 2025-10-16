"use client";

import { useEffect, useRef, useState } from "react";

// Three.js will be loaded dynamically
declare global {
  interface Window {
    THREE?: any;
  }
}

interface ThreeScene {
  scene: any;
  camera: any;
  renderer: any;
  cars: any[];
  animationId: number | null;
  debris: any[];
}

export function ThreeDAccidentScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accidentDetected, setAccidentDetected] = useState(false);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initializationAttempted.current || sceneRef.current) {
      return;
    }
    initializationAttempted.current = true;

    // Check if Three.js is already loaded
    if (window.THREE) {
      setIsLoaded(true);
      initializeScene();
      return;
    }

    // Load Three.js from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      if (window.THREE) {
        setIsLoaded(true);
        initializeScene();
      }
    };
    document.head.appendChild(script);

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (sceneRef.current?.renderer) {
        sceneRef.current.renderer.dispose();
        sceneRef.current.renderer.domElement.remove();
      }
      sceneRef.current = null;
    };
  }, []);

  const initializeScene = () => {
    if (!containerRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup with darker, more dramatic atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 20, 100);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(-12, 5, 8);
    camera.lookAt(0, 1, 0);

    // Renderer setup with enhanced shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light (simulating overhead lighting)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(-10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    // Rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.6);
    rimLight.position.set(10, 8, -10);
    scene.add(rimLight);

    // Spotlights for dramatic crash illumination
    const spotLight1 = new THREE.SpotLight(0xffffff, 2.0);
    spotLight1.position.set(-5, 10, 5);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.3;
    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 2048;
    spotLight1.shadow.mapSize.height = 2048;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 2.0);
    spotLight2.position.set(5, 10, 5);
    spotLight2.angle = Math.PI / 6;
    spotLight2.penumbra = 0.3;
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // Red emergency light at crash point
    const crashLight = new THREE.PointLight(0xff0000, 0);
    crashLight.position.set(0, 2, 0);
    scene.add(crashLight);

    const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    // Add subtle ground variation
    const positions = groundGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, Math.random() * 0.05);
    }
    groundGeometry.computeVertexNormals();

    scene.add(ground);

    // Road surface
    const roadGeometry = new THREE.PlaneGeometry(8, 40);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.02;
    road.receiveShadow = true;
    scene.add(road);

    // Road markings
    const markingGeometry = new THREE.PlaneGeometry(0.3, 2);
    const markingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      roughness: 0.8,
      emissive: 0xffff00,
      emissiveIntensity: 0.2,
    });

    for (let i = -8; i < 9; i++) {
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(0, 0.03, i * 2.5);
      scene.add(marking);
    }

    const createTrafficLight = (posX: number, posZ: number) => {
      const trafficLightGroup = new THREE.Group();

      // Pole
      const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 16);
      const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3,
      });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 2.5;
      pole.castShadow = true;
      trafficLightGroup.add(pole);

      // Light housing
      const housingGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.3);
      const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.7,
        roughness: 0.4,
      });
      const housing = new THREE.Mesh(housingGeometry, housingMaterial);
      housing.position.y = 5.3;
      housing.castShadow = true;
      trafficLightGroup.add(housing);

      // Red light
      const redLightGeometry = new THREE.CircleGeometry(0.15, 32);
      const redLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
      });
      const redLight = new THREE.Mesh(redLightGeometry, redLightMaterial);
      redLight.position.set(0, 5.7, 0.16);
      trafficLightGroup.add(redLight);

      // Yellow light
      const yellowLightGeometry = new THREE.CircleGeometry(0.15, 32);
      const yellowLightMaterial = new THREE.MeshStandardMaterial({
        color: 0x333300,
        emissive: 0xffff00,
        emissiveIntensity: 0,
      });
      const yellowLight = new THREE.Mesh(
        yellowLightGeometry,
        yellowLightMaterial
      );
      yellowLight.position.set(0, 5.3, 0.16);
      trafficLightGroup.add(yellowLight);

      // Green light
      const greenLightGeometry = new THREE.CircleGeometry(0.15, 32);
      const greenLightMaterial = new THREE.MeshStandardMaterial({
        color: 0x003300,
        emissive: 0x00ff00,
        emissiveIntensity: 0,
      });
      const greenLight = new THREE.Mesh(greenLightGeometry, greenLightMaterial);
      greenLight.position.set(0, 4.9, 0.16);
      trafficLightGroup.add(greenLight);

      trafficLightGroup.position.set(posX, 0, posZ);
      scene.add(trafficLightGroup);

      return { group: trafficLightGroup, redLight, yellowLight, greenLight };
    };

    const createSurveillanceCamera = (posX: number, posZ: number) => {
      const cameraGroup = new THREE.Group();

      // Camera pole
      const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 6, 16);
      const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.3,
      });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 3;
      pole.castShadow = true;
      cameraGroup.add(pole);

      // Camera housing
      const cameraBodyGeometry = new THREE.BoxGeometry(0.3, 0.25, 0.4);
      const cameraMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraMaterial);
      cameraBody.position.y = 6.2;
      cameraBody.castShadow = true;
      cameraGroup.add(cameraBody);

      // Camera lens
      const lensGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.2, 32);
      const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.05,
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 6.2, 0.3);
      cameraGroup.add(lens);

      // Camera LED indicator
      const ledGeometry = new THREE.CircleGeometry(0.03, 16);
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(0.12, 6.3, 0.1);
      led.rotation.y = Math.PI / 2;
      cameraGroup.add(led);

      cameraGroup.position.set(posX, 0, posZ);
      cameraGroup.rotation.y = Math.PI / 4;
      scene.add(cameraGroup);

      return { group: cameraGroup, led };
    };

    const createCivilianCar = (positionZ: number, rotationY: number) => {
      const carGroup = new THREE.Group();
      const carColor = 0x2c3e50; // Dark blue-gray (Audi color)

      // Main body with realistic proportions
      const chassisGeometry = new THREE.BoxGeometry(2.0, 0.5, 4.8);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: carColor,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
      const chassis = new THREE.Mesh(chassisGeometry, bodyMaterial);
      chassis.position.y = 0.7;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      carGroup.add(chassis);

      // Cabin
      const cabinGeometry = new THREE.BoxGeometry(1.9, 0.7, 2.5);
      const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
      cabin.position.y = 1.3;
      cabin.position.z = -0.2;
      cabin.castShadow = true;
      carGroup.add(cabin);

      // Hood
      const hoodGeometry = new THREE.BoxGeometry(1.95, 0.3, 1.6);
      const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
      hood.position.y = 0.85;
      hood.position.z = 1.9;
      hood.rotation.x = -0.1;
      hood.castShadow = true;
      carGroup.add(hood);

      const rearGeometry = new THREE.BoxGeometry(1.95, 0.4, 1.2);
      const rear = new THREE.Mesh(rearGeometry, bodyMaterial);
      rear.position.y = 0.8;
      rear.position.z = -2.2;
      rear.castShadow = true;
      carGroup.add(rear);

      const windshieldGeometry = new THREE.BoxGeometry(1.85, 0.75, 0.05);
      const windshieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.4,
        metalness: 0.9,
        roughness: 0.05,
      });
      const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
      windshield.position.y = 1.45;
      windshield.position.z = 1.1;
      windshield.rotation.x = -0.35;
      windshield.castShadow = true;
      carGroup.add(windshield);

      const rearWindshieldGeometry = new THREE.BoxGeometry(1.85, 0.6, 0.05);
      const rearWindshield = new THREE.Mesh(
        rearWindshieldGeometry,
        windshieldMaterial
      );
      rearWindshield.position.y = 1.35;
      rearWindshield.position.z = -1.5;
      rearWindshield.rotation.x = 0.3;
      rearWindshield.castShadow = true;
      carGroup.add(rearWindshield);

      // Create rear windshield cracks (spider-web pattern)
      const crackMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      });
      const crackPoints = [];
      const crackCenter = new THREE.Vector3(0.2, 1.35, -1.52);

      // Radial cracks
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const length = 0.3 + Math.random() * 0.4;
        crackPoints.push(crackCenter);
        crackPoints.push(
          new THREE.Vector3(
            crackCenter.x + Math.cos(angle) * length,
            crackCenter.y + Math.sin(angle) * length * 0.5,
            crackCenter.z
          )
        );
      }

      const crackGeometry = new THREE.BufferGeometry().setFromPoints(
        crackPoints
      );
      const cracks = new THREE.LineSegments(crackGeometry, crackMaterial);
      carGroup.add(cracks);

      // Audi-style grille
      const grilleGeometry = new THREE.BoxGeometry(1.6, 0.4, 0.1);
      const grilleMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.8,
        roughness: 0.3,
      });
      const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
      grille.position.set(0, 0.65, 2.6);
      carGroup.add(grille);

      // Audi rings
      const ringGeometry = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.05,
      });

      for (let i = 0; i < 4; i++) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(-0.45 + i * 0.3, 0.65, 2.65);
        ring.rotation.y = Math.PI / 2;
        carGroup.add(ring);
      }

      // Headlights
      const headlightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.15);
      const headlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffee,
        emissiveIntensity: 1.5,
        metalness: 0.9,
        roughness: 0.05,
      });

      const leftHeadlight = new THREE.Mesh(
        headlightGeometry,
        headlightMaterial
      );
      leftHeadlight.position.set(-0.7, 0.7, 2.55);
      carGroup.add(leftHeadlight);

      const rightHeadlight = leftHeadlight.clone();
      rightHeadlight.position.x = 0.7;
      carGroup.add(rightHeadlight);

      const taillightGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.1);
      const taillightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.9,
        roughness: 0.1,
      });

      const leftTaillight = new THREE.Mesh(
        taillightGeometry,
        taillightMaterial
      );
      leftTaillight.position.set(-0.7, 0.7, -2.5);
      carGroup.add(leftTaillight);

      const rightTaillight = leftTaillight.clone();
      rightTaillight.position.x = 0.7;
      carGroup.add(rightTaillight);

      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2,
      });

      const tireGeometry = new THREE.CylinderGeometry(0.52, 0.52, 0.4, 32);
      const tireMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.1,
        roughness: 0.98,
      });

      const wheels: any[] = [];
      const wheelPositions = [
        { x: -0.85, z: 1.5 },
        { x: 0.85, z: 1.5 },
        { x: -0.85, z: -1.5 },
        { x: 0.85, z: -1.5 },
      ];

      wheelPositions.forEach((pos) => {
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(pos.x, 0.52, pos.z);
        tire.castShadow = true;
        carGroup.add(tire);

        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, 0.52, pos.z);
        wheel.castShadow = true;
        carGroup.add(wheel);
        wheels.push(wheel);
      });

      // Front bumper
      const frontBumperGeometry = new THREE.BoxGeometry(2.1, 0.3, 0.4);
      const frontBumper = new THREE.Mesh(frontBumperGeometry, bodyMaterial);
      frontBumper.position.y = 0.35;
      frontBumper.position.z = 2.7;
      frontBumper.castShadow = true;
      carGroup.add(frontBumper);

      const rearBumperGeometry = new THREE.BoxGeometry(2.1, 0.3, 0.4);
      const rearBumper = new THREE.Mesh(rearBumperGeometry, bodyMaterial);
      rearBumper.position.y = 0.35;
      rearBumper.position.z = -2.7;
      rearBumper.castShadow = true;
      carGroup.add(rearBumper);

      carGroup.position.z = positionZ;
      carGroup.rotation.y = rotationY;
      scene.add(carGroup);

      return {
        group: carGroup,
        body: chassis,
        cabin: cabin,
        wheels: wheels,
        hood: hood,
        rear: rear,
        frontBumper: frontBumper,
        rearBumper: rearBumper,
        windshield: windshield,
        rearWindshield: rearWindshield,
        cracks: cracks,
        leftHeadlight: leftHeadlight,
        rightHeadlight: rightHeadlight,
        leftTaillight: leftTaillight,
        rightTaillight: rightTaillight,
      };
    };

    const createDebris = () => {
      const debrisArray = [];

      // Glass shards
      for (let i = 0; i < 50; i++) {
        const shardGeometry = new THREE.TetrahedronGeometry(
          0.05 + Math.random() * 0.1,
          0
        );
        const shardMaterial = new THREE.MeshStandardMaterial({
          color: 0x88ccff,
          transparent: true,
          opacity: 0.6,
          metalness: 0.9,
          roughness: 0.1,
        });
        const shard = new THREE.Mesh(shardGeometry, shardMaterial);
        shard.position.set(
          (Math.random() - 0.5) * 0.5,
          0.5 + Math.random() * 2,
          (Math.random() - 0.5) * 0.5
        );
        shard.castShadow = true;
        shard.visible = false;
        scene.add(shard);

        debrisArray.push({
          mesh: shard,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            Math.random() * 6 + 3,
            (Math.random() - 0.5) * 8
          ),
          rotation: new THREE.Vector3(
            Math.random() * 0.3,
            Math.random() * 0.3,
            Math.random() * 0.3
          ),
          type: "glass",
        });
      }

      // Metal fragments
      for (let i = 0; i < 30; i++) {
        const fragmentGeometry = new THREE.BoxGeometry(
          0.1 + Math.random() * 0.2,
          0.05 + Math.random() * 0.1,
          0.1 + Math.random() * 0.2
        );
        const fragmentMaterial = new THREE.MeshStandardMaterial({
          color: 0x2c3e50,
          metalness: 0.9,
          roughness: 0.3,
        });
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        fragment.position.set(
          (Math.random() - 0.5) * 0.5,
          0.5 + Math.random() * 2,
          (Math.random() - 0.5) * 0.5
        );
        fragment.castShadow = true;
        fragment.visible = false;
        scene.add(fragment);

        debrisArray.push({
          mesh: fragment,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 6
          ),
          rotation: new THREE.Vector3(
            Math.random() * 0.2,
            Math.random() * 0.2,
            Math.random() * 0.2
          ),
          type: "metal",
        });
      }

      return debrisArray;
    };

    const frontCar = createCivilianCar(3, 0);
    const rearCar = createCivilianCar(-5, 0);
    const debris = createDebris();

    const groundDebris: any[] = [];
    for (let i = 0; i < 20; i++) {
      const pieceGeometry = new THREE.BoxGeometry(
        0.05 + Math.random() * 0.15,
        0.02,
        0.05 + Math.random() * 0.15
      );
      const pieceMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x88ccff : 0x333333,
        metalness: 0.7,
        roughness: 0.4,
      });
      const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
      piece.position.set(
        (Math.random() - 0.5) * 4,
        0.05,
        (Math.random() - 0.5) * 4
      );
      piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      piece.castShadow = true;
      piece.receiveShadow = true;
      piece.visible = false;
      scene.add(piece);
      groundDebris.push(piece);
    }

    const trafficLight = createTrafficLight(5, 5);
    const surveillanceCamera = createSurveillanceCamera(-6, 3);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      cars: [frontCar, rearCar],
      animationId: null,
      debris: debris,
    };

    let cycleTime = 0;
    const cycleDuration = 12;
    let debrisActive = false;
    let collisionDetected = false;
    const COLLISION_THRESHOLD = 2.8; // Distance threshold for collision detection

    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);

      cycleTime += 0.016;
      if (cycleTime > cycleDuration) {
        cycleTime = 0;
        debrisActive = false;
        collisionDetected = false;
        setAccidentDetected(false);
        // Reset debris
        debris.forEach((d) => {
          d.mesh.visible = false;
          d.mesh.position.set(
            (Math.random() - 0.5) * 0.5,
            0.5 + Math.random() * 2,
            (Math.random() - 0.5) * 0.5
          );
        });
        groundDebris.forEach((p) => {
          p.visible = false;
        });
      }

      const distanceBetweenCars =
        frontCar.group.position.z - rearCar.group.position.z;

      if (
        !collisionDetected &&
        distanceBetweenCars <= COLLISION_THRESHOLD &&
        rearCar.group.position.z > -4
      ) {
        collisionDetected = true;
        setAccidentDetected(true);
        console.log(
          "[v0] Collision detected! Distance:",
          distanceBetweenCars.toFixed(2)
        );
      }

      if (cycleTime < 3) {
        const progress = cycleTime / 3;

        // Front car stopped at traffic light
        frontCar.group.position.z = 3;
        frontCar.leftTaillight.material.emissiveIntensity = 1.5; // Brake lights on
        frontCar.rightTaillight.material.emissiveIntensity = 1.5;

        // Rear car approaching
        rearCar.group.position.z = -5 + progress * 6;

        // Wheel rotation
        rearCar.wheels.forEach((w) => (w.rotation.x += 0.2));

        // Reset deformation
        frontCar.rear.scale.set(1, 1, 1);
        frontCar.rearBumper.scale.set(1, 1, 1);
        frontCar.cabin.scale.set(1, 1, 1);
        rearCar.hood.scale.set(1, 1, 1);
        rearCar.frontBumper.scale.set(1, 1, 1);
        frontCar.rear.rotation.x = 0;
        rearCar.hood.rotation.x = -0.1;

        crashLight.intensity = 0;

        // Traffic light red
        trafficLight.redLight.material.emissiveIntensity = 1.5;
        trafficLight.yellowLight.material.emissiveIntensity = 0;
        trafficLight.greenLight.material.emissiveIntensity = 0;

        // Camera LED blinking
        surveillanceCamera.led.material.emissiveIntensity =
          Math.sin(cycleTime * 10) > 0 ? 2.0 : 0.5;
      } else if (cycleTime < 7) {
        const impactTime = cycleTime - 3;

        // Cars at collision point
        frontCar.group.position.z = 3;
        rearCar.group.position.z = 1;

        if (!debrisActive && impactTime > 0.1) {
          debrisActive = true;
          debris.forEach((d) => (d.mesh.visible = true));
          groundDebris.forEach((p) => (p.visible = true));
        }

        // Violent shake
        const shake =
          Math.sin(impactTime * 30) * 0.25 * Math.exp(-impactTime * 1.5);
        frontCar.group.position.y = Math.abs(shake);
        rearCar.group.position.y = Math.abs(shake) * 0.7;

        // Severe rotation from rear impact
        const crashRot =
          Math.sin(impactTime * 25) * 0.15 * Math.exp(-impactTime * 1.8);
        frontCar.group.rotation.z = crashRot;
        rearCar.group.rotation.z = -crashRot * 0.6;
        frontCar.group.rotation.x = Math.abs(crashRot) * 0.5;
        rearCar.group.rotation.x = Math.abs(crashRot) * 0.8;

        // Severe deformation - rear of front car, front of rear car
        const crumple = Math.min(impactTime * 0.6, 1);

        // Front car rear damage
        frontCar.rear.scale.set(1, 1 - crumple * 0.6, 1 - crumple * 0.85);
        frontCar.rearBumper.scale.set(1, 1 - crumple * 0.7, 1 - crumple * 0.9);
        frontCar.cabin.scale.set(1, 1 - crumple * 0.15, 1);
        frontCar.rear.rotation.x = crumple * 0.4;

        // Rear car front damage
        rearCar.hood.scale.set(1, 1 - crumple * 0.7, 1 - crumple * 0.85);
        rearCar.frontBumper.scale.set(1, 1 - crumple * 0.6, 1 - crumple * 0.9);
        rearCar.hood.rotation.x = -0.1 - crumple * 0.6;

        // Headlight/taillight damage
        const flicker = Math.random() > 0.6 ? 1 : 0;
        frontCar.leftTaillight.material.emissiveIntensity =
          1.5 * flicker * (1 - crumple);
        frontCar.rightTaillight.material.emissiveIntensity =
          1.5 * flicker * (1 - crumple * 0.8);
        rearCar.leftHeadlight.material.emissiveIntensity =
          1.5 * flicker * (1 - crumple);
        rearCar.rightHeadlight.material.emissiveIntensity =
          1.5 * flicker * (1 - crumple * 0.7);

        // Windshield opacity (shattering effect)
        frontCar.rearWindshield.material.opacity = 0.4 - crumple * 0.3;
        rearCar.windshield.material.opacity = 0.4 - crumple * 0.25;

        // Intense crash lighting
        crashLight.intensity = 5 + Math.random() * 2;
        crashLight.color.setHex(0xff3300);
        crashLight.position.z = 2;

        // Traffic light stays red
        trafficLight.redLight.material.emissiveIntensity = 1.5;

        // Camera LED rapid blinking (detecting accident)
        if (collisionDetected) {
          surveillanceCamera.led.material.emissiveIntensity =
            Math.sin(impactTime * 50) > 0 ? 3.0 : 0.2;
        }

        // Debris physics
        debris.forEach((d) => {
          if (d.mesh.visible) {
            d.velocity.y -= 0.3; // Gravity
            d.mesh.position.add(d.velocity.clone().multiplyScalar(0.016));
            d.mesh.rotation.x += d.rotation.x;
            d.mesh.rotation.y += d.rotation.y;
            d.mesh.rotation.z += d.rotation.z;

            // Ground collision
            if (d.mesh.position.y < 0.1) {
              d.mesh.position.y = 0.1;
              d.velocity.y *= -0.3; // Bounce
              d.velocity.x *= 0.8;
              d.velocity.z *= 0.8;
            }
          }
        });
      } else {
        frontCar.group.position.z = 3;
        rearCar.group.position.z = 1;
        frontCar.group.position.y = 0;
        rearCar.group.position.y = 0;
        frontCar.group.rotation.z = 0;
        rearCar.group.rotation.z = 0;
        frontCar.group.rotation.x = 0;
        rearCar.group.rotation.x = 0;

        // Keep severe damage
        frontCar.rear.scale.set(1, 0.4, 0.15);
        frontCar.rearBumper.scale.set(1, 0.3, 0.1);
        frontCar.cabin.scale.set(1, 0.85, 1);
        rearCar.hood.scale.set(1, 0.3, 0.15);
        rearCar.frontBumper.scale.set(1, 0.4, 0.1);

        // Broken lights
        frontCar.leftTaillight.material.emissiveIntensity = 0;
        frontCar.rightTaillight.material.emissiveIntensity = 0;
        rearCar.leftHeadlight.material.emissiveIntensity = 0;
        rearCar.rightHeadlight.material.emissiveIntensity = 0;

        // Pulsing emergency light
        crashLight.intensity = 2 + Math.sin(cycleTime * 5) * 1.5;
        crashLight.color.setHex(0xff0000);
        crashLight.position.z = 2;

        // Traffic light stays red
        trafficLight.redLight.material.emissiveIntensity = 1.5;

        // Camera LED solid (accident recorded)
        if (collisionDetected) {
          surveillanceCamera.led.material.emissiveIntensity = 3.0;
        }

        // Debris settling
        debris.forEach((d) => {
          if (d.mesh.visible && d.mesh.position.y > 0.1) {
            d.velocity.y -= 0.3;
            d.mesh.position.add(d.velocity.clone().multiplyScalar(0.016));
            d.mesh.rotation.x += d.rotation.x * 0.5;
            d.mesh.rotation.y += d.rotation.y * 0.5;
            d.mesh.rotation.z += d.rotation.z * 0.5;

            if (d.mesh.position.y < 0.1) {
              d.mesh.position.y = 0.1;
              d.velocity.set(0, 0, 0);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/30 shadow-2xl overflow-hidden"
      style={{ position: "relative" }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-foreground">
              Loading Crash Scene...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Initializing 3D Environment
            </p>
          </div>
        </div>
      )}

      {accidentDetected && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-600/95 backdrop-blur-sm text-white px-8 py-4 rounded-lg shadow-2xl border-2 border-red-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <div>
              <p className="text-2xl font-bold">ACCIDENT DETECTED</p>
              <p className="text-sm opacity-90">
                Rear-End Collision • Emergency Services Notified
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
