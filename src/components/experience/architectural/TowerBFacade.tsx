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

/**
 * Tower B — The Horizon: Contemporary Terraced Architecture
 * Features alternating staggered loggia balconies, deep window reveals,
 * controlled horizontal limestone articulation, and upper setback sky gardens.
 */
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
  const slabThickness = 0.10;
  const spandrelHeight = 0.28;
  const visionGlassHeight = floorHeight - spandrelHeight;

  // Progressive setback on upper terraced levels (floors 15-18)
  const setbackFactor = floorNumber >= 17 ? 0.88 : floorNumber >= 15 ? 0.94 : 1.0;
  const curWidth = width * setbackFactor;
  const curDepth = depth * setbackFactor;

  const isLit = (floorNumber * 4 + 1) % 4 !== 0;
  const isEvenFloor = floorNumber % 2 === 0;

  // Mullion grid across the facade
  const mullionsX = [-curWidth * 0.35, -curWidth * 0.12, curWidth * 0.12, curWidth * 0.35];

  // Loggia position alternates: left on even floors, right on odd floors
  const loggiaOffset = isEvenFloor ? -curWidth * 0.24 : curWidth * 0.24;
  const loggiaWidth = curWidth * 0.44;

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. SLIM STRUCTURAL SLAB CORE */}
      <mesh position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        <boxGeometry args={[curWidth - 0.02, slabThickness, curDepth - 0.02]} />
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

      {/* 2. RECESSED SHADOW REVEAL */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.012, 0]}>
        <boxGeometry args={[curWidth - 0.04, 0.025, curDepth - 0.04]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.slabShadowReveal.color}
          roughness={ARCH_MATERIALS.slabShadowReveal.roughness}
        />
      </mesh>

      {/* 3. HORIZONTAL LIMESTONE SPANDREL RIBBON (Controlled Horizontal Articulation) */}
      <group position={[0, -floorHeight / 2 + spandrelHeight / 2, 0]}>
        {/* Front & Back spandrels */}
        <mesh position={[0, 0, curDepth / 2 - 0.04]}>
          <boxGeometry args={[curWidth - 0.1, spandrelHeight, 0.08]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
        <mesh position={[0, 0, -curDepth / 2 + 0.04]}>
          <boxGeometry args={[curWidth - 0.1, spandrelHeight, 0.08]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
        {/* Sides spandrels */}
        <mesh position={[curWidth / 2 - 0.04, 0, 0]}>
          <boxGeometry args={[0.08, spandrelHeight, curDepth - 0.1]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
        <mesh position={[-curWidth / 2 + 0.04, 0, 0]}>
          <boxGeometry args={[0.08, spandrelHeight, curDepth - 0.1]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
      </group>

      {/* 4. RECESSED GLAZED WALL CORE (Deep Window Reveals) */}
      <mesh position={[0, spandrelHeight / 2, 0]}>
        <boxGeometry args={[curWidth - 0.22, visionGlassHeight - 0.02, curDepth - 0.22]} />
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
              : '#04070c'
          }
          emissiveIntensity={
            isFloorSelected
              ? 0.75
              : isLit
              ? ARCH_MATERIALS.curtainGlassLit.emissiveIntensity * windowLitIntensity
              : 0.04
          }
        />
      </mesh>

      {/* 5. VERTICAL LIMESTONE PIERS & GRAPHITE MULLIONS */}
      {/* Front mullions */}
      {mullionsX.map((mx, idx) => (
        <mesh key={`b-mull-${idx}`} position={[mx, spandrelHeight / 2, curDepth / 2 - 0.06]}>
          <boxGeometry args={[0.06, visionGlassHeight, 0.08]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.graphiteFrame.color}
            roughness={ARCH_MATERIALS.graphiteFrame.roughness}
            metalness={ARCH_MATERIALS.graphiteFrame.metalness}
          />
        </mesh>
      ))}

      {/* Solid vertical piers at building corners */}
      {[
        [-curWidth / 2 + 0.16, curDepth / 2 - 0.16],
        [curWidth / 2 - 0.16, curDepth / 2 - 0.16],
        [-curWidth / 2 + 0.16, -curDepth / 2 + 0.16],
        [curWidth / 2 - 0.16, -curDepth / 2 + 0.16],
      ].map(([px, pz], idx) => (
        <mesh key={`b-pier-${idx}`} position={[px, 0, pz]} castShadow>
          <boxGeometry args={[0.34, floorHeight, 0.34]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
      ))}

      {/* 6. ALTERNATING STAGGERED LOGGIA BALCONY */}
      <group position={[loggiaOffset, -floorHeight / 2, curDepth / 2 + 0.4]}>
        {/* Balcony Floor Slab */}
        <mesh position={[0, slabThickness / 2, 0]}>
          <boxGeometry args={[loggiaWidth, slabThickness, 0.85]} />
          <meshStandardMaterial
            color={isFloorSelected ? '#dfc285' : ARCH_MATERIALS.limestone.color}
            roughness={0.6}
          />
        </mesh>
        {/* Tinted Safety Glass Balustrade */}
        <mesh position={[0, slabThickness + 0.38, 0.41]}>
          <boxGeometry args={[loggiaWidth - 0.02, 0.72, 0.03]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.balconyGlass.color}
            roughness={ARCH_MATERIALS.balconyGlass.roughness}
            transparent
            opacity={ARCH_MATERIALS.balconyGlass.opacity}
          />
        </mesh>
        {/* Champagne Bronze Handrail */}
        <mesh position={[0, slabThickness + 0.75, 0.41]}>
          <boxGeometry args={[loggiaWidth, 0.035, 0.06]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        {/* Side Glass Return */}
        <mesh
          position={[
            isEvenFloor ? loggiaWidth / 2 - 0.015 : -loggiaWidth / 2 + 0.015,
            slabThickness + 0.38,
            0,
          ]}
        >
          <boxGeometry args={[0.03, 0.72, 0.82]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.balconyGlass.color}
            roughness={ARCH_MATERIALS.balconyGlass.roughness}
            transparent
            opacity={ARCH_MATERIALS.balconyGlass.opacity}
          />
        </mesh>
      </group>

      {/* 7. UPPER SETBACK SKY PLANTERS (Floors 15-18) */}
      {floorNumber >= 15 && (
        <group position={[0, -floorHeight / 2 + 0.28, -curDepth / 2 - 0.35]}>
          {/* Planter Box in Travertine */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[curWidth * 0.75, 0.45, 0.55]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.limestoneLight.color}
              roughness={0.65}
            />
          </mesh>
          {/* Lush Greenery in Planter */}
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[curWidth * 0.72, 0.18, 0.48]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.greenRoof.color}
              roughness={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
