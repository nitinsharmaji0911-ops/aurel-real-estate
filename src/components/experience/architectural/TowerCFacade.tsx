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
 * Tower C — The Solstice: Boutique Horizon Terraces
 * Features floating cantilevered floor trays with champagne bronze fascia,
 * continuous panoramic ribbon glass, recessed private terraces, and fluted bronze pilasters.
 */
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
  const slabThickness = 0.08;
  const glassHeight = floorHeight - slabThickness - 0.06;
  const curWidth = width;
  const curDepth = depth;

  const isLit = (floorNumber * 5 + 2) % 4 !== 0;

  // Mullion grid along the ribbon glazing
  const frontMullionsX = [-curWidth * 0.36, -curWidth * 0.18, 0, curWidth * 0.18, curWidth * 0.36];

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. ELEGANT FLOATING FLOOR TRAY (Thin, knife-edge horizontal cantilever) */}
      <mesh position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        <boxGeometry args={[curWidth + 0.45, slabThickness, curDepth + 0.45]} />
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

      {/* Champagne Bronze Knife-Edge Fascia Trim on Slab Perimeter */}
      <group position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        {/* Front & Back Fascia Trim */}
        <mesh position={[0, 0, curDepth / 2 + 0.23]}>
          <boxGeometry args={[curWidth + 0.46, slabThickness + 0.02, 0.03]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        <mesh position={[0, 0, -curDepth / 2 - 0.23]}>
          <boxGeometry args={[curWidth + 0.46, slabThickness + 0.02, 0.03]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        {/* Sides Fascia Trim */}
        <mesh position={[curWidth / 2 + 0.23, 0, 0]}>
          <boxGeometry args={[0.03, slabThickness + 0.02, curDepth + 0.46]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        <mesh position={[-curWidth / 2 - 0.23, 0, 0]}>
          <boxGeometry args={[0.03, slabThickness + 0.02, curDepth + 0.46]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      </group>

      {/* Warm Timber/Stone Soffit on Cantilever Underside */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.015, 0]}>
        <boxGeometry args={[curWidth + 0.38, 0.02, curDepth + 0.38]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.timberSoffit.color}
          roughness={ARCH_MATERIALS.timberSoffit.roughness}
        />
      </mesh>

      {/* 2. RECESSED PANORAMIC RIBBON GLASS CORE */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[curWidth - 0.24, glassHeight, curDepth - 0.24]} />
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

      {/* 3. VERTICAL GRAPHITE MULLIONS (Crisp 1.5m Bay Spacing) */}
      {frontMullionsX.map((mx, idx) => (
        <group key={`c-mull-${idx}`}>
          <mesh position={[mx, 0.03, curDepth / 2 - 0.1]}>
            <boxGeometry args={[0.05, glassHeight, 0.06]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[mx, 0.03, -curDepth / 2 + 0.1]}>
            <boxGeometry args={[0.05, glassHeight, 0.06]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 4. FLUTED CHAMPAGNE BRONZE VERTICAL ACCENT PILASTERS */}
      {[-curWidth * 0.24, curWidth * 0.24].map((px, idx) => (
        <mesh key={`fluted-${idx}`} position={[px, 0.03, curDepth / 2 - 0.02]} castShadow>
          <boxGeometry args={[0.26, glassHeight, 0.14]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      ))}

      {/* 5. WRAPAROUND RECESSED TERRACE WITH SEAMLESS GLASS BALUSTRADE */}
      <group position={[0, -floorHeight / 2 + slabThickness, curDepth / 2 + 0.2]}>
        {/* Continuous Front Glass Balustrade */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[curWidth * 0.82, 0.70, 0.03]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.balconyGlass.color}
            roughness={ARCH_MATERIALS.balconyGlass.roughness}
            transparent
            opacity={ARCH_MATERIALS.balconyGlass.opacity}
          />
        </mesh>
        {/* Continuous Champagne Bronze Handrail Cap */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[curWidth * 0.82, 0.035, 0.06]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      </group>

      {/* 6. REAR SOLID LIMESTONE SHEAR WALLS */}
      {[
        [-curWidth / 2 + 0.18, -curDepth / 2 + 0.18],
        [curWidth / 2 - 0.18, -curDepth / 2 + 0.18],
      ].map(([sx, sz], idx) => (
        <mesh key={`c-shear-${idx}`} position={[sx, 0.03, sz]} castShadow>
          <boxGeometry args={[0.38, glassHeight, 0.38]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
      ))}
    </group>
  );
}
