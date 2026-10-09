'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

interface JapaneseBuildingProps {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
}

export const JAPANESE_BUILDING_MODEL_URL = '/models/japanese_building__cc0.glb';

/**
 * Japanese Building Real Architectural Model (CC0)
 * Photorealistic textured 3D architectural model with concrete, glass, metal, and rooftop details.
 */
export function JapaneseBuilding({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  isHovered = false,
  isSelected = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: JapaneseBuildingProps) {
  const { scene } = useGLTF(JAPANESE_BUILDING_MODEL_URL);

  // Clone scene so multiple instances can be rendered independently in Three.js
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        // Ensure materials properly react to scene lighting
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.needsUpdate = true;
            });
          } else {
            mesh.material.needsUpdate = true;
          }
        }
      }
    });

    return clone;
  }, [scene, castShadow, receiveShadow]);

  // The model's base sits at minY = -4.69, so a +4.69 Y-offset places its ground floor flush with Y = 0
  const yBaseOffset = 4.69;

  const finalScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      scale={finalScale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <group position={[0, yBaseOffset, 0]}>
        <primitive object={clonedScene} />

        {/* Interactive Selection / Hover Glow Aura */}
        {(isSelected || isHovered) && (
          <mesh position={[0, 12, 0]}>
            <boxGeometry args={[17.2, 35.2, 16.8]} />
            <meshBasicMaterial
              color={isSelected ? '#c5a059' : '#e0c58a'}
              wireframe
              transparent
              opacity={isSelected ? 0.45 : 0.25}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// Preload the GLB model asset for instant rendering
useGLTF.preload(JAPANESE_BUILDING_MODEL_URL);
