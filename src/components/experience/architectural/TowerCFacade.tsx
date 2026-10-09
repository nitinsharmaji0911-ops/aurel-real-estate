'use client';

import React from 'react';
import * as THREE from 'three';
import { ARCH_MATERIALS } from '@/lib/materials';

interface TowerFacadeFloorProps {
  floorNumber: number;
  width: number;
  depth: number;
  floorHeight: number;
  isFloorSelected: boolean;
  isFloorHovered: boolean;
  isPenthouse: boolean;
  windowLitIntensity: number;
}

export function TowerCFloor({
  floorNumber,
  width,
  depth,
  floorHeight,
  isFloorSelected,
  isFloorHovered,
  isPenthouse,
  windowLitIntensity,
}: TowerFacadeFloorProps) {
  const slabThickness = 0.12;
  const glassHeight = floorHeight - slabThickness;
  const curWidth = width;
  const curDepth = depth;

  const isLit = (floorNumber * 4 + 3) % 4 !== 0;

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. EXTENDED FLOATING HORIZONTAL FLOOR TRAY (Slab projects past glass) */}
      <mesh position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        <boxGeometry args={[curWidth + 0.6, slabThickness, curDepth + 0.6]} />
        <meshStandardMaterial
          color={
            isFloorSelected
              ? '#dfc285'
              : isFloorHovered
              ? '#c5a059'
              : ARCH_MATERIALS.slabEdge.color
          }
          roughness={isFloorSelected ? 0.2 : ARCH_MATERIALS.slabEdge.roughness}
          metalness={isFloorSelected ? 0.8 : ARCH_MATERIALS.slabEdge.metalness}
          emissive={isFloorSelected ? '#c5a059' : isFloorHovered ? '#6e5628' : '#000000'}
          emissiveIntensity={isFloorSelected ? 0.75 : isFloorHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Underside Soffit Panel */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.02, 0]}>
        <boxGeometry args={[curWidth + 0.5, 0.04, curDepth + 0.5]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.limestone.color}
          roughness={ARCH_MATERIALS.limestone.roughness}
        />
      </mesh>

      {/* 2. RECESSED WRAPAROUND GLASS CURTAIN WALL */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[curWidth - 0.25, glassHeight, curDepth - 0.25]} />
        <meshStandardMaterial
          color={
            isFloorSelected
              ? '#ecd7a9'
              : isFloorHovered
              ? '#2c3e50'
              : ARCH_MATERIALS.curtainGlass.color
          }
          roughness={ARCH_MATERIALS.curtainGlass.roughness}
          metalness={isFloorSelected ? 0.4 : ARCH_MATERIALS.curtainGlass.metalness}
          transparent
          opacity={ARCH_MATERIALS.curtainGlass.opacity}
          emissive={
            isFloorSelected
              ? '#dfc285'
              : isLit
              ? ARCH_MATERIALS.curtainGlassLit.emissive
              : '#05090f'
          }
          emissiveIntensity={
            isFloorSelected
              ? 0.75
              : isLit
              ? ARCH_MATERIALS.curtainGlassLit.emissiveIntensity * windowLitIntensity
              : 0.05
          }
        />
      </mesh>

      {/* 3. FLUTED CHAMPAGNE BRONZE ACCENT PANELS BETWEEN BAYS */}
      {[-curWidth * 0.25, curWidth * 0.25].map((px, idx) => (
        <group key={`fluted-${idx}`}>
          <mesh position={[px, 0, curDepth / 2 + 0.02]}>
            <boxGeometry args={[0.32, glassHeight, 0.12]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
          <mesh position={[px, 0, -curDepth / 2 - 0.02]}>
            <boxGeometry args={[0.32, glassHeight, 0.12]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 4. WRAPAROUND BALCONY GLASS BALUSTRADE ON CANTILEVERED SLAB */}
      {/* Front Balcony Railing */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.32, curDepth / 2 + 0.28]}>
        <boxGeometry args={[curWidth * 0.72, 0.62, 0.04]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.balconyGlass.color}
          roughness={ARCH_MATERIALS.balconyGlass.roughness}
          transparent
          opacity={ARCH_MATERIALS.balconyGlass.opacity}
        />
      </mesh>
      {/* Bronze Top Rail */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.64, curDepth / 2 + 0.28]}>
        <boxGeometry args={[curWidth * 0.72, 0.04, 0.08]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.champagneBronze.color}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* 5. SOLID LIMESTONE REAR SHEAR CORE CORNERS */}
      {[
        [-curWidth / 2 + 0.15, -curDepth / 2 + 0.15],
        [curWidth / 2 - 0.15, -curDepth / 2 + 0.15],
      ].map(([cx, cz], idx) => (
        <mesh key={`core-${idx}`} position={[cx, 0, cz]}>
          <boxGeometry args={[0.42, glassHeight, 0.42]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
          />
        </mesh>
      ))}

      {/* SELECTED FLOOR WARM LIGHT */}
      {isFloorSelected && (
        <pointLight
          position={[0, 0, 0]}
          color="#ffdfa4"
          intensity={2.8}
          distance={18}
          decay={1.8}
        />
      )}
    </group>
  );
}
