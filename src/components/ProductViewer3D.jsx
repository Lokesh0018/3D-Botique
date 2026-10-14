import React, { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';
import './ProductViewer3D.css';

const SEGMENTS_X = 40;
const SEGMENTS_Y = 50;
const AUTO_SPIN_SPEED = 0.25; // radians per second
const KEY_STEP = Math.PI / 8;

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

// Shapes the flat photo into a hanging garment: a gentle body curve plus a
// travelling wave whose amplitude grows towards the hem.
const drapeCloth = (geometry, base, width, height, time, animate) => {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = base[i * 3];
    const y = base[i * 3 + 1];
    const fromTop = (height / 2 - y) / height; // 0 at the hanger, 1 at the hem
    const nx = x / (width / 2);
    const curve = -0.18 * nx * nx;
    const sway = animate
      ? Math.sin(nx * 2.4 + time * 1.6) * 0.04 * fromTop * fromTop
        + Math.sin(fromTop * 5 - time * 1.1) * 0.015 * fromTop
      : 0;
    pos.setZ(i, curve + sway);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
};

const ProductViewer3D = ({ image, label }) => {
  const mountRef = useRef(null);
  const controlsRef = useRef({ rotateBy: () => {}, reset: () => {} });
  const [webglSupported] = useState(supportsWebGL);
  const [status, setStatus] = useState(webglSupported ? 'loading' : 'error'); // loading | ready | error

  useEffect(() => {
    if (!webglSupported) return undefined;
    const mount = mountRef.current;
    const reduceMotion = prefersReducedMotion();
    let disposed = false;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    scene.add(new HemisphereLight(0xffffff, 0xe8e2d6, 1.1));
    scene.add(new AmbientLight(0xffffff, 0.35));
    const key = new DirectionalLight(0xffffff, 1.6);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const rim = new DirectionalLight(0xf2e8fa, 0.8);
    rim.position.set(-3, 1, -3);
    scene.add(rim);

    const garment = new Group();
    scene.add(garment);

    // Hanger: rod + hook, in brand charcoal.
    const hangerMaterial = new MeshStandardMaterial({ color: 0x2a2c2b, metalness: 0.6, roughness: 0.35 });
    const rod = new Mesh(new CylinderGeometry(0.025, 0.025, 1.3, 16), hangerMaterial);
    rod.rotation.z = Math.PI / 2;
    const hook = new Mesh(new TorusGeometry(0.12, 0.018, 12, 32, Math.PI * 1.4), hangerMaterial);
    hook.rotation.z = -Math.PI * 0.2;
    garment.add(rod, hook);

    let cloth;
    let clothGeometry;
    let clothMaterial;
    let basePositions;
    let clothWidth = 1.5;
    let clothHeight = 2;

    const texture = new TextureLoader().load(
      image,
      (tex) => {
        if (disposed) return;
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const aspect = tex.image.width / tex.image.height;
        clothHeight = 2.4;
        clothWidth = clothHeight * aspect;

        clothGeometry = new PlaneGeometry(clothWidth, clothHeight, SEGMENTS_X, SEGMENTS_Y);
        basePositions = Float32Array.from(clothGeometry.attributes.position.array);
        clothMaterial = new MeshStandardMaterial({ map: tex, side: DoubleSide, roughness: 0.85, metalness: 0 });
        cloth = new Mesh(clothGeometry, clothMaterial);
        cloth.position.y = -clothHeight / 2 - 0.05;
        drapeCloth(clothGeometry, basePositions, clothWidth, clothHeight, 0, false);
        garment.add(cloth);

        rod.scale.y = Math.min(1.4, (clothWidth * 0.85) / 1.3);
        hook.position.y = 0.13;
        garment.position.y = clothHeight / 2 - 0.05;
        setStatus('ready');
        render();
      },
      undefined,
      () => { if (!disposed) setStatus('error'); },
    );

    // Rotation state: current eases towards target for smooth drag/keys.
    let rotation = 0;
    let target = 0;
    let lastInteraction = -Infinity;
    const markInteraction = () => { lastInteraction = performance.now(); };

    controlsRef.current = {
      rotateBy: (delta) => { target += delta; markInteraction(); },
      reset: () => { target = Math.round(rotation / (Math.PI * 2)) * Math.PI * 2; markInteraction(); },
    };

    const render = () => renderer.render(scene, camera);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      // Keep the whole garment in frame on narrow containers.
      camera.position.z = camera.aspect < 0.7 ? 6.2 : 5.2;
      camera.updateProjectionMatrix();
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    // Pointer drag to rotate.
    let dragging = false;
    let lastX = 0;
    const onPointerDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.setPointerCapture(e.pointerId);
      markInteraction();
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      target += (e.clientX - lastX) * 0.01;
      lastX = e.clientX;
      markInteraction();
    };
    const onPointerUp = (e) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(e.pointerId)) {
        renderer.domElement.releasePointerCapture(e.pointerId);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    // Only animate while visible.
    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(mount);

    let frame;
    let last = performance.now();
    const loop = (now) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !cloth) return;

      const idle = now - lastInteraction > 2500 && !dragging;
      if (idle && !reduceMotion) target += AUTO_SPIN_SPEED * dt;

      rotation += (target - rotation) * (reduceMotion ? 1 : Math.min(1, dt * 8));
      garment.rotation.y = rotation;
      if (!reduceMotion) drapeCloth(clothGeometry, basePositions, clothWidth, clothHeight, now / 1000, true);
      render();
    };
    frame = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      texture.dispose();
      clothGeometry?.dispose();
      clothMaterial?.dispose();
      rod.geometry.dispose();
      hook.geometry.dispose();
      hangerMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [image, webglSupported]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      controlsRef.current.rotateBy(-KEY_STEP);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      controlsRef.current.rotateBy(KEY_STEP);
    } else if (e.key === 'Home') {
      e.preventDefault();
      controlsRef.current.reset();
    }
  };

  return (
    <div className="viewer3d">
      <div
        ref={mountRef}
        className="viewer3d-canvas"
        role="img"
        aria-label={`Interactive 3D view of the ${label}. Drag or use the left and right arrow keys to rotate.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      />

      {status === 'loading' && <div className="viewer3d-status" aria-live="polite">Loading 3D view…</div>}
      {status === 'error' && (
        <div className="viewer3d-status" role="alert">3D view isn’t supported on this device. Switch back to Photo.</div>
      )}

      {status === 'ready' && (
        <div className="viewer3d-controls">
          <button type="button" onClick={() => controlsRef.current.rotateBy(-KEY_STEP)} aria-label="Rotate left">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => controlsRef.current.reset()} aria-label="Reset view">
            <RotateCcw size={16} />
          </button>
          <button type="button" onClick={() => controlsRef.current.rotateBy(KEY_STEP)} aria-label="Rotate right">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductViewer3D;
