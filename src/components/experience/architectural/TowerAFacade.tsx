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
 * Tower A — The Aurel Crown: Slender Luxury Skyscraper
 * Features continuous vertical curtain wall glazing, slim champagne bronze architectural fins,
 * flush floor spandrels, recessed inset loggias, and solid limestone structural corner columns.
 */
export function TowerAFloor({
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
  const curWidth = isPenthouse ? width * 0.94 : width;
  const curDepth = isPenthouse ? depth * 0.94 : depth;

  // Occupancy lighting rhythm
  const isLit = (floorNumber * 7 + 3) % 5 !== 0;

  // Window bay divisions (realistic 1.5m - 1.8m spacing)
  const frontMullionsX = [-curWidth * 0.36, -curWidth * 0.18, 0, curWidth * 0.18, curWidth * 0.36];
  const sideMullionsZ = [-curDepth * 0.26, 0, curDepth * 0.26];
  const verticalFinsX = [-curWidth * 0.27, -curWidth * 0.09, curWidth * 0.09, curWidth * 0.27];

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. STRUCTURAL SLAB CORE (Flush within envelope, no crude protruding overhang) */}
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

      {/* Subtle fine shadow reveal line beneath slab (0.025m deep, not a thick black gap) */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.012, 0]}>
        <boxGeometry args={[curWidth - 0.04, 0.025, curDepth - 0.04]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.slabShadowReveal.color}
          roughness={ARCH_MATERIALS.slabShadowReveal.roughness}
        />
      </mesh>

      {/* 2. CONTINUOUS GLAZED CURTAIN WALL (Neutral Blue-Grey Vision Glass) */}
      <mesh position={[0, spandrelHeight / 2, 0]}>
        <boxGeometry args={[curWidth - 0.12, visionGlassHeight - 0.02, curDepth - 0.12]} />
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
              : 0.03
          }
        />
      </mesh>

      {/* 3. FLUSH GLASS SPANDREL BANDS (Visually blends slab with curtain wall) */}
      <group position={[0, -floorHeight / 2 + spandrelHeight / 2, 0]}>
        {/* Front & Back Spandrel */}
        <mesh position={[0, 0, curDepth / 2 - 0.05]}>
          <boxGeometry args={[curWidth - 0.14, spandrelHeight, 0.04]} />
          <meshStandardMaterial
            color="#141c24"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, -curDepth / 2 + 0.05]}>
          <boxGeometry args={[curWidth - 0.14, spandrelHeight, 0.04]} />
          <meshStandardMaterial
            color="#141c24"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
        {/* Sides Spandrel */}
        <mesh position={[curWidth / 2 - 0.05, 0, 0]}>
          <boxGeometry args={[0.04, spandrelHeight, curDepth - 0.14]} />
          <meshStandardMaterial
            color="#141c24"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[-curWidth / 2 + 0.05, 0, 0]}>
          <boxGeometry args={[0.04, spandrelHeight, curDepth - 0.14]} />
          <meshStandardMaterial
            color="#141c24"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* 4. SOLID LIMESTONE CORNER COLUMNS (Warm Off-White French Limestone) */}
      {[
        [-curWidth / 2 + 0.16, -curDepth / 2 + 0.16],
        [curWidth / 2 - 0.16, -curDepth / 2 + 0.16],
        [-curWidth / 2 + 0.16, curDepth / 2 - 0.16],
        [curWidth / 2 - 0.16, curDepth / 2 - 0.16],
      ].map(([cx, cz], idx) => (
        <mesh key={`col-${idx}`} position={[cx, 0, cz]} castShadow>
          <boxGeometry args={[0.32, floorHeight, 0.32]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
      ))}

      {/* 5. VERTICAL GRAPHITE MULLIONS (Precision window divisions) */}
      {/* Front & Back elevations */}
      {frontMullionsX.map((mx, idx) => (
        <group key={`mull-fb-${idx}`}>
          <mesh position={[mx, spandrelHeight / 2, curDepth / 2 - 0.04]}>
            <boxGeometry args={[0.05, visionGlassHeight, 0.06]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[mx, spandrelHeight / 2, -curDepth / 2 + 0.04]}>
            <boxGeometry args={[0.05, visionGlassHeight, 0.06]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* Side elevations */}
      {sideMullionsZ.map((mz, idx) => (
        <group key={`mull-sides-${idx}`}>
          <mesh position={[curWidth / 2 - 0.04, spandrelHeight / 2, mz]}>
            <boxGeometry args={[0.06, visionGlassHeight, 0.05]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[-curWidth / 2 + 0.04, spandrelHeight / 2, mz]}>
            <boxGeometry args={[0.06, visionGlassHeight, 0.05]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 6. SLIM VERTICAL CHAMPAGNE BRONZE ARCHITECTURAL FINS */}
      {/* Continuous vertical projection creating soaring verticality */}
      {verticalFinsX.map((fx, idx) => (
        <group key={`fin-${idx}`}>
          <mesh position={[fx, 0, curDepth / 2 + 0.14]} castShadow>
            <boxGeometry args={[0.06, floorHeight, 0.28]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
          <mesh position={[fx, 0, -curDepth / 2 - 0.14]} castShadow>
            <boxGeometry args={[0.06, floorHeight, 0.28]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 7. RECESSED INSET LOGGIA BALCONY (Centered, architectural depth) */}
      {floorNumber % 2 !== 0 && (
        <group position={[0, -floorHeight / 2, curDepth / 2 + 0.35]}>
          {/* Balcony Floor Slab with Limestone Finish */}
          <mesh position={[0, slabThickness / 2, 0]}>
            <boxGeometry args={[curWidth * 0.44, slabThickness, 0.75]} />
            <meshStandardMaterial
              color={isFloorSelected ? '#dfc285' : ARCH_MATERIALS.limestone.color}
              roughness={0.6}
            />
          </mesh>

          {/* Laminated Glass Safety Railing with Bronze Handrail */}
          <mesh position={[0, slabThickness + 0.38, 0.36]}>
            <boxGeometry args={[curWidth * 0.43, 0.72, 0.03]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.balconyGlass.color}
              roughness={ARCH_MATERIALS.balconyGlass.roughness}
              transparent
              opacity={ARCH_MATERIALS.balconyGlass.opacity}
            />
          </mesh>
          {/* Fine Champagne Bronze Top Rail */}
          <mesh position={[0, slabThickness + 0.75, 0.36]}>
            <boxGeometry args={[curWidth * 0.44, 0.035, 0.06]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
          {/* Return side glass railings */}
          <mesh position={[-curWidth * 0.215, slabThickness + 0.38, 0]}>
            <boxGeometry args={[0.03, 0.72, 0.72]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.balconyGlass.color}
              roughness={ARCH_MATERIALS.balconyGlass.roughness}
              transparent
              opacity={ARCH_MATERIALS.balconyGlass.opacity}
            />
          </mesh>
          <mesh position={[curWidth * 0.215, slabThickness + 0.38, 0]}>
            <boxGeometry args={[0.03, 0.72, 0.72]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.balconyGlass.color}
              roughness={ARCH_MATERIALS.balconyGlass.roughness}
              transparent
              opacity={ARCH_MATERIALS.balconyGlass.opacity}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
