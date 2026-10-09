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
  const slabThickness = 0.12;
  const glassHeight = floorHeight - slabThickness;
  const curWidth = isPenthouse ? width * 0.94 : width;
  const curDepth = isPenthouse ? depth * 0.94 : depth;

  // Window occupancy lighting pattern
  const isLit = (floorNumber * 5 + 2) % 4 !== 0;

  // Mullion bay positions across width and depth
  const xBays = [-curWidth * 0.35, -curWidth * 0.12, curWidth * 0.12, curWidth * 0.35];
  const zBays = [-curDepth * 0.25, curDepth * 0.25];

  return (
    <group position={[0, floorHeight / 2, 0]}>
      {/* 1. SLIM STRUCTURAL FLOOR SLAB (Thin & Proportionate) */}
      <mesh position={[0, -floorHeight / 2 + slabThickness / 2, 0]}>
        <boxGeometry args={[curWidth + 0.1, slabThickness, curDepth + 0.1]} />
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

      {/* Shadow Reveal Joint underneath slab */}
      <mesh position={[0, -floorHeight / 2 + slabThickness + 0.02, 0]}>
        <boxGeometry args={[curWidth - 0.08, 0.04, curDepth - 0.08]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.slabShadowReveal.color}
          roughness={ARCH_MATERIALS.slabShadowReveal.roughness}
        />
      </mesh>

      {/* 2. RECESSED FLOOR-TO-CEILING GLASS CURTAIN WALL CORE */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[curWidth - 0.2, glassHeight, curDepth - 0.2]} />
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

      {/* 3. VERTICAL GRAPHITE WINDOW MULLIONS */}
      {/* Front & Back mullions */}
      {xBays.map((bx, idx) => (
        <group key={`fb-${idx}`}>
          <mesh position={[bx, 0, curDepth / 2 - 0.08]}>
            <boxGeometry args={[0.07, glassHeight, 0.08]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[bx, 0, -curDepth / 2 + 0.08]}>
            <boxGeometry args={[0.07, glassHeight, 0.08]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* Side mullions */}
      {zBays.map((bz, idx) => (
        <group key={`side-${idx}`}>
          <mesh position={[curWidth / 2 - 0.08, 0, bz]}>
            <boxGeometry args={[0.08, glassHeight, 0.07]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
          <mesh position={[-curWidth / 2 + 0.08, 0, bz]}>
            <boxGeometry args={[0.08, glassHeight, 0.07]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.graphiteFrame.color}
              roughness={ARCH_MATERIALS.graphiteFrame.roughness}
              metalness={ARCH_MATERIALS.graphiteFrame.metalness}
            />
          </mesh>
        </group>
      ))}

      {/* 4. SOLID STRUCTURAL CORNER COLUMNS (Warm Off-White Stone) */}
      {[
        [-curWidth / 2 + 0.18, -curDepth / 2 + 0.18],
        [curWidth / 2 - 0.18, -curDepth / 2 + 0.18],
        [-curWidth / 2 + 0.18, curDepth / 2 - 0.18],
        [curWidth / 2 - 0.18, curDepth / 2 - 0.18],
      ].map(([cx, cz], idx) => (
        <mesh key={`col-${idx}`} position={[cx, 0, cz]}>
          <boxGeometry args={[0.36, glassHeight, 0.36]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
            metalness={ARCH_MATERIALS.limestone.metalness}
          />
        </mesh>
      ))}

      {/* 5. VERTICAL CHAMPAGNE BRONZE SOLAR FINS */}
      {[-curWidth * 0.24, curWidth * 0.24].map((fx, idx) => (
        <mesh key={`fin-${idx}`} position={[fx, 0, curDepth / 2 + 0.12]}>
          <boxGeometry args={[0.08, glassHeight + 0.06, 0.26]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      ))}

      {/* 6. RECESSED BALCONIES & TINTED GLASS BALUSTRADES */}
      {/* Front Balcony Tray */}
      <group position={[0, -floorHeight / 2 + slabThickness / 2, curDepth / 2 + 0.65]}>
        <mesh>
          <boxGeometry args={[curWidth * 0.58, slabThickness, 1.25]} />
          <meshStandardMaterial
            color={isFloorSelected ? '#dfc285' : ARCH_MATERIALS.slabEdge.color}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* Front Balcony Glass Railing */}
        <mesh position={[0, 0.38, 0.6]}>
          <boxGeometry args={[curWidth * 0.57, 0.64, 0.04]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.balconyGlass.color}
            roughness={ARCH_MATERIALS.balconyGlass.roughness}
            metalness={ARCH_MATERIALS.balconyGlass.metalness}
            transparent
            opacity={ARCH_MATERIALS.balconyGlass.opacity}
          />
        </mesh>
        {/* Bronze Handrail Cap */}
        <mesh position={[0, 0.72, 0.6]}>
          <boxGeometry args={[curWidth * 0.58, 0.04, 0.08]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        {/* Balcony Side Railings */}
        {[-curWidth * 0.285, curWidth * 0.285].map((sx, sIdx) => (
          <group key={`side-rail-${sIdx}`} position={[sx, 0, 0]}>
            <mesh position={[0, 0.38, 0]}>
              <boxGeometry args={[0.04, 0.64, 1.2]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.balconyGlass.color}
                roughness={ARCH_MATERIALS.balconyGlass.roughness}
                metalness={ARCH_MATERIALS.balconyGlass.metalness}
                transparent
                opacity={ARCH_MATERIALS.balconyGlass.opacity}
              />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[0.06, 0.04, 1.2]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.champagneBronze.color}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* SELECTED FLOOR WARM ILLUMINATION LIGHT */}
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
