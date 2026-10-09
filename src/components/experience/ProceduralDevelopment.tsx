'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TOWERS } from '@/data/development';
import { TowerId, Apartment } from '@/types/property';
import { BuildingTower } from './BuildingTower';
import { getProceduralWaterNormalTexture } from '@/lib/water-texture';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';

interface ProceduralDevelopmentProps {
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  timeOfDay: TimeOfDay;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
}

// 1. FAST ANIMATED WATER COMPONENT (No transmission pass)
function DynamicWater({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const normalMap = useMemo(() => getProceduralWaterNormalTexture(), []);
  const atmosphere = ATMOSPHERES[timeOfDay];

  useFrame((_, delta) => {
    if (normalMap) {
      normalMap.offset.x += delta * 0.015;
      normalMap.offset.y += delta * 0.01;
    }
  });

  return (
    <mesh receiveShadow position={[-46, -0.05, 0]}>
      <boxGeometry args={[36, 0.2, 140]} />
      <meshStandardMaterial
        color={atmosphere.waterColor}
        normalMap={normalMap || undefined}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughness={0.12}
        metalness={0.85}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// 2. LIGHTWEIGHT LUXURY SUPERYACHT (No real-time point lights, glowing emissives)
function LuxuryYacht({
  position,
  rotationY = 0,
  scale = 1,
  bobOffset = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  bobOffset?: number;
}) {
  const yachtRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (yachtRef.current) {
      const t = clock.getElapsedTime() * 1.2 + bobOffset;
      yachtRef.current.position.y = position[1] + Math.sin(t) * 0.05;
      yachtRef.current.rotation.z = Math.sin(t * 0.8) * 0.012;
    }
  });

  return (
    <group ref={yachtRef} position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* Sleek Hull */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.2, 0.8, 11]} />
        <meshStandardMaterial color="#f0f3f6" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Pointed Bow */}
      <mesh position={[0, 0.45, 6]}>
        <coneGeometry args={[1.6, 2.2, 4]} />
        <meshStandardMaterial color="#f0f3f6" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Teak Swim Platform */}
      <mesh position={[0, 0.25, -5.6]}>
        <boxGeometry args={[2.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#614328" roughness={0.7} />
      </mesh>
      {/* Superstructure Cabin */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[2.5, 0.75, 6.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Tinted Cabin Windows with Warm Interior Glow */}
      <mesh position={[0, 1.15, 0.5]}>
        <boxGeometry args={[2.55, 0.35, 6.4]} />
        <meshStandardMaterial
          color="#0f1924"
          emissive="#ffd79e"
          emissiveIntensity={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Flybridge Deck */}
      <mesh position={[0, 1.75, -0.4]}>
        <boxGeometry args={[2.1, 0.55, 4.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      {/* Underwater Stern Glow Plate */}
      <mesh position={[0, 0.05, -5.8]}>
        <planeGeometry args={[2.4, 0.3]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
    </group>
  );
}

// 3. LIGHTWEIGHT STREETLAMP (Glowing emissive head, 0 point lights)
function ArchitecturalStreetlamp({
  position,
  intensity = 1.0,
}: {
  position: [number, number, number];
  intensity?: number;
}) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 6]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Horizontal Arm */}
      <mesh position={[0.4, 4.3, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.1]} />
        <meshStandardMaterial color="#c5a059" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Glowing Luminaire Head */}
      <mesh position={[0.8, 4.25, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.2]} />
        <meshBasicMaterial color="#fff0cc" />
      </mesh>
    </group>
  );
}

// 4. LOW-OVERHEAD ARCHITECTURAL TREE (1-2 draw calls per tree)
function RealisticTree({
  position,
  type = 'cypress',
  scale = 1,
}: {
  position: [number, number, number];
  type?: 'cypress' | 'pine' | 'canopy';
  scale?: number;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Granite Planter Curb */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.2, 1.3, 0.2, 10]} />
        <meshStandardMaterial color="#1f2128" roughness={0.7} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 2.6, 6]} />
        <meshStandardMaterial color="#2d2219" roughness={0.85} />
      </mesh>

      {/* Foliage */}
      {type === 'cypress' && (
        <mesh position={[0, 3.5, 0]}>
          <coneGeometry args={[1.4, 5.0, 7]} />
          <meshStandardMaterial color="#182e1e" roughness={0.7} />
        </mesh>
      )}

      {type === 'pine' && (
        <group position={[0, 3.0, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 0.6, 7]} />
            <meshStandardMaterial color="#213a27" roughness={0.65} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[1.0, 1.3, 0.5, 7]} />
            <meshStandardMaterial color="#2b4733" roughness={0.6} />
          </mesh>
        </group>
      )}

      {type === 'canopy' && (
        <mesh position={[0, 3.2, 0]}>
          <dodecahedronGeometry args={[1.9, 0]} />
          <meshStandardMaterial color="#203824" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

// 5. CONTEXT BUILDINGS
function ContextBuilding({
  position,
  args,
  rotationY = 0,
  windowIntensity = 1,
}: {
  position: [number, number, number];
  args: [number, number, number];
  rotationY?: number;
  windowIntensity?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, args[1] / 2, 0]}>
        <boxGeometry args={args} />
        <meshStandardMaterial color="#13141a" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, args[1] + 0.12, 0]}>
        <boxGeometry args={[args[0] + 0.3, 0.25, args[2] + 0.3]} />
        <meshStandardMaterial color="#22242c" roughness={0.5} />
      </mesh>
      {/* Horizontal Windows */}
      {Array.from({ length: Math.floor(args[1] / 4.0) }).map((_, idx) => (
        <mesh key={idx} position={[0, 2.4 + idx * 4.0, args[2] / 2 + 0.05]}>
          <planeGeometry args={[args[0] * 0.85, 1.2]} />
          <meshStandardMaterial
            color="#1b2430"
            emissive="#ffdca3"
            emissiveIntensity={0.25 * windowIntensity}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ProceduralDevelopment({
  selectedTowerId,
  selectedFloorNumber,
  selectedApartmentId,
  timeOfDay,
  onSelectTower,
  onSelectFloor,
  onSelectApartment,
}: ProceduralDevelopmentProps) {
  const atmosphere = ATMOSPHERES[timeOfDay];

  const trees = useMemo<
    Array<{ pos: [number, number, number]; type: 'cypress' | 'pine' | 'canopy'; s: number }>
  >(() => {
    return [
      { pos: [-8, 0, 8], type: 'cypress', s: 1.1 },
      { pos: [-12, 0, 14], type: 'pine', s: 1.0 },
      { pos: [-4, 0, 16], type: 'cypress', s: 1.2 },
      { pos: [0, 0, 8], type: 'canopy', s: 1.0 },
      { pos: [6, 0, 14], type: 'cypress', s: 0.9 },
      { pos: [12, 0, 6], type: 'pine', s: 1.1 },
      { pos: [14, 0, 18], type: 'canopy', s: 1.0 },
      { pos: [26, 0, -4], type: 'cypress', s: 1.2 },
      { pos: [18, 0, -8], type: 'pine', s: 1.0 },
      { pos: [-6, 0, -14], type: 'cypress', s: 1.1 },
      { pos: [-18, 0, -22], type: 'pine', s: 1.2 },
      { pos: [-24, 0, -10], type: 'cypress', s: 1.0 },
      { pos: [-28, 0, 6], type: 'canopy', s: 1.1 },
      { pos: [28, 0, 22], type: 'cypress', s: 1.1 },
      { pos: [10, 0, 26], type: 'pine', s: 1.2 },
      { pos: [-2, 0, 24], type: 'cypress', s: 0.95 },
      { pos: [-16, 0, 22], type: 'canopy', s: 1.0 },
      { pos: [32, 0, -8], type: 'pine', s: 1.1 },
      { pos: [2, 0, -28], type: 'cypress', s: 1.2 },
    ];
  }, []);

  const streetlamps: Array<[number, number, number]> = [
    [-28, 0, 34],
    [-14, 0, 34],
    [0, 0, 34],
    [14, 0, 34],
    [28, 0, 34],
    [-27, 0, 10],
    [-27, 0, -10],
    [-27, 0, -26],
  ];

  return (
    <group>
      {/* 1. MAIN GROUND SITE BASE */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[145, 0.4, 145]} />
        <meshStandardMaterial color="#0a0b0e" roughness={0.9} />
      </mesh>

      {/* 2. DYNAMIC OCEAN WATER */}
      <DynamicWater timeOfDay={timeOfDay} />

      {/* 3. MARINA PROMENADE & YACHTS */}
      <group position={[-46, 0, 0]}>
        {/* Granite Seawall */}
        <mesh receiveShadow position={[17.5, 0.25, 0]}>
          <boxGeometry args={[3.2, 0.6, 138]} />
          <meshStandardMaterial color="#1e2026" roughness={0.6} />
        </mesh>
        {/* Hardwood Boardwalk */}
        <mesh receiveShadow position={[15.6, 0.35, 0]}>
          <boxGeometry args={[1.4, 0.15, 138]} />
          <meshStandardMaterial color="#3b2b1d" roughness={0.7} />
        </mesh>

        {/* Piers & Moored Yachts */}
        {[
          { z: -38, yRot: 0.05, scale: 1.05 },
          { z: -14, yRot: -0.08, scale: 1.15 },
          { z: 14, yRot: 0.06, scale: 0.95 },
          { z: 38, yRot: -0.04, scale: 1.1 },
        ].map((pier, idx) => (
          <group key={idx} position={[5.5, 0.15, pier.z]}>
            <mesh receiveShadow>
              <boxGeometry args={[17, 0.3, 2.4]} />
              <meshStandardMaterial color="#2c231a" roughness={0.7} />
            </mesh>
            <mesh position={[-7.8, 0.4, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.5, 6]} />
              <meshBasicMaterial color="#dfc285" />
            </mesh>
            <LuxuryYacht
              position={[-1.2, 0.05, 3.8]}
              rotationY={pier.yRot}
              scale={pier.scale}
              bobOffset={idx * 1.5}
            />
          </group>
        ))}
      </group>

      {/* 4. CENTRAL PODIUM PARK & WATER MIRROR */}
      <mesh receiveShadow position={[2, 0.02, 2]}>
        <cylinderGeometry args={[23, 24, 0.16, 24]} />
        <meshStandardMaterial color="#122016" roughness={0.85} />
      </mesh>

      <mesh receiveShadow position={[2, 0.12, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 0.16, 24]} />
        <meshStandardMaterial color="#0b2436" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[2, 0.22, 0]}>
        <torusGeometry args={[8.5, 0.35, 8, 24]} />
        <meshStandardMaterial color="#b39762" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 5. CLUBHOUSE PAVILION */}
      <group position={[18, 0, -2]}>
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <boxGeometry args={[13, 3.2, 8.5]} />
          <meshStandardMaterial color="#17181f" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.6, 4.3]}>
          <planeGeometry args={[12, 2.8]} />
          <meshStandardMaterial
            color="#223342"
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, 3.3, 0]}>
          <boxGeometry args={[14.6, 0.28, 10.2]} />
          <meshStandardMaterial color="#c5a059" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Pool */}
        <mesh position={[0, 0.3, 7.5]}>
          <boxGeometry args={[9.8, 0.1, 3.2]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#0096c7"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 6. ASPHALT DRIVES & MARKINGS */}
      <mesh receiveShadow position={[0, 0.02, 34]}>
        <boxGeometry args={[95, 0.08, 7.0]} />
        <meshStandardMaterial color="#16171d" roughness={0.75} />
      </mesh>
      {[-30, -15, 0, 15, 30].map((rx, idx) => (
        <mesh key={idx} position={[rx, 0.07, 34]}>
          <planeGeometry args={[4.0, 0.3]} />
          <meshStandardMaterial color="#d4cebe" roughness={0.7} />
        </mesh>
      ))}

      {/* 7. STREETLAMPS */}
      {streetlamps.map((pos, idx) => (
        <ArchitecturalStreetlamp
          key={idx}
          position={pos}
          intensity={atmosphere.streetLightIntensity}
        />
      ))}

      {/* 8. TREES */}
      {trees.map((t, idx) => (
        <RealisticTree key={idx} position={t.pos} type={t.type} scale={t.s} />
      ))}

      {/* 9. CONTEXT BUILDINGS */}
      <ContextBuilding
        position={[-22, 0, 50]}
        args={[24, 16, 14]}
        rotationY={0.05}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ContextBuilding
        position={[14, 0, 52]}
        args={[28, 20, 16]}
        rotationY={-0.1}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ContextBuilding
        position={[46, 0, 38]}
        args={[20, 14, 20]}
        rotationY={0.2}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ContextBuilding
        position={[50, 0, -18]}
        args={[24, 24, 18]}
        rotationY={-0.15}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ContextBuilding
        position={[38, 0, -44]}
        args={[30, 18, 16]}
        rotationY={0.1}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ContextBuilding
        position={[-18, 0, -50]}
        args={[34, 22, 18]}
        rotationY={-0.08}
        windowIntensity={atmosphere.windowLightIntensity}
      />

      {/* 10. RESIDENTIAL TOWERS */}
      {TOWERS.map((tower) => (
        <BuildingTower
          key={tower.id}
          tower={tower}
          isSelectedTower={selectedTowerId === tower.id}
          selectedFloorNumber={selectedTowerId === tower.id ? selectedFloorNumber : null}
          selectedApartmentId={selectedTowerId === tower.id ? selectedApartmentId : null}
          timeOfDay={timeOfDay}
          onSelectTower={onSelectTower}
          onSelectFloor={onSelectFloor}
          onSelectApartment={onSelectApartment}
        />
      ))}
    </group>
  );
}
