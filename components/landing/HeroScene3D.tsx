"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles, OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

/**
 * Hero scene — three floating "photo" cards on the left, a glowing AI orb
 * in the centre, a translucent "PDF" card on the right. Ambient sparkles.
 * Gentle constant motion plus a slow orbit ride for parallax feel.
 *
 * Heavy stuff is inside <Canvas>, which only mounts client-side, so this
 * file is safe to import in the client landing page.
 */
export function HeroScene3D() {
  return (
    <div className="relative h-[420px] w-full md:h-[520px]">
      <Canvas
        camera={{ position: [0, 0.4, 6], fov: 38 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* lights */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <pointLight position={[-3, -2, 2]} intensity={0.6} color="#7dd3fc" />
          <pointLight position={[3, 2, -2]} intensity={0.7} color="#86efac" />

          {/* sparkles inside the camera frustum */}
          <Sparkles count={40} size={2} speed={0.4} opacity={0.6} scale={[8, 4, 4]} color="#fbbf24" />

          {/* photos on the left */}
          <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.8}>
            <PhotoCard position={[-2.5, 0.7, 0.2]} rotationZ={-0.18} color="#7dd3fc" />
          </Float>
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1}>
            <PhotoCard position={[-2.0, -0.5, 0.5]} rotationZ={0.14} color="#bae6fd" />
          </Float>
          <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.6}>
            <PhotoCard position={[-2.7, -1.2, -0.2]} rotationZ={0.05} color="#38bdf8" />
          </Float>

          {/* glowing AI orb in the middle */}
          <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.4}>
            <AIOrb position={[0.2, 0.3, 0]} />
          </Float>

          {/* PDF document on the right */}
          <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.8}>
            <PDFCard position={[2.4, 0, 0]} />
          </Float>

          {/* very subtle drag-orbit — limited so the layout never breaks */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.4}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
            enableDamping
            dampingFactor={0.08}
          />

          {/* slow camera ride for autonomous motion */}
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CameraRig() {
  const t = useRef(0);
  useFrame((state, delta) => {
    t.current += delta * 0.4;
    state.camera.position.x = Math.sin(t.current) * 0.22;
    state.camera.position.y = 0.4 + Math.cos(t.current * 0.6) * 0.08;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function PhotoCard({
  position,
  rotationZ,
  color,
}: {
  position: [number, number, number];
  rotationZ: number;
  color: string;
}) {
  return (
    <group position={position} rotation={[0, 0.1, rotationZ]}>
      {/* shadow card behind */}
      <mesh position={[0.05, -0.05, -0.02]}>
        <planeGeometry args={[1.3, 0.95]} />
        <meshStandardMaterial color="#0f172a" opacity={0.15} transparent />
      </mesh>
      {/* photo */}
      <mesh>
        <planeGeometry args={[1.3, 0.95]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* simulated image area */}
      <mesh position={[0, -0.05, 0.001]}>
        <planeGeometry args={[1.18, 0.78]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* "sun" circle on the photo */}
      <mesh position={[-0.35, 0.18, 0.002]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#fef3c7" />
      </mesh>
    </group>
  );
}

function AIOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* glow halo (back) */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[0.85, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <circleGeometry args={[0.6, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.28} />
      </mesh>
      {/* glass sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.38, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.6}
          chromaticAberration={0.04}
          anisotropy={0.3}
          roughness={0.1}
          distortion={0.4}
          temporalDistortion={0.1}
          ior={1.45}
          color="#fde68a"
        />
      </mesh>
    </group>
  );
}

function PDFCard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.18, 0.04]}>
      {/* shadow */}
      <mesh position={[0.08, -0.08, -0.05]}>
        <planeGeometry args={[1.55, 2.1]} />
        <meshStandardMaterial color="#0f172a" opacity={0.18} transparent />
      </mesh>
      {/* page */}
      <mesh>
        <planeGeometry args={[1.55, 2.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {/* green header bar */}
      <mesh position={[0, 0.88, 0.001]}>
        <planeGeometry args={[1.55, 0.34]} />
        <meshStandardMaterial color="#047857" roughness={0.5} />
      </mesh>
      {/* logo dot in header */}
      <mesh position={[-0.58, 0.88, 0.002]}>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* title bar */}
      <mesh position={[-0.32, 0.55, 0.001]}>
        <planeGeometry args={[0.85, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {/* meta lines */}
      {[0.42, 0.32].map((y, i) => (
        <mesh key={i} position={[-0.25, y, 0.001]}>
          <planeGeometry args={[1.0, 0.03]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      ))}
      {/* photo strip */}
      {[-0.45, -0.05, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0.001]}>
          <planeGeometry args={[0.32, 0.22]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.5} />
        </mesh>
      ))}
      {/* item rows */}
      {[-0.1, -0.3, -0.5, -0.7].map((y, i) => (
        <group key={i}>
          <mesh position={[-0.4, y, 0.001]}>
            <planeGeometry args={[0.5, 0.04]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          <mesh position={[0.15, y, 0.001]}>
            <planeGeometry args={[0.22, 0.04]} />
            <meshStandardMaterial color={i === 2 ? "#f59e0b" : "#10b981"} roughness={0.5} />
          </mesh>
          <mesh position={[0.55, y, 0.001]}>
            <planeGeometry args={[0.5, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
