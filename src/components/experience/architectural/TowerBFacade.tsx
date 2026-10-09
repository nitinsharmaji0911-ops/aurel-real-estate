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

export function TowerBFloor({
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

  // Setback on top terraced levels (floors 16-18)
  const setbackFactor = floorNumber >= 17 ? 0.88 : floorNumber >= 15 ? 0.94 : 1.0;
  const curWidth = width * setbackFactor;
  const curDepth = depth * setbackFactor;

  const isLit = (floorNumber * 3 + 1) % 4 !== 0;
  const isEvenFloor = floorNumber % 2 === 0;

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. SLIM HORIZONTAL SLAB */}
      <mesh position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        <boxGeometry args={[curWidth + 0.15, slabThickness, curDepth + 0.15]} />
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

      {/* 2. HORIZONTAL STONE SPANDREL BAND */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.14, 0]}>
        <boxGeometry args={[curWidth - 0.05, 0.28, curDepth - 0.05]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.limestone.color}
          roughness={ARCH_MATERIALS.limestone.roughness}
          metalness={ARCH_MATERIALS.limestone.metalness}
        />
      </mesh>

      {/* 3. RECESSED GLAZING CORE */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[curWidth - 0.2, glassHeight - 0.28, curDepth - 0.2]} />
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

      {/* 4. VERTICAL GRAPHITE MULLIONS */}
      {[-curWidth * 0.36, -curWidth * 0.18, 0, curWidth * 0.18, curWidth * 0.36].map((mx, idx) => (
        <group key={`mull-${idx}`}>
          <mesh position={[mx, 0.14, curDepth / 2 - 0.08]}>
            <boxGeometry args={[0.07, glassHeight - 0.28, 0.08]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[mx, 0.14, -curDepth / 2 + 0.08]}>
            <boxGeometry args={[0.07, glassHeight - 0.28, 0.08]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 5. ALTERNATING STAGGERED BALCONIES */}
      {isEvenFloor ? (
        /* Even floor: Center Grand Balcony */
        <group position={[0, -floorHeight / 2 + slabThickness / 2, curDepth / 2 + 0.6]}>
          <mesh>
            <boxGeometry args={[curWidth * 0.46, slabThickness, 1.2]} />
            <meshStandardMaterial
              color={isFloorSelected ? '#dfc285' : ARCH_MATERIALS.slabEdge.color}
              roughness={0.5}
            />
          </mesh>
          {/* Glass Railing */}
          <mesh position={[0, 0.36, 0.58]}>
            <boxGeometry args={[curWidth * 0.45, 0.62, 0.04]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.balconyGlass.color}
              roughness={ARCH_MATERIALS.balconyGlass.roughness}
              transparent
              opacity={ARCH_MATERIALS.balconyGlass.opacity}
            />
          </mesh>
          {/* Handrail */}
          <mesh position={[0, 0.68, 0.58]}>
            <boxGeometry args={[curWidth * 0.46, 0.04, 0.08]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
        </group>
      ) : (
        /* Odd floor: Dual Flank Balconies */
        <group>
          {[-curWidth * 0.32, curWidth * 0.32].map((bx, idx) => (
            <group key={`flank-${idx}`} position={[bx, -floorHeight / 2 + slabThickness / 2, curDepth / 2 + 0.55]}>
              <mesh>
                <boxGeometry args={[curWidth * 0.28, slabThickness, 1.1]} />
                <meshStandardMaterial
                  color={isFloorSelected ? '#dfc285' : ARCH_MATERIALS.slabEdge.color}
                  roughness={0.5}
                />
              </mesh>
              <mesh position={[0, 0.36, 0.53]}>
                <boxGeometry args={[curWidth * 0.27, 0.62, 0.04]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.balconyGlass.color}
                  roughness={ARCH_MATERIALS.balconyGlass.roughness}
                  transparent
                  opacity={ARCH_MATERIALS.balconyGlass.opacity}
                />
              </mesh>
              <mesh position={[0, 0.68, 0.53]}>
                <boxGeometry args={[curWidth * 0.28, 0.04, 0.08]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.champagneBronze.color}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 6. UPPER LEVEL LANDSCAPED SKY PLANTERS (On setback floors) */}
      {floorNumber >= 15 && (
        <group position={[curWidth / 2 + 0.35, -floorHeight / 2 + slabThickness + 0.18, 0]}>
          <mesh>
            <boxGeometry args={[0.6, 0.35, curDepth * 0.6]} />
            <meshStandardMaterial color={ARCH_MATERIALS.limestone.color} roughness={0.6} />
          </mesh>
          {/* Green Shrubbery */}
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.5, 0.2, curDepth * 0.55]} />
            <meshStandardMaterial color="#2d4a34" roughness={0.7} />
          </mesh>
        </group>
      )}

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
