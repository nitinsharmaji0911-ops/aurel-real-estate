'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { TowerId, ViewingMode, Apartment } from '@/types/property';
import { CameraController } from './CameraController';
import { ModelLoader } from './ModelLoader';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';

interface DevelopmentSceneProps {
  viewingMode: ViewingMode;
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  selectedApartmentIndex?: number;
  timeOfDay: TimeOfDay;
  resetTrigger: number;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
  externalModelUrl?: string | null;
}

export function DevelopmentScene({
  viewingMode,
  selectedTowerId,
  selectedFloorNumber,
  selectedApartmentId,
  selectedApartmentIndex = 0,
  timeOfDay = 'golden',
  resetTrigger,
  onSelectTower,
  onSelectFloor,
  onSelectApartment,
  externalModelUrl = null,
}: DevelopmentSceneProps) {
  const isUserInteractingRef = useRef<boolean>(false);
  const atmosphere = ATMOSPHERES[timeOfDay];

  return (
    <div className="w-full h-full relative select-none bg-[#08090d]">
      <Canvas
        shadows
        camera={{ position: [38, 34, 52], fov: 42, near: 0.5, far: 380 }}
        // Performance: Cap DPR at 1.5 to eliminate 4K GPU fill-rate throttling
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: atmosphere.exposure,
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={[atmosphere.fogColor]} />
        <fog
          attach="fog"
          args={[atmosphere.fogColor, atmosphere.fogNear, atmosphere.fogFar]}
        />

        {/* 1. PHYSICAL SKY DOME */}
        <Sky
          distance={450000}
          sunPosition={atmosphere.sunPosition}
          rayleigh={atmosphere.skyRayleigh}
          turbidity={atmosphere.skyTurbidity}
          azimuth={atmosphere.skyAzimuth}
          inclination={atmosphere.skyElevation / 90}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* 2. OPTIMIZED DIRECTIONAL SUNLIGHT (Single Shadow Caster) */}
        <directionalLight
          position={atmosphere.sunPosition}
          color={atmosphere.sunColor}
          intensity={atmosphere.sunIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={10}
          shadow-camera-far={160}
          shadow-camera-left={-65}
          shadow-camera-right={65}
          shadow-camera-top={65}
          shadow-camera-bottom={-65}
          shadow-bias={-0.0005}
        />

        {/* 3. LIGHTWEIGHT AMBIENT & HEMISPHERE SKY FILL */}
        <ambientLight
          color={atmosphere.ambientColor}
          intensity={atmosphere.ambientIntensity * 0.7}
        />
        <hemisphereLight
          color={atmosphere.ambientColor}
          groundColor="#12151b"
          intensity={atmosphere.ambientIntensity * 0.6}
        />

        {/* 4. FAST ARCHITECTURAL SILHOUETTE RIM LIGHT (No shadow, fast specular) */}
        <directionalLight
          position={[-35, 25, -40]}
          color="#dfc285"
          intensity={0.5}
        />

        {/* 5. 3D DEVELOPMENT & LANDSCAPE */}
        <Suspense fallback={null}>
          <ModelLoader
            modelUrl={externalModelUrl}
            selectedTowerId={selectedTowerId}
            selectedFloorNumber={selectedFloorNumber}
            selectedApartmentId={selectedApartmentId}
            timeOfDay={timeOfDay}
            onSelectTower={onSelectTower}
            onSelectFloor={onSelectFloor}
            onSelectApartment={onSelectApartment}
          />
        </Suspense>

        {/* 6. CAMERA CONTROLLER */}
        <CameraController
          viewingMode={viewingMode}
          selectedTowerId={selectedTowerId}
          selectedFloorNumber={selectedFloorNumber}
          selectedApartmentIndex={selectedApartmentIndex}
          isUserInteractingRef={isUserInteractingRef}
          resetTrigger={resetTrigger}
        />
      </Canvas>
    </div>
  );
}
