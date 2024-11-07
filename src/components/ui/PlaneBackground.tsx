"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { OrbitControls, Decal, Float, Preload, useTexture } from "@react-three/drei";

interface PlaneBackgroundProps {
  imgUrl: string;
}

const PlaneBackground: React.FC<PlaneBackgroundProps> = ({ imgUrl }) => {
  const [deCal] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 0.05]} intensity={1} />
      <mesh castShadow receiveShadow scale={2.75}>
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
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
      </mesh>
    </Float>
  );
};

const PlaneCanvas: React.FC<PlaneBackgroundProps> = ({ imgUrl }) => {
  return (
    <Canvas frameloop="demand" gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <OrbitControls enableZoom={false} />
        <PlaneBackground imgUrl={imgUrl} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default PlaneCanvas;