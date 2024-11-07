"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import {
  Decal,
  Float,
  Preload,
  useTexture,
  OrbitControls,
} from "@react-three/drei";
import { animated } from "@react-spring/three";

interface BallProps {
  imgUrl: string;
}

const Ball: React.FC<BallProps> = ({ imgUrl }) => {
  const [deCal] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={5} />
      <directionalLight position={[0, 0, 0.05]} intensity={1} />
      {/* Apply the spring animation */}
      <animated.mesh
        castShadow
        receiveShadow
        scale={[5, 5, 5]} // Increase the scale to make the mesh larger
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          map={deCal}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]} // Ensure the icon is straight
          scale={[1, 1, 1]}
        />
      </animated.mesh>
    </Float>
  );
};

interface BallCanvasProps {
  icon: string;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ icon }) => {
  return (
    <Canvas
      frameloop="demand"
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full" // Full width and height from Tailwind classes
    >
      <Suspense fallback={null}>
        {/* OrbitControls with mouse rotation disabled */}
        <OrbitControls enableZoom={false} enableRotate={false} />
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
