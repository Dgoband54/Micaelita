'use strict';

(() => {
  // ========================================================
  // 1. DATOS DE RECUERDOS (15 Fotos + 3 Videos + Memes Flork)
  // ========================================================
  const MEMORIES_DATA = [
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-05.jpeg', title: 'Tú y yo', caption: 'Qué bonito encontrarnos en la misma historia.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-06.jpeg', title: 'De tu mano', caption: 'Así, a donde sea.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-07.jpeg', title: 'Mi luz favorita', caption: 'Tu risa le cambia el color al día.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-01.jpeg', title: 'Tu sonrisa', caption: 'Mi forma favorita de ver el mundo más bonito.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-09.jpeg', title: 'Cerquita de ti', caption: 'Justo donde me gusta estar.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-04.jpeg', title: 'Mi persona favorita', caption: 'De todas las casualidades, tú.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-02.jpeg', title: 'Lo simple, contigo', caption: 'Hasta elegir dulces se vuelve un plan perfecto.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-08.jpeg', title: 'El camino también cuenta', caption: 'El destino es lo de menos si vamos juntos.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-10.jpeg', title: 'Una flor para ti', caption: 'Hay detalles que guardan un mundo entero.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-12.jpeg', title: 'Mi mejor equipo', caption: 'Contigo, hasta quedarnos en casa es una aventura.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-11.jpeg', title: 'Pequeños tesoros', caption: 'Nuestra historia también vive en los detalles.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-03.jpeg', title: 'Esa ternura tuya', caption: 'Me enamoro también de tus pequeños gestos.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-13.jpeg', title: 'Celebrar contigo', caption: 'Quiero estar en tus días que brillan.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-14.jpeg', title: 'Compartir la alegría', caption: 'Y guardar un poquito de ella aquí.' },
    { type: 'photo', src: 'Micaela Resource/img/recuerdo-15.jpeg', title: 'Donde quiero quedarme', caption: 'En ese abrazo. Un ratito más.' },
    // Memes Flork especiales (como en Image 5)
    { type: 'photo', src: 'Micaela Resource/img/flork-te-amo.svg', title: 'Te amo ♡', caption: 'Vengo a recordarte que te amo con todo mi corazón.' },
    { type: 'photo', src: 'Micaela Resource/img/flork-recordar.svg', title: 'Por si se te olvida', caption: 'Vengo a recordarte por si se te olvida: te amo siempre.' }
  ];

  const SWEET_WORDS = [
    'MI CORAZÓN ES TUYO',
    'CONTIGO SIEMPRE',
    'AMOR ETERNO',
    'INFINITO',
    'TE AMO',
    'TÚ Y YO',
    'PARA SIEMPRE',
    'MI PERSONA FAVORITA',
    'MI LUZ FAVORITA',
    'EN ESTA VIDA Y EN TODAS'
  ];

  // ========================================================
  // 2. ELEMENTOS DEL DOM
  // ========================================================
  const container = document.getElementById('webgl-container');
  const introScreen = document.getElementById('pantalla-inicio');
  const btnIniciar = document.getElementById('boton-iniciar');
  const btnVerRecuerdos = document.getElementById('ver-recuerdos');
  const btnCerrarLista = document.getElementById('cerrar-lista');
  const drawerRecuerdos = document.getElementById('lista-recuerdos');
  const indiceRecuerdos = document.getElementById('indice-recuerdos');
  const dialogRecuerdo = document.getElementById('recuerdo-abierto');
  const contenidoRecuerdo = document.getElementById('contenido-recuerdo');
  const btnCerrarRecuerdo = document.getElementById('cerrar-recuerdo');
  const btnRecuerdoAnterior = document.getElementById('recuerdo-anterior');
  const btnRecuerdoSiguiente = document.getElementById('recuerdo-siguiente');
  const txtRecuerdoNumero = document.getElementById('recuerdo-numero');
  const txtRecuerdoTitulo = document.getElementById('recuerdo-titulo');
  const txtRecuerdoDesc = document.getElementById('recuerdo-descripcion');
  const dialogPromesa = document.getElementById('promesa');
  const btnCerrarPromesa = document.getElementById('cerrar-promesa');
  const btnMusica = document.getElementById('boton-musica-galaxia');

  let currentMemoryIndex = 0;
  let isAutoRotating = true;
  let musicPlaying = false;
  const audioPlayer = document.getElementById('musica-galaxia');

  // ========================================================
  // 3. TEXTURAS PROCEDURALES EN CANVAS (NITIDEZ ULTRA-HD)
  // ========================================================
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    // Núcleo brillante y nítido para estrellas definidas
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.42, 'rgba(235, 210, 255, 0.65)');
    grad.addColorStop(0.75, 'rgba(170, 90, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, '#fff0c0');
    grad.addColorStop(0.6, 'rgba(255, 210, 110, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  function createGlowSpriteTexture(colorCore, colorRim) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, colorCore);
    grad.addColorStop(0.35, colorRim);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }

  function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.font = 'bold 70px "DM Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Resplandor neón magenta/violeta nítido
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 512, 128);

    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 38;
    ctx.fillText(text, 512, 128);

    // Texto frontal blanco intenso y nítido
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 512, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  const particleTexture = createParticleTexture();
  const starTexture = createStarTexture();
  const purpleGlowTexture = createGlowSpriteTexture('rgba(195, 110, 255, 0.7)', 'rgba(120, 40, 220, 0.2)');
  const goldGlowTexture = createGlowSpriteTexture('rgba(255, 235, 160, 0.95)', 'rgba(255, 160, 40, 0.25)');

  // ========================================================
  // 4. CONFIGURACIÓN BÁSICA DE THREE.JS (ALTA DEFINICIÓN)
  // ========================================================
  const scene = new THREE.Scene();
  // Sin niebla para definición cristalina y máximo contraste espacial

  let width = window.innerWidth;
  let height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 8000);
  camera.position.set(0, 0, 300);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x06020c, 1);
  container.appendChild(renderer.domElement);
  renderer.setSize(width, height);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.85;
  controls.minDistance = 35;
  controls.maxDistance = 1400;
  controls.enabled = false; // Se activa tras la secuencia del túnel

  const interactiveMeshes = [];
  const textureLoader = new THREE.TextureLoader();

  // ========================================================
  // 5. SISTEMA DE PARTÍCULAS: EL TÚNEL DE COLORES (WARP TUNNEL)
  //    (Ultra-optimizado a 1,800 partículas con rotación GPU)
  // ========================================================
  const TUNNEL_PARTICLE_COUNT = 1200;
  const tunnelGeometry = new THREE.BufferGeometry();
  const tunnelPositions = new Float32Array(TUNNEL_PARTICLE_COUNT * 3);
  const tunnelColors = new Float32Array(TUNNEL_PARTICLE_COUNT * 3);
  const tunnelSizes = new Float32Array(TUNNEL_PARTICLE_COUNT);
  const tunnelSpeeds = new Float32Array(TUNNEL_PARTICLE_COUNT);

  // Paleta neón del túnel: Cyan (#00f5ff), Magenta (#ff1493), Amarillo oro (#ffd700), Violeta (#aa00ff)
  const tunnelPalette = [
    new THREE.Color(0x00f5ff), // Cyan eléctrico
    new THREE.Color(0xff1493), // Magenta / rosa neón
    new THREE.Color(0xffe600), // Amarillo brillante
    new THREE.Color(0xb53eff)  // Púrpura cósmico
  ];

  for (let i = 0; i < TUNNEL_PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 24 + Math.pow(Math.random(), 0.75) * 85;
    const z = -1400 + Math.random() * 1500;

    tunnelPositions[i * 3 + 0] = Math.cos(angle) * radius;
    tunnelPositions[i * 3 + 1] = Math.sin(angle) * radius;
    tunnelPositions[i * 3 + 2] = z;

    tunnelSpeeds[i] = 780 + Math.random() * 450;

    const col = tunnelPalette[Math.floor(Math.random() * tunnelPalette.length)];
    tunnelColors[i * 3 + 0] = col.r;
    tunnelColors[i * 3 + 1] = col.g;
    tunnelColors[i * 3 + 2] = col.b;

    tunnelSizes[i] = 2.8 + Math.random() * 3.5;
  }

  tunnelGeometry.setAttribute('position', new THREE.BufferAttribute(tunnelPositions, 3));
  tunnelGeometry.setAttribute('color', new THREE.BufferAttribute(tunnelColors, 3));
  tunnelGeometry.setAttribute('size', new THREE.BufferAttribute(tunnelSizes, 1));

  const tunnelMaterial = new THREE.PointsMaterial({
    size: 4.8,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const tunnelSystem = new THREE.Points(tunnelGeometry, tunnelMaterial);
  scene.add(tunnelSystem);

  // ========================================================
  // 6. SISTEMA DE LA GALAXIA ESPIRAL REALISTA (35,000 ESTRELLAS)
  //    (Imágenes 3, 4 y 5: Núcleo dorado, brazos magenta/lila/cyan)
  // ========================================================
  const GALAXY_COUNT = 16000;
  const galaxyGeometry = new THREE.BufferGeometry();
  const galaxyPositions = new Float32Array(GALAXY_COUNT * 3);
  const galaxyColors = new Float32Array(GALAXY_COUNT * 3);
  const galaxySizes = new Float32Array(GALAXY_COUNT);

  const ARMS = 4;
  const GALAXY_RADIUS = 280;

  for (let i = 0; i < GALAXY_COUNT; i++) {
    const armIndex = i % ARMS;
    const armAngle = (armIndex * Math.PI * 2) / ARMS;
    const rDist = Math.pow(Math.random(), 0.72) * GALAXY_RADIUS + 7;
    const spiralAngle = armAngle + Math.log(1 + rDist / 30) * 4.4 + (Math.random() - 0.5) * (0.35 + (rDist / GALAXY_RADIUS) * 0.4);

    const x = Math.cos(spiralAngle) * rDist;
    const z = Math.sin(spiralAngle) * rDist;
    const yDispersion = (Math.random() - 0.5) * 14 * Math.max(0.15, 1 - rDist / GALAXY_RADIUS);

    galaxyPositions[i * 3 + 0] = x;
    galaxyPositions[i * 3 + 1] = yDispersion;
    galaxyPositions[i * 3 + 2] = z;

    // Gradiente de color realista:
    // Centro: blanco cálido y oro intenso
    // Brazos medios: magenta, fucsia y lila
    // Brazos exteriores: azul cósmico, cyan y púrpura suave
    const normR = rDist / GALAXY_RADIUS;
    const col = new THREE.Color();
    if (normR < 0.18) {
      col.setHSL(0.12, 0.95, 0.75 + Math.random() * 0.25); // Oro/blanco
    } else if (normR < 0.65) {
      col.setHSL(0.82 + Math.random() * 0.12, 0.85, 0.62 + Math.random() * 0.2); // Magenta / lila
    } else {
      col.setHSL(0.55 + Math.random() * 0.25, 0.8, 0.55 + Math.random() * 0.25); // Cyan / azul
    }

    galaxyColors[i * 3 + 0] = col.r;
    galaxyColors[i * 3 + 1] = col.g;
    galaxyColors[i * 3 + 2] = col.b;

    galaxySizes[i] = 1.4 + Math.random() * 3.0;
  }

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMaterial = new THREE.PointsMaterial({
    size: 3.2,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const galaxySystem = new THREE.Points(galaxyGeometry, galaxyMaterial);

  // AGUJERO NEGRO Y DISCO DE ACRECIÓN DORADO EN EL CENTRO
  const galaxyGroup = new THREE.Group();
  galaxyGroup.add(galaxySystem);

  // Esfera de agujero negro (horizonte de eventos puro)
  const blackHoleGeo = new THREE.SphereGeometry(6.2, 32, 32);
  const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
  galaxyGroup.add(blackHole);

  // Anillo de acreción incandescente dorado
  const accretionGeo = new THREE.RingGeometry(6.4, 26, 64);
  const accretionMat = new THREE.MeshBasicMaterial({
    map: goldGlowTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const accretionDisk = new THREE.Mesh(accretionGeo, accretionMat);
  accretionDisk.rotation.x = Math.PI / 2;
  galaxyGroup.add(accretionDisk);

  // Halo central de resplandor
  const coreHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: goldGlowTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.85
  }));
  coreHalo.scale.set(65, 65, 1);
  galaxyGroup.add(coreHalo);

  scene.add(galaxyGroup);

  // ESTRELLAS DISTANTES DE FONDO (3,000 estrellas)
  const bgStarGeo = new THREE.BufferGeometry();
  const bgStarPos = new Float32Array(3000 * 3);
  for (let i = 0; i < 3000; i++) {
    const v = new THREE.Vector3(
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000
    );
    bgStarPos[i * 3 + 0] = v.x;
    bgStarPos[i * 3 + 1] = v.y;
    bgStarPos[i * 3 + 2] = v.z;
  }
  bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgStarPos, 3));
  const bgStarMat = new THREE.PointsMaterial({
    size: 2.2,
    map: starTexture,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const bgStars = new THREE.Points(bgStarGeo, bgStarMat);
  scene.add(bgStars);

  // ========================================================
  // 7. EL GRAN CORAZÓN BRILLANTE DE POLVO DE ESTRELLAS
  //    (Imagen 5: Majestuoso corazón rosa/magenta sobre la galaxia)
  // ========================================================
  const HEART_COUNT = 4800;
  const heartGeometry = new THREE.BufferGeometry();
  const heartPositions = new Float32Array(HEART_COUNT * 3);
  const heartTargetPositions = new Float32Array(HEART_COUNT * 3);
  const heartColors = new Float32Array(HEART_COUNT * 3);
  const heartSizes = new Float32Array(HEART_COUNT);

  // Ecuación paramétrica del corazón en 3D:
  // x = 16 * sin^3(t)
  // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
  const HEART_SCALE = 3.3;
  const HEART_BASE_Y = 58; // Altura sobre el centro de la galaxia

  for (let i = 0; i < HEART_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    // 60% en el contorno exterior brillante, 40% relleno volumétrico
    const isContour = i < HEART_COUNT * 0.6;
    const u = isContour ? (0.94 + Math.random() * 0.12) : (Math.pow(Math.random(), 0.6));

    const hx = 16 * Math.pow(Math.sin(t), 3) * HEART_SCALE * u;
    const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * HEART_SCALE * u + HEART_BASE_Y;
    const hz = (Math.random() - 0.5) * 16 * (1.1 - u * 0.4);

    heartTargetPositions[i * 3 + 0] = hx;
    heartTargetPositions[i * 3 + 1] = hy;
    heartTargetPositions[i * 3 + 2] = hz;

    // Inicialmente parten desde el núcleo del agujero negro para la erupción
    heartPositions[i * 3 + 0] = (Math.random() - 0.5) * 5;
    heartPositions[i * 3 + 1] = 0;
    heartPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

    // Paleta fucsia neón / magenta celestial / rosa brillante
    const col = new THREE.Color();
    if (isContour) {
      col.setHSL(0.91 + Math.random() * 0.05, 1.0, 0.65 + Math.random() * 0.25);
    } else {
      col.setHSL(0.86 + Math.random() * 0.12, 0.9, 0.55 + Math.random() * 0.3);
    }
    heartColors[i * 3 + 0] = col.r;
    heartColors[i * 3 + 1] = col.g;
    heartColors[i * 3 + 2] = col.b;

    heartSizes[i] = isContour ? (3.2 + Math.random() * 3.5) : (1.8 + Math.random() * 2.5);
  }

  heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
  heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

  const heartMaterial = new THREE.PointsMaterial({
    size: 4.2,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0, // Aparece en la fase HEART_RISE
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const heartSystem = new THREE.Points(heartGeometry, heartMaterial);
  scene.add(heartSystem);

  // Resplandor central del corazón
  const heartCenterGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: purpleGlowTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0
  }));
  heartCenterGlow.position.set(0, HEART_BASE_Y, 0);
  heartCenterGlow.scale.set(140, 140, 1);
  scene.add(heartCenterGlow);

  // Hitbox invisible para clic en el corazón
  const heartHitboxGeo = new THREE.SphereGeometry(38, 16, 16);
  const heartHitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const heartHitbox = new THREE.Mesh(heartHitboxGeo, heartHitboxMat);
  heartHitbox.position.set(0, HEART_BASE_Y, 0);
  heartHitbox.userData = { isHeart: true };
  scene.add(heartHitbox);
  interactiveMeshes.push(heartHitbox);

  // ========================================================
  // 8. ELEMENTOS EN ÓRBITA: FOTOS, VIDEOS, MEMES Y FRASES LINDAS
  //    (Imagen 5: Orbitando alrededor como un cosmos vivo)
  // ========================================================
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  // Función para crear tarjeta circular con borde resplandeciente
  function createOrbitalBadge(memory, index, total) {
    // 3 anillos de órbita concéntricos para distribución equilibrada
    const ringIndex = index % 3;
    const ringRadii = [135, 185, 235];
    const radius = ringRadii[ringIndex];
    const angle = (index / total) * Math.PI * 2 + ringIndex * 0.8;
    const yOffset = 15 + Math.sin(index * 1.5) * 22;

    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);

    // Marco exterior circular con borde brillante
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 128;
    frameCanvas.height = 128;
    const fctx = frameCanvas.getContext('2d');
    fctx.arc(64, 64, 58, 0, Math.PI * 2);
    fctx.lineWidth = 8;
    fctx.strokeStyle = '#ffffff';
    fctx.shadowColor = '#ff2e93';
    fctx.shadowBlur = 16;
    fctx.stroke();

    const frameTex = new THREE.CanvasTexture(frameCanvas);
    const frameGeo = new THREE.PlaneGeometry(26, 26);
    const frameMat = new THREE.MeshBasicMaterial({
      map: frameTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    group.add(frameMesh);

    // Foto / Sticker central
    const photoGeo = new THREE.CircleGeometry(11, 32);
    const photoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    textureLoader.load(
      memory.src,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        photoMat.map = tex;
        photoMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback visual en caso de restricciones de origen en local
        const fb = document.createElement('canvas');
        fb.width = 128;
        fb.height = 128;
        const b = fb.getContext('2d');
        b.fillStyle = '#2c1445';
        b.beginPath(); b.arc(64, 64, 60, 0, Math.PI * 2); b.fill();
        b.fillStyle = '#fce49f';
        b.font = 'bold 32px "DM Sans", sans-serif';
        b.textAlign = 'center'; b.textBaseline = 'middle';
        b.fillText('✦ ' + (index + 1), 64, 64);
        photoMat.map = new THREE.CanvasTexture(fb);
        photoMat.needsUpdate = true;
      }
    );

    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.userData = { memoryIndex: index, isMemory: true, title: memory.title };
    group.add(photoMesh);

    interactiveMeshes.push(photoMesh);

    // Metadatos para la animación orbital
    group.userData = {
      radius,
      angle,
      speed: 0.08 / Math.sqrt(radius),
      yBase: yOffset,
      yPhase: index * 0.9,
      photoMesh,
      frameMesh
    };

    orbitGroup.add(group);
  }

  MEMORIES_DATA.forEach((mem, idx) => {
    createOrbitalBadge(mem, idx, MEMORIES_DATA.length);
  });

  // FRASES LINDAS FLOTANTES EN 3D
  const wordSprites = [];
  SWEET_WORDS.forEach((word, idx) => {
    const tex = createTextTexture(word);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(65, 16.25, 1);

    const radius = 155 + (idx % 2) * 65;
    const angle = (idx / SWEET_WORDS.length) * Math.PI * 2 + 0.4;
    const y = 8 + (idx % 3) * 14;

    sprite.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    sprite.userData = {
      radius,
      angle,
      speed: 0.065 / Math.sqrt(radius),
      yBase: y,
      phase: idx * 1.3
    };

    orbitGroup.add(sprite);
    wordSprites.push(sprite);
  });

  // Visibilidad inicial optimizada para arranque instantáneo sin sobrecarga
  heartSystem.visible = false;
  heartCenterGlow.visible = false;
  heartHitbox.visible = false;
  orbitGroup.visible = false;

  // ========================================================
  // 9. MÁQUINA DE ESTADOS Y CONTROL DE LA SECUENCIA
  // ========================================================
  const STATE = {
    IDLE: 'idle',
    TUNNEL: 'tunnel',
    APPROACH: 'approach',
    HEART_RISE: 'heart_rise',
    EXPLORE: 'explore'
  };

  let currentState = STATE.IDLE;
  let stateTimer = 0;
  let heartRiseProgress = 0;
  let orbitRevealProgress = 0;

  function startSequence() {
    startMusic();
    introScreen.classList.add('is-leaving');
    setTimeout(() => {
      introScreen.style.display = 'none';
    }, 1200);

    currentState = STATE.TUNNEL;
    stateTimer = 0;
    heartRiseProgress = 0;
    orbitRevealProgress = 0;
    controls.enabled = false;

    // Coloca la cámara al inicio del túnel
    camera.position.set(0, 0, 80);
    camera.lookAt(0, 0, -500);

    tunnelSystem.visible = true;
    tunnelMaterial.opacity = 0.95;
    galaxyGroup.position.set(0, 0, -1150);
    galaxyGroup.scale.set(0.2, 0.2, 0.2);
    galaxyGroup.rotation.x = 0;

    heartSystem.visible = false;
    heartCenterGlow.visible = false;
    heartHitbox.visible = false;
    orbitGroup.visible = false;
    heartMaterial.opacity = 0;
    heartCenterGlow.material.opacity = 0;

  }

  btnIniciar.addEventListener('click', startSequence);

  // ========================================================
  // 10. BUCLE DE ANIMACIÓN PRINCIPAL (RENDER LOOP)
  // ========================================================
  let clock = new THREE.Clock();
  let animationFrameId = 0;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // ----------------------------------------------------
    // A. Actualización según el Estado de la Secuencia
    // ----------------------------------------------------
    if (currentState === STATE.TUNNEL) {
      stateTimer += delta;

      // 1. Animación del túnel de partículas (Ultra-ligera: solo Z + rotación GPU)
      const positions = tunnelGeometry.attributes.position.array;
      for (let i = 0; i < TUNNEL_PARTICLE_COUNT; i++) {
        const idx = i * 3 + 2;
        positions[idx] += tunnelSpeeds[i] * delta * 2.2;
        if (positions[idx] > 140) {
          positions[idx] = -1400;
        }
      }
      tunnelGeometry.attributes.position.needsUpdate = true;
      tunnelSystem.rotation.z += delta * 1.8;

      // Temblor de cámara cinematográfico y aceleración
      camera.rotation.z = Math.sin(elapsedTime * 2.5) * 0.12;
      camera.position.x = Math.sin(elapsedTime * 6) * 1.2;
      camera.position.y = Math.cos(elapsedTime * 5) * 1.2;

      // La galaxia va apareciendo al fondo del túnel (Imagen 3)
      if (stateTimer > 2.2) {
        const approachFactor = Math.min(1, (stateTimer - 2.2) / 2.5);
        galaxyGroup.position.z = -1150 + approachFactor * 750;
        const scaleVal = 0.2 + approachFactor * 0.6;
        galaxyGroup.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // Transición al acercamiento (Acto 2)
      if (stateTimer > 4.6) {
        currentState = STATE.APPROACH;
        stateTimer = 0;
      }

    } else if (currentState === STATE.APPROACH) {
      stateTimer += delta;
      const t = Math.min(1, stateTimer / 2.6);
      const ease = t * (2 - t); // Ease-out

      // Desvanecimiento suave del túnel
      tunnelMaterial.opacity = Math.max(0, 0.95 * (1 - ease * 1.5));

      // La galaxia llega a su posición central
      galaxyGroup.position.lerp(new THREE.Vector3(0, 0, 0), ease);
      galaxyGroup.scale.lerp(new THREE.Vector3(1, 1, 1), ease);

      // La cámara planea suavemente hacia la vista en perspectiva (Imagen 4)
      camera.position.lerp(new THREE.Vector3(0, 95, 250), 0.05);
      camera.lookAt(0, 15, 0);

      if (stateTimer > 2.8) {
        currentState = STATE.HEART_RISE;
        stateTimer = 0;
        tunnelSystem.visible = false; // Apagar túnel para máximo rendimiento
        heartSystem.visible = true;
        heartCenterGlow.visible = true;
        heartHitbox.visible = true;
      }

    } else if (currentState === STATE.HEART_RISE) {
      stateTimer += delta;
      heartRiseProgress = Math.min(1, heartRiseProgress + delta * 0.65);

      // Partículas brotan del centro y toman forma de corazón (Imagen 5)
      const curPos = heartGeometry.attributes.position.array;
      const ease = Math.pow(heartRiseProgress, 0.7);

      for (let i = 0; i < HEART_COUNT; i++) {
        curPos[i * 3 + 0] = heartTargetPositions[i * 3 + 0] * ease;
        curPos[i * 3 + 1] = heartTargetPositions[i * 3 + 1] * ease;
        curPos[i * 3 + 2] = heartTargetPositions[i * 3 + 2] * ease;
      }
      heartGeometry.attributes.position.needsUpdate = true;

      heartMaterial.opacity = Math.min(1, heartRiseProgress * 1.2);
      heartCenterGlow.material.opacity = Math.min(0.85, heartRiseProgress * 0.9);

      if (heartRiseProgress >= 1) {
        currentState = STATE.EXPLORE;
        orbitGroup.visible = true;
        controls.enabled = true;
        controls.target.set(0, 25, 0);
      }

    } else if (currentState === STATE.EXPLORE) {
      // Aparición suave de elementos orbitales
      if (orbitRevealProgress < 1) {
        orbitRevealProgress = Math.min(1, orbitRevealProgress + delta * 0.8);
        wordSprites.forEach((sp) => { sp.material.opacity = orbitRevealProgress * 0.95; });
      }

      // Latido constante del corazón en 3D
      const beat = 1 + Math.pow(Math.sin(elapsedTime * 3.6), 5) * 0.07 + Math.pow(Math.sin(elapsedTime * 7.2), 5) * 0.035;
      heartSystem.scale.set(beat, beat, beat);

      // Giro automático suave en modo libre si no está en pausa
      if (isAutoRotating) {
        galaxyGroup.rotation.y += delta * 0.04;
      }

      controls.update();
    }

    // ----------------------------------------------------
    // B. Rotación Continua de Brazos y Órbitas
    // ----------------------------------------------------
    galaxySystem.rotation.y += delta * 0.035;
    accretionDisk.rotation.z += delta * 0.45;
    bgStars.rotation.y += delta * 0.005;

    // Movimiento orbital de los recuerdos y frases
    orbitGroup.children.forEach((obj) => {
      if (!obj.userData) return;
      if (isAutoRotating || currentState !== STATE.EXPLORE) {
        obj.userData.angle += (obj.userData.speed || 0.01) * delta * 60;
      }

      const r = obj.userData.radius || 150;
      const ang = obj.userData.angle;
      obj.position.x = Math.cos(ang) * r;
      obj.position.z = Math.sin(ang) * r;

      if (obj.userData.yBase !== undefined) {
        obj.position.y = obj.userData.yBase + Math.sin(elapsedTime * 1.8 + (obj.userData.phase || 0)) * 4;
      }

      // Las tarjetas de fotos siempre miran hacia la cámara para máxima legibilidad
      if (obj.isGroup) {
        obj.lookAt(camera.position);
      }
    });

    renderer.render(scene, camera);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      clock.stop();
    } else if (!animationFrameId) {
      clock.start();
      animate();
    }
  });

  animate();

  // ========================================================
  // 11. INTERACCIÓN CON CLIC Y RAYCASTER (3D A MODAL)
  // ========================================================
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(event) {
    if (currentState !== STATE.EXPLORE) return;
    if (event.target !== renderer.domElement) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData.isMemory) {
        openMemory(hit.userData.memoryIndex);
      } else if (hit.userData.isHeart) {
        dialogPromesa.showModal();
      }
    } else {
      // Verificar si clic en el corazón por proximidad
      const heartBox = new THREE.Box3().setFromObject(heartSystem);
      const ray = raycaster.ray;
      if (heartBox.intersectsRay(ray)) {
        dialogPromesa.showModal();
      }
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  // Cambio de cursor y aumento suave al pasar el mouse por las fotos o el corazón
  let hoveredBadgeGroup = null;
  renderer.domElement.addEventListener('pointermove', (event) => {
    if (currentState !== STATE.EXPLORE) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes);
    if (hits.length > 0) {
      renderer.domElement.style.cursor = 'pointer';
      const hit = hits[0].object;
      const targetGroup = hit.userData.isMemory ? hit.parent : null;
      if (hoveredBadgeGroup && hoveredBadgeGroup !== targetGroup) {
        hoveredBadgeGroup.scale.set(1, 1, 1);
      }
      if (targetGroup) {
        hoveredBadgeGroup = targetGroup;
        hoveredBadgeGroup.scale.set(1.22, 1.22, 1.22);
      }
    } else {
      renderer.domElement.style.cursor = 'default';
      if (hoveredBadgeGroup) {
        hoveredBadgeGroup.scale.set(1, 1, 1);
        hoveredBadgeGroup = null;
      }
    }
  });

  // ========================================================
  // 12. GESTIÓN DE MODALES Y VISORES DE RECUERDOS
  // ========================================================
  function showMemory(index) {
    currentMemoryIndex = (index + MEMORIES_DATA.length) % MEMORIES_DATA.length;
    const mem = MEMORIES_DATA[currentMemoryIndex];

    const mediaEl = document.createElement('img');
    mediaEl.src = mem.src;
    mediaEl.alt = mem.title;

    contenidoRecuerdo.replaceChildren(mediaEl);
    txtRecuerdoNumero.textContent = `${String(currentMemoryIndex + 1).padStart(2, '0')} / ${MEMORIES_DATA.length} · UNA ESTRELLA NUESTRA`;
    txtRecuerdoTitulo.textContent = mem.title;
    txtRecuerdoDesc.textContent = mem.caption;
  }

  function openMemory(index) {
    showMemory(index);
    dialogRecuerdo.showModal();
    btnCerrarRecuerdo.focus();
  }

  btnCerrarRecuerdo.addEventListener('click', () => dialogRecuerdo.close());
  btnRecuerdoAnterior.addEventListener('click', () => showMemory(currentMemoryIndex - 1));
  btnRecuerdoSiguiente.addEventListener('click', () => showMemory(currentMemoryIndex + 1));

  dialogRecuerdo.addEventListener('close', () => {
    contenidoRecuerdo.replaceChildren();
  });

  // Llenar panel lateral de recuerdos (solo fotos ligeras)
  MEMORIES_DATA.forEach((mem, index) => {
    const itemBtn = document.createElement('button');
    itemBtn.type = 'button';
    itemBtn.setAttribute('aria-label', `Abrir: ${mem.title}`);

    const thumb = document.createElement('img');
    thumb.src = mem.src;
    thumb.alt = mem.title;

    const span = document.createElement('span');
    span.textContent = mem.title;

    itemBtn.append(thumb, span);
    itemBtn.addEventListener('click', () => {
      drawerRecuerdos.hidden = true;
      btnVerRecuerdos.setAttribute('aria-expanded', 'false');
      openMemory(index);
    });

    indiceRecuerdos.appendChild(itemBtn);
  });

  btnVerRecuerdos.addEventListener('click', () => {
    const isHidden = drawerRecuerdos.hidden;
    drawerRecuerdos.hidden = !isHidden;
    btnVerRecuerdos.setAttribute('aria-expanded', String(isHidden));
    if (isHidden) btnCerrarLista.focus();
  });

  btnCerrarLista.addEventListener('click', () => {
    drawerRecuerdos.hidden = true;
    btnVerRecuerdos.setAttribute('aria-expanded', 'false');
  });

  btnCerrarPromesa.addEventListener('click', () => dialogPromesa.close());

  // Cerrar modales al hacer clic fuera
  [dialogRecuerdo, dialogPromesa].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      const box = modal.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
        modal.close();
      }
    });
  });

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!drawerRecuerdos.hidden) drawerRecuerdos.hidden = true;
      if (dialogRecuerdo.open) dialogRecuerdo.close();
      if (dialogPromesa.open) dialogPromesa.close();
    }
  });

  // Redimensionamiento responsive de alta definición
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }, { passive: true });

  function startMusic() {
    if (audioPlayer.ended) audioPlayer.currentTime = 0;
    audioPlayer.play().catch((error) => {
      reflectGalaxyMusic(false);
      console.error('No se pudo reproducir la canción local en la galaxia.', error);
    });
  }

  function toggleMusic() {
    if (musicPlaying) audioPlayer.pause();
    else startMusic();
  }

  function reflectGalaxyMusic(active) {
    musicPlaying = active;
    btnMusica.innerHTML = `<span class="music-icon" aria-hidden="true">${active ? '❚❚' : '♪'}</span> ${active ? 'Pausar música' : 'Música'}`;
  }

  audioPlayer.addEventListener('play', () => reflectGalaxyMusic(true));
  audioPlayer.addEventListener('pause', () => reflectGalaxyMusic(false));
  audioPlayer.addEventListener('ended', () => reflectGalaxyMusic(false));
  audioPlayer.addEventListener('error', () => {
    reflectGalaxyMusic(false);
    console.error('No se pudo cargar el archivo de música de la galaxia.');
  });

  btnMusica.addEventListener('click', toggleMusic);

})();
