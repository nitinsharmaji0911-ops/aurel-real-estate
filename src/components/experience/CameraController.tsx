'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import * as THREE from 'three';
import { TowerId, ViewingMode } from '@/types/property';
import {
  OVERVIEW_CAMERA,
  TOWER_CAMERAS,
  getFloorCameraView,
  getApartmentCameraView,
  CameraViewConfig,
} from '@/lib/camera';
import { TOWERS } from '@/data/development';

interface CameraControllerProps {
  viewingMode: ViewingMode;
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentIndex?: number;
  isUserInteractingRef: React.MutableRefObject<boolean>;
  resetTrigger: number;
}

export function CameraController({
  viewingMode,
  selectedTowerId,
  selectedFloorNumber,
  selectedApartmentIndex = 0,
  isUserInteractingRef,
  resetTrigger,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType | null>(null);

  const desiredPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...OVERVIEW_CAMERA.position));
  const desiredTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(...OVERVIEW_CAMERA.target));
  const isTransitioningRef = useRef<boolean>(true);
  const transitionStartRef = useRef<number>(Date.now());

  // Determine current camera configuration based on app state
  useEffect(() => {
    let targetConfig: CameraViewConfig = OVERVIEW_CAMERA;

    if (viewingMode === 'overview' || !selectedTowerId) {
      targetConfig = OVERVIEW_CAMERA;
    } else if (viewingMode === 'tower' || (viewingMode !== 'floor' && viewingMode !== 'apartment' && selectedTowerId)) {
      targetConfig = TOWER_CAMERAS[selectedTowerId] || OVERVIEW_CAMERA;
    } else if (viewingMode === 'floor' && selectedTowerId && selectedFloorNumber !== null) {
      targetConfig = getFloorCameraView(selectedTowerId, selectedFloorNumber);
    } else if (viewingMode === 'apartment' && selectedTowerId && selectedFloorNumber !== null) {
      const tower = TOWERS.find((t) => t.id === selectedTowerId);
      const unitsCount = tower?.unitsPerFloor || 4;
      targetConfig = getApartmentCameraView(selectedTowerId, selectedFloorNumber, selectedApartmentIndex, unitsCount);
    }

    desiredPosRef.current.set(...targetConfig.position);
    desiredTargetRef.current.set(...targetConfig.target);
    isTransitioningRef.current = true;
    transitionStartRef.current = Date.now();
  }, [viewingMode, selectedTowerId, selectedFloorNumber, selectedApartmentIndex, resetTrigger]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      const timeSinceStart = Date.now() - transitionStartRef.current;
      const lerpSpeed = Math.min(delta * 2.5, 0.12);

      camera.position.lerp(desiredPosRef.current, lerpSpeed);
      controlsRef.current.target.lerp(desiredTargetRef.current, lerpSpeed);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(desiredPosRef.current);
      const distTarget = controlsRef.current.target.distanceTo(desiredTargetRef.current);

      if ((distPos < 0.2 && distTarget < 0.1) || timeSinceStart > 3500) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={8}
      maxDistance={155}
      autoRotate={viewingMode === 'overview' && !isUserInteractingRef.current}
      autoRotateSpeed={0.35}
      onStart={() => {
        isUserInteractingRef.current = true;
        isTransitioningRef.current = false;
      }}
      onEnd={() => {
        isUserInteractingRef.current = false;
      }}
    />
  );
}
