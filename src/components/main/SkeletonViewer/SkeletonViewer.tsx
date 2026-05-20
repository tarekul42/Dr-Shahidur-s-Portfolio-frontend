"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  AxesHelper,
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SRGBColorSpace,
  type Texture,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  type GLTF,
  GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./SkeletonViewer.module.css";

// ─── Brand palette (matches the portfolio's teal #2fa084) ─────────────────────
const TEAL = new Color(0x2fa084); // brand-primary
// const TEAL_DARK  = new Color(0x1a6b58); // darker teal for secondary accents
const TEAL_LIGHT = new Color(0x3fcba0); // lighter teal for highlights

type SkeletonViewerProps = {
  showDebug?: boolean;
  theme?: "light" | "dark";
};

type ViewerInfo = {
  phase: "loading" | "ready" | "error";
  pct: number;
  bone: string | null;
  error: string | null;
};

type ViewerState = {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  meshes: Mesh[];
  selected: Mesh | null;
  gridGroup: Group;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

// ─── Pure helpers (no React) ──────────────────────────────────────────────────
function createScene(theme: "light" | "dark" = "dark"): Scene {
  const scene = new Scene();
  // We use null background to allow the CSS background to show through (transparency)
  // This ensures perfect consistency with the project's background
  scene.background = null;

  const fogColor = theme === "light" ? 0xd4ede3 : 0x071a14;
  scene.fog = new FogExp2(fogColor, 0.016);
  return scene;
}

function createCamera(w: number, h: number): PerspectiveCamera {
  // 26° vertical FOV — tight enough that skeleton fills frame at minDistance
  const cam = new PerspectiveCamera(26, w / h, 0.01, 500);
  cam.position.set(0, 1.0, 5);
  return cam;
}

function createRenderer(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
): WebGLRenderer {
  const testCtx = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!testCtx) throw new Error("WebGL not supported in this browser.");

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true, // Enable transparency
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = SRGBColorSpace;
  return renderer;
}

function createLights(scene: Scene): void {
  // Warm ambient base
  scene.add(new AmbientLight(0x1a2e28, 2.0));

  // Main key light – warm white
  const keyLight = new DirectionalLight(0xfff5ee, 3.0);
  keyLight.position.set(3, 8, 4);
  keyLight.castShadow = true;
  keyLight.receiveShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  // Fill light – cool teal from the opposite side
  const fillLight = new DirectionalLight(0x1a6b58, 1.5);
  fillLight.position.set(-4, 3, -3);
  scene.add(fillLight);

  // Teal rim light for edge glow
  const rimLight1 = new PointLight(0x2fa084, 1.4);
  rimLight1.position.set(-2, 4, -5);
  scene.add(rimLight1);

  // Softer secondary rim
  const rimLight2 = new PointLight(0x3fcba0, 0.7);
  rimLight2.position.set(4, 3, -4);
  scene.add(rimLight2);

  // Under-lighting for dramatic effect
  const underLight = new PointLight(0x1a6b58, 0.5);
  underLight.position.set(0, -1, 2);
  scene.add(underLight);
}

function createAdvancedGrid(scene: Scene): Group {
  const group = new Group();

  // Main holographic grid floor
  const gridSize = 12;
  const divisions = 40;

  // Primary grid — teal brand color
  const gridHelper1 = new GridHelper(gridSize, divisions, 0x2fa084, 0x0d3328);
  gridHelper1.position.y = 0;
  group.add(gridHelper1);

  // Secondary grid — lighter teal, rotated for depth
  const gridHelper2 = new GridHelper(
    gridSize * 1.2,
    divisions * 1.5,
    0x3fcba0,
    0x0a2219,
  );
  gridHelper2.position.y = 0.01;
  gridHelper2.rotation.y = Math.PI / 4;
  group.add(gridHelper2);

  // Circular reference rings
  const rings = createCircularRings();
  rings.position.y = 0.02;
  group.add(rings);

  // Outer boundary ring
  const boundaryRing = new Mesh(
    new TorusGeometry(5.8, 0.02, 16, 100),
    new MeshStandardMaterial({
      color: 0x2fa084,
      emissive: new Color(0x0d3328),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.35,
    }),
  );
  boundaryRing.rotation.x = Math.PI / 2;
  boundaryRing.position.y = 0.03;
  group.add(boundaryRing);

  // Corner markers
  const corners = createCornerMarkers();
  corners.position.y = 0.02;
  group.add(corners);

  // Central platform (receives shadows beautifully)
  const platform = new Mesh(
    new CylinderGeometry(2.2, 2.2, 0.05, 32),
    new MeshStandardMaterial({
      color: 0x071a14,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7,
      emissive: new Color(0x0d3328),
      emissiveIntensity: 0.3,
    }),
  );
  platform.position.y = -0.025;
  platform.receiveShadow = true;
  group.add(platform);

  // Add floating particles around the grid
  const particles = createGridParticles();
  particles.position.y = 0.05;
  group.add(particles);

  scene.add(group);
  return group;
}

function createCircularRings() {
  const group = new Group();
  const radii = [2.5, 3.8, 5.0];

  radii.forEach((r, i) => {
    const ring = new Mesh(
      new TorusGeometry(r, 0.008, 8, 64),
      new MeshStandardMaterial({
        color: i === 1 ? 0x3fcba0 : 0x2fa084,
        emissive: i === 1 ? new Color(0x1a6b58) : new Color(0x0d3328),
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.15 + i * 0.1,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  });

  return group;
}

function createCornerMarkers() {
  const group = new Group();
  const positions = [
    [-5.5, 0, -5.5],
    [5.5, 0, -5.5],
    [-5.5, 0, 5.5],
    [5.5, 0, 5.5],
  ];

  positions.forEach((pos) => {
    const marker = new Mesh(
      new BoxGeometry(0.15, 0.02, 0.15),
      new MeshStandardMaterial({
        color: 0x2fa084,
        emissive: new Color(0x0d3328),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
      }),
    );
    marker.position.set(pos[0], 0, pos[2]);
    group.add(marker);
  });

  return group;
}

function createGridParticles() {
  const geometry = new BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 4.5 + Math.random() * 2;
    positions[i] = Math.cos(angle) * radius;
    positions[i + 1] = 0;
    positions[i + 2] = Math.sin(angle) * radius;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    color: 0x2fa084,
    size: 0.015,
    transparent: true,
    opacity: 0.5,
    blending: AdditiveBlending,
  });

  return new Points(geometry, material);
}

function createControls(
  camera: PerspectiveCamera,
  domElement: HTMLCanvasElement,
): OrbitControls {
  const ctrl = new OrbitControls(camera, domElement);

  // Basic settings
  ctrl.enableDamping = true;
  ctrl.dampingFactor = 0.05;

  // Zoom settings - CRITICAL FIX
  ctrl.enableZoom = true;
  ctrl.zoomSpeed = 2.5; // Increased zoom sensitivity
  ctrl.enableRotate = true;
  ctrl.rotateSpeed = 1.0;
  ctrl.enablePan = true;
  ctrl.panSpeed = 0.8;

  // Distance limits - EXTENDED FOR BETTER ZOOM
  ctrl.minDistance = 0.1; // Allow very close zoom
  ctrl.maxDistance = 20; // Allow very far zoom

  // Auto-rotate
  ctrl.autoRotate = true;
  ctrl.autoRotateSpeed = 0.8;

  // Screen space panning
  ctrl.screenSpacePanning = true;

  return ctrl;
}

function autoFitModel(gltf: GLTF) {
  const root = gltf.scene;

  const box1 = new Box3().setFromObject(root);
  const size1 = new Vector3();
  box1.getSize(size1);
  const maxDim = Math.max(size1.x, size1.y, size1.z);

  if (maxDim > 0) root.scale.setScalar(1.9 / maxDim); // Slightly larger for better detail while remaining visible

  const box2 = new Box3().setFromObject(root);
  const center = new Vector3();
  box2.getCenter(center);
  root.position.sub(center);

  // Position feet precisely at y = 0
  const box3 = new Box3().setFromObject(root);
  root.position.y -= box3.min.y;

  return root;
}

function collectMeshes(root: Group): Mesh[] {
  const list: Mesh[] = [];
  root.traverse((obj: Object3D) => {
    if (obj instanceof Mesh) {
      const mesh = obj as Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : mesh.material
          ? [mesh.material]
          : [];

      materials.forEach((mat) => {
        if (!(mat instanceof MeshStandardMaterial)) return;
        mat.roughness = 0.45;
        mat.metalness = 0.15;
        mat.envMapIntensity = 1.2;

        if (!mat.userData._origColor) {
          mat.userData._origColor = mat.color.clone();
          mat.userData._origEmissive = mat.emissive.clone();
          mat.userData._origRoughness = mat.roughness;
        }
      });

      list.push(mesh);
    }
  });
  return list;
}

function disposeMesh(obj: Object3D): void {
  if (!(obj instanceof Mesh)) return;
  obj.geometry?.dispose();
  const materials = Array.isArray(obj.material)
    ? obj.material
    : obj.material
      ? [obj.material]
      : [];

  materials.forEach((m) => {
    if (!m) return;
    Object.values(m).forEach((value) => {
      if (
        value &&
        typeof value === "object" &&
        "isTexture" in value &&
        (value as Texture).isTexture &&
        typeof (value as Texture).dispose === "function"
      ) {
        (value as Texture).dispose();
      }
    });
    if (typeof m.dispose === "function") {
      m.dispose();
    }
  });
}

// ─── Enhanced Highlight helpers ────────────────────────────────────────────────
function applyHighlight(mesh: Mesh): void {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    if (!(m instanceof MeshStandardMaterial)) return;

    // Store original values
    if (!m.userData._origColor) {
      m.userData._origColor = m.color.clone();
      m.userData._origEmissive = m.emissive.clone();
      m.userData._origRoughness = m.roughness;
    }

    // Apply teal-brand highlight effect
    m.color.lerp(TEAL_LIGHT, 0.6);
    m.emissive.copy(TEAL);
    m.emissiveIntensity = 0.5;
    m.roughness = 0.25;
    m.needsUpdate = true;
  });
}

function removeHighlight(mesh: Mesh): void {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    if (!(m instanceof MeshStandardMaterial)) return;

    if (m.userData._origColor) {
      m.color.copy(m.userData._origColor);
      m.emissive.copy(m.userData._origEmissive);
      m.roughness = m.userData._origRoughness || 0.45;
      m.emissiveIntensity = 0;
      m.needsUpdate = true;
    }
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SkeletonViewer({
  showDebug = false,
  theme = "dark",
}: SkeletonViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<ViewerState | null>(null);
  const rafRef = useRef<number>(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [info, setInfo] = useState<ViewerInfo>({
    phase: "loading",
    pct: 0,
    bone: null,
    error: null,
  });

  // Lazy boot when component enters viewport
  useEffect(() => {
    const wrapper = mountRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ── Reactively update scene background when theme changes ──────────────────
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    const fogColor = theme === "light" ? 0xd4ede3 : 0x071a14;
    if (state.scene.fog) {
      (state.scene.fog as import("three").FogExp2).color.set(fogColor);
    }
  }, [theme]);

  useEffect(() => {
    if (!isInViewport) return;

    const wrapper = mountRef.current;
    if (!wrapper) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%;";
    wrapper.appendChild(canvas);

    const W = wrapper.clientWidth || window.innerWidth;
    const H = wrapper.clientHeight || window.innerHeight;

    let scene: Scene;
    let camera: PerspectiveCamera;
    let renderer: WebGLRenderer;
    let controls: OrbitControls;
    try {
      scene = createScene(theme);
      camera = createCamera(W, H);
      renderer = createRenderer(canvas, W, H);
      controls = createControls(camera, renderer.domElement);
    } catch (err) {
      console.error("[SkeletonViewer] Init error:", err);
      setInfo({
        phase: "error",
        pct: 0,
        bone: null,
        error: getErrorMessage(err),
      });
      canvas.remove();
      return;
    }

    createLights(scene);
    const gridGroup = createAdvancedGrid(scene);

    if (showDebug) {
      scene.add(new AxesHelper(1.5));
      const debugGrid = new GridHelper(8, 20, 0xff0000, 0x330000);
      debugGrid.position.y = -1.15;
      scene.add(debugGrid);
    }

    // Add subtle environment reflection – teal hemisphere
    const envLight = new HemisphereLight(0x2fa084, 0x0d3328, 0.8);
    scene.add(envLight);

    stateRef.current = {
      scene,
      camera,
      renderer,
      controls,
      meshes: [],
      selected: null,
      gridGroup,
    };

    // ── Load GLB ─────────────────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    let alive = true;

    loader.load(
      "/skeleton-optimized.glb",
      (gltf: GLTF) => {
        if (!alive) return;

        const model = autoFitModel(gltf);
        const meshes = collectMeshes(model);
        scene.add(model);
        if (stateRef.current) stateRef.current.meshes = meshes;

        const box = new Box3().setFromObject(model);
        const size = new Vector3();
        box.getSize(size);

        // Target slightly below the centre for a portrait composition
        // (leaves less empty sky above head, and shows more floor/platform)
        const targetY = size.y * 0.45;

        // Distance calibrated to fill ~80% of frame height
        const dist = size.y * 2.6;
        camera.position.set(0, targetY, dist);
        controls.target.set(0, targetY, 0);

        controls.minDistance = size.y * 1.2;
        controls.maxDistance = size.y * 4.0;
        // Disable pan so skeleton stays centred
        controls.enablePan = false;
        controls.update();

        setInfo({ phase: "ready", pct: 100, bone: null, error: null });
        // Model loaded
      },
      ({ loaded, total }: { loaded: number; total?: number }) => {
        if (!alive) return;
        const pct = total && total > 0 ? Math.round((loaded / total) * 100) : 0;
        setInfo((p) => ({ ...p, pct }));
      },
      (err: unknown) => {
        if (!alive) return;
        console.error("[SkeletonViewer] Load error:", err);
        setInfo({
          phase: "error",
          pct: 0,
          bone: null,
          error: "Cannot load /public/skeleton.glb — check the file exists.",
        });
      },
    );

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = wrapper.clientWidth || window.innerWidth;
      const h = wrapper.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrapper);
    window.addEventListener("resize", onResize);

    // ── Raycast / click ───────────────────────────────────────────────────────
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const onClick = (e: MouseEvent) => {
      const currentState = stateRef.current;
      if (!currentState) return;
      const { meshes, selected } = currentState;
      if (!meshes.length) return;

      const rect = canvas.getBoundingClientRect();
      mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ((e.clientY - rect.top) / rect.height) * -2 + 1,
      );

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes, false);

      if (hits.length) {
        const candidate = hits[0].object;
        if (!(candidate instanceof Mesh)) return;
        const hit = candidate as Mesh;
        if (selected && selected !== hit) removeHighlight(selected);
        applyHighlight(hit);
        currentState.selected = hit;
        const name = hit.name || hit.parent?.name || "unnamed";
        // Selected bone
        setInfo((p) => ({ ...p, bone: name }));

        // Temporarily disable auto-rotate on selection
        controls.autoRotate = false;
        setTimeout(() => {
          controls.autoRotate = true;
        }, 3000);
      } else {
        if (selected) removeHighlight(selected);
        currentState.selected = null;
        setInfo((p) => ({ ...p, bone: null }));
      }
    };

    // Fix for wheel/zoom event
    const onWheel = (e: WheelEvent) => {
      // Don't prevent default - let OrbitControls handle it
      e.stopPropagation();
    };

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // ── Render loop with auto-rotate ───────────────────────────────────────────
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      // Subtle grid animation
      if (gridGroup) {
        gridGroup.children.forEach((child, index) => {
          if (child instanceof Mesh) {
            const mat = Array.isArray(child.material)
              ? child.material[0]
              : child.material;
            if (mat?.transparent) {
              const time = Date.now() * 0.001;
              mat.opacity = 0.15 + Math.sin(time * 0.5 + index) * 0.1;
            }
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel);
      controls.dispose();
      scene.traverse(disposeMesh);
      renderer.dispose();
      try {
        renderer.forceContextLoss();
      } catch (_error) {
        // Ignore context loss errors during cleanup
      }
      canvas.remove();
    };
  }, [showDebug, theme, isInViewport]);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  const ready = info.phase === "ready";
  const loading = info.phase === "loading";
  const error = info.phase === "error";

  return (
    <div ref={mountRef} className={styles.wrapper}>
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          <p className={styles.loaderText}>
            INITIALIZING SKELETON{info.pct > 0 ? ` · ${info.pct}%` : "…"}
          </p>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${info.pct}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className={styles.overlay}>
          <p className={styles.errText}>⚠ SYSTEM ERROR</p>
          <p className={styles.errSub}>{info.error}</p>
          <p className={styles.errHint}>
            Place <code>skeleton.glb</code> in <code>/public/</code>
          </p>
        </div>
      )}

      {ready && (
        <>
          <aside className={styles.panel}>
            <div className={styles.divider} />
            <Row
              label="SELECTED"
              value={info.bone ?? "—"}
              valueColor={info.bone ? "#ffaa00" : "#2a4a5a"}
            />
            {info.bone && (
              <div className={styles.highlightIndicator}>
                <span className={styles.highlightDot}>◆</span>
                <span className={styles.highlightText}>HIGHLIGHT ACTIVE</span>
              </div>
            )}
          </aside>

          <footer className={styles.footer}>
            <Hint icon="⟳" label="Drag · Rotate" />
            <Hint icon="⊕" label="Scroll · Zoom" />
            <Hint icon="⌖" label="Right · Pan" />
            <Hint icon="◎" label="Click · Select" />
            <Hint icon="⬤" label="Auto-Rotate" />
          </footer>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue} style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function Hint({ icon, label }: { icon: string; label: string }) {
  return (
    <div className={styles.hint}>
      <span className={styles.hintIcon}>{icon}</span>
      <span className={styles.hintLabel}>{label}</span>
    </div>
  );
}

// ─── Enhanced Styles ──────────────────────────────────────────────────────────
const _S = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "400px",
    fontFamily: "'Share Tech Mono','Courier New',monospace",
    overflow: "hidden",
    userSelect: "none",
    touchAction: "none",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,.008) 2px, rgba(0,229,255,.008) 4px)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    background:
      "radial-gradient(circle at 50% 50%, transparent 40%, rgba(5,10,15,0.4) 100%)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    background: "rgba(5,10,15,.85)",
    backdropFilter: "blur(8px)",
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "2px solid rgba(0,229,255,.1)",
    borderTop: "2px solid #00e5ff",
    borderRight: "2px solid #ffaa00",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    color: "#2fa084",
    fontSize: 12,
    letterSpacing: "0.25em",
    margin: 0,
    textShadow: "0 0 10px rgba(47,160,132,0.6)",
  },
  progressBar: {
    width: 200,
    height: 2,
    background: "rgba(0,229,255,.1)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2fa084, #3fcba0)",
    transition: "width 0.3s ease",
  },
  errText: {
    color: "#ff4466",
    fontSize: 14,
    letterSpacing: "0.15em",
    margin: 0,
    textShadow: "0 0 10px rgba(255,68,102,0.5)",
  },
  errSub: {
    color: "#4a6a7a",
    fontSize: 11,
    letterSpacing: "0.08em",
    margin: 0,
  },
  errHint: {
    color: "#2a4a5a",
    fontSize: 10,
    letterSpacing: "0.06em",
    margin: 0,
    marginTop: 10,
  },
  panel: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 200,
    padding: "12px 16px",
    background: "rgba(7,26,20,.7)",
    border: "1px solid rgba(47,160,132,.25)",
    borderRadius: 10,
    backdropFilter: "blur(12px)",
    zIndex: 10,
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  panelTitle: {
    color: "#00e5ff",
    fontSize: 11,
    letterSpacing: "0.2em",
    fontWeight: "bold",
  },
  statusDot: {
    color: "#00ff88",
    fontSize: 8,
    animation: "pulse 2s ease-in-out infinite",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  rowLabel: {
    color: "#2fa084",
    fontSize: 9,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    opacity: 0.7,
  },
  rowValue: {
    fontSize: 11,
    letterSpacing: "0.08em",
    maxWidth: 140,
    textAlign: "right",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(47,160,132,.2), transparent)",
    margin: "8px 0",
  },
  highlightIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: "5px 8px",
    background: "rgba(47,160,132,0.1)",
    border: "1px solid rgba(47,160,132,0.3)",
    borderRadius: 4,
  },
  highlightDot: {
    color: "#2fa084",
    fontSize: 8,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  highlightText: {
    color: "#3fcba0",
    fontSize: 8,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 20,
    padding: "8px 22px",
    background: "rgba(7,26,20,.85)",
    border: "1px solid rgba(47,160,132,.2)",
    borderRadius: 30,
    backdropFilter: "blur(16px)",
    zIndex: 10,
    boxShadow: "0 0 24px rgba(0,0,0,0.35)",
  },
  hint: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    opacity: 0.8,
  },
  hintIcon: {
    color: "#2fa084",
    fontSize: 13,
    textShadow: "0 0 8px rgba(47,160,132,0.6)",
  },
  hintLabel: {
    color: "#3fcba0",
    fontSize: 9,
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    opacity: 0.75,
  },
};
