'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TOWERS } from '@/data/development';
import { TowerId, Apartment } from '@/types/property';
import { BuildingTower } from './BuildingTower';
import { getProceduralWaterNormalTexture } from '@/lib/water-texture';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';
import { ARCH_MATERIALS } from '@/lib/materials';

interface ProceduralDevelopmentProps {
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  timeOfDay: TimeOfDay;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
}

// 1. REALISTIC ANIMATED OCEAN WATER
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
        normalScale={new THREE.Vector2(0.65, 0.65)}
        roughness={0.1}
        metalness={0.88}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// 2. LUXURY SUPERYACHT (Refined Yacht Model)
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
      {/* Sleek Hull in Off-White Marine Gelcoat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.2, 0.8, 11]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 0.45, 6]}>
        <coneGeometry args={[1.6, 2.2, 4]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Teak Swim Platform */}
      <mesh position={[0, 0.25, -5.6]}>
        <boxGeometry args={[2.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#6b4c2e" roughness={0.7} />
      </mesh>
      {/* Cabin Deck */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[2.5, 0.75, 6.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Tinted Cabin Glazing */}
      <mesh position={[0, 1.15, 0.5]}>
        <boxGeometry args={[2.55, 0.35, 6.4]} />
        <meshStandardMaterial
          color="#162635"
          emissive="#ffd79e"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Flybridge Deck & Arch */}
      <mesh position={[0, 1.75, -0.4]}>
        <boxGeometry args={[2.1, 0.55, 4.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Teak Deck Inserts */}
      <mesh position={[0, 0.86, 1.2]}>
        <boxGeometry args={[2.2, 0.02, 4.0]} />
        <meshStandardMaterial color="#7a5534" roughness={0.65} />
      </mesh>
    </group>
  );
}

// 3. ARCHITECTURAL STREETLAMP
function ArchitecturalStreetlamp({
  position,
  intensity = 1.0,
}: {
  position: [number, number, number];
  intensity?: number;
}) {
  return (
    <group position={position}>
      {/* Slender Graphite Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 6]} />
        <meshStandardMaterial color="#22252c" roughness={0.45} metalness={0.7} />
      </mesh>
      {/* Cantilevered Arm */}
      <mesh position={[0.4, 4.3, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.08]} />
        <meshStandardMaterial color="#9e845a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Glowing Luminaire Head */}
      <mesh position={[0.8, 4.25, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.18]} />
        <meshBasicMaterial color="#fff2d1" />
      </mesh>
    </group>
  );
}

// 4. ARCHITECTURAL TREES WITH REALISTIC CANOPIES
function ArchitecturalTree({
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
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.3, 0.2, 12]} />
        <meshStandardMaterial color="#9ea1a8" roughness={0.6} />
      </mesh>
      {/* Mulch Soil */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 12]} />
        <meshStandardMaterial color="#2d2218" roughness={0.9} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 2.8, 6]} />
        <meshStandardMaterial color="#3d2f22" roughness={0.85} />
      </mesh>

      {/* Foliage Variations */}
      {type === 'cypress' && (
        <group position={[0, 2.4, 0]}>
          <mesh castShadow position={[0, 1.0, 0]}>
            <coneGeometry args={[1.3, 2.6, 8]} />
            <meshStandardMaterial color="#243d2b" roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, 2.2, 0]}>
            <coneGeometry args={[1.0, 2.2, 8]} />
            <meshStandardMaterial color="#2c4a35" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 3.2, 0]}>
            <coneGeometry args={[0.65, 1.8, 7]} />
            <meshStandardMaterial color="#385a42" roughness={0.65} />
          </mesh>
        </group>
      )}

      {type === 'pine' && (
        <group position={[0, 2.8, 0]}>
          <mesh castShadow position={[0.3, 0, 0.1]}>
            <cylinderGeometry args={[1.4, 1.6, 0.5, 8]} />
            <meshStandardMaterial color="#2d4934" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[-0.2, 0.9, -0.1]}>
            <cylinderGeometry args={[1.1, 1.3, 0.45, 8]} />
            <meshStandardMaterial color="#35573d" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0.1, 1.7, 0]}>
            <cylinderGeometry args={[0.8, 1.0, 0.4, 8]} />
            <meshStandardMaterial color="#3d6347" roughness={0.65} />
          </mesh>
        </group>
      )}

      {type === 'canopy' && (
        <mesh castShadow position={[0, 3.4, 0]}>
          <dodecahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial color="#2b4731" roughness={0.75} />
        </mesh>
      )}
    </group>
  );
}

// 5. LOW-RISE CONTEMPORARY SITE BUILDINGS (No Black Blocks)
function SiteContextBuilding({
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
  const floorCount = Math.floor(args[1] / 3.4);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Limestone Masonry Volume */}
      <mesh castShadow receiveShadow position={[0, args[1] / 2, 0]}>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.limestone.color}
          roughness={ARCH_MATERIALS.limestone.roughness}
        />
      </mesh>

      {/* Roof Parapet with Bronze Trim */}
      <mesh position={[0, args[1] + 0.12, 0]}>
        <boxGeometry args={[args[0] + 0.2, 0.24, args[2] + 0.2]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.champagneBronze.color}
          roughness={0.35}
          metalness={0.75}
        />
      </mesh>

      {/* Rhythmic Floor-to-Ceiling Windows with Graphite Mullions */}
      {Array.from({ length: floorCount }).map((_, fIdx) => (
        <group key={`win-floor-${fIdx}`} position={[0, 1.8 + fIdx * 3.4, args[2] / 2 + 0.05]}>
          {/* Glass Pane */}
          <mesh>
            <planeGeometry args={[args[0] * 0.82, 1.8]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.curtainGlass.color}
              emissive="#ffdca3"
              emissiveIntensity={0.22 * windowIntensity}
              roughness={0.12}
              metalness={0.8}
            />
          </mesh>
          {/* Thin Sills */}
          <mesh position={[0, -0.92, 0.02]}>
            <boxGeometry args={[args[0] * 0.84, 0.08, 0.1]} />
            <meshStandardMaterial color={ARCH_MATERIALS.graphiteFrame.color} />
          </mesh>
        </group>
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
      { pos: [6, 0, 14], type: 'cypress', s: 0.95 },
      { pos: [12, 0, 6], type: 'pine', s: 1.15 },
      { pos: [14, 0, 18], type: 'canopy', s: 1.0 },
      { pos: [26, 0, -4], type: 'cypress', s: 1.2 },
      { pos: [18, 0, -8], type: 'pine', s: 1.05 },
      { pos: [-6, 0, -14], type: 'cypress', s: 1.1 },
      { pos: [-18, 0, -22], type: 'pine', s: 1.25 },
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
      {/* 1. MASTER GROUND SITE WITH GRANITE PAVING & EARTH */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[145, 0.4, 145]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.granitePaving.color}
          roughness={ARCH_MATERIALS.granitePaving.roughness}
        />
      </mesh>

      {/* 2. DYNAMIC OCEAN WATER */}
      <DynamicWater timeOfDay={timeOfDay} />

      {/* 3. MARINA WATERFRONT PROMENADE & YACHTS */}
      <group position={[-46, 0, 0]}>
        {/* Light Grey Granite Seawall */}
        <mesh receiveShadow position={[17.5, 0.25, 0]}>
          <boxGeometry args={[3.2, 0.6, 138]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.graniteCurb.color}
            roughness={0.65}
          />
        </mesh>
        {/* Teak Boardwalk Promenade */}
        <mesh receiveShadow position={[15.6, 0.35, 0]}>
          <boxGeometry args={[1.4, 0.15, 138]} />
          <meshStandardMaterial color="#543c27" roughness={0.7} />
        </mesh>
        {/* Bronze Safety Handrail */}
        <mesh position={[14.8, 0.75, 0]}>
          <boxGeometry args={[0.06, 0.65, 138]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={0.3}
            metalness={0.8}
          />
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
              <meshStandardMaterial color="#3b2b1e" roughness={0.75} />
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

      {/* 4. CENTRAL PODIUM PARK, WATER MIRROR & SUNKEN LAWN */}
      {/* Landscaped Turf Pod */}
      <mesh receiveShadow position={[2, 0.02, 2]}>
        <cylinderGeometry args={[23, 24, 0.16, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.lawnGrass.color}
          roughness={ARCH_MATERIALS.lawnGrass.roughness}
        />
      </mesh>

      {/* Travertine Retaining Curb Border around Lawn */}
      <mesh position={[2, 0.12, 2]}>
        <torusGeometry args={[23.2, 0.28, 8, 36]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.plazaTravertine.color}
          roughness={0.65}
        />
      </mesh>

      {/* Central Water Mirror Pool */}
      <mesh receiveShadow position={[2, 0.14, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 0.16, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.waterPool.color}
          roughness={ARCH_MATERIALS.waterPool.roughness}
          metalness={ARCH_MATERIALS.waterPool.metalness}
        />
      </mesh>
      {/* Limestone Pool Coping Rim */}
      <mesh position={[2, 0.24, 0]}>
        <torusGeometry args={[8.5, 0.35, 8, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.limestone.color}
          roughness={ARCH_MATERIALS.limestone.roughness}
        />
      </mesh>

      {/* 5. WELLNESS CLUBHOUSE PAVILION (Contemporary Glass & Bronze Architecture) */}
      <group position={[18, 0, -2]}>
        {/* Limestone Solid Wing */}
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <boxGeometry args={[13, 3.2, 8.5]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
          />
        </mesh>
        {/* Floor-to-Ceiling Glass Facade */}
        <mesh position={[0, 1.6, 4.3]}>
          <planeGeometry args={[12, 2.8]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.curtainGlass.color}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Cantilevered Overhanging Bronze Roof */}
        <mesh position={[0, 3.3, 0]}>
          <boxGeometry args={[14.6, 0.28, 10.2]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        {/* Outdoor Lap Pool with Turquoise Glow */}
        <mesh position={[0, 0.3, 7.5]}>
          <boxGeometry args={[9.8, 0.1, 3.2]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#0096c7"
            emissiveIntensity={0.85}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 6. ROADWAYS, LIGHT GREY GRANITE CURBS & CROSSWALKS */}
      {/* Asphalt Driveway */}
      <mesh receiveShadow position={[0, 0.02, 34]}>
        <boxGeometry args={[95, 0.08, 7.0]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.asphaltRoad.color}
          roughness={ARCH_MATERIALS.asphaltRoad.roughness}
        />
      </mesh>
      {/* Light Grey Granite Road Curbs on North & South edges of road */}
      <mesh receiveShadow position={[0, 0.08, 30.4]}>
        <boxGeometry args={[95, 0.14, 0.25]} />
        <meshStandardMaterial color={ARCH_MATERIALS.graniteCurb.color} roughness={0.65} />
      </mesh>
      <mesh receiveShadow position={[0, 0.08, 37.6]}>
        <boxGeometry args={[95, 0.14, 0.25]} />
        <meshStandardMaterial color={ARCH_MATERIALS.graniteCurb.color} roughness={0.65} />
      </mesh>

      {/* Dashed Center Road Markings */}
      {[-30, -15, 0, 15, 30].map((rx, idx) => (
        <mesh key={idx} position={[rx, 0.07, 34]}>
          <planeGeometry args={[4.0, 0.28]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.roadMarking.color}
            roughness={ARCH_MATERIALS.roadMarking.roughness}
          />
        </mesh>
      ))}

      {/* Pedestrian Crosswalks */}
      {[-2, -1, 0, 1, 2].map((zi, idx) => (
        <mesh key={idx} position={[-16, 0.07, 32.2 + zi * 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 2.6]} />
          <meshStandardMaterial color={ARCH_MATERIALS.roadMarking.color} roughness={0.6} />
        </mesh>
      ))}

      {/* 7. ARCHITECTURAL STREETLAMPS */}
      {streetlamps.map((pos, idx) => (
        <ArchitecturalStreetlamp
          key={idx}
          position={pos}
          intensity={atmosphere.streetLightIntensity}
        />
      ))}

      {/* 8. ARCHITECTURAL TREES */}
      {trees.map((t, idx) => (
        <ArchitecturalTree key={idx} position={t.pos} type={t.type} scale={t.s} />
      ))}

      {/* 9. CONTEMPORARY SITE CONTEXT BUILDINGS (Limestone, not black blocks) */}
      <SiteContextBuilding
        position={[-22, 0, 50]}
        args={[24, 16, 14]}
        rotationY={0.05}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <SiteContextBuilding
        position={[14, 0, 52]}
        args={[28, 20, 16]}
        rotationY={-0.1}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <SiteContextBuilding
        position={[46, 0, 38]}
        args={[20, 14, 20]}
        rotationY={0.2}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <SiteContextBuilding
        position={[50, 0, -18]}
        args={[24, 24, 18]}
        rotationY={-0.15}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <SiteContextBuilding
        position={[38, 0, -44]}
        args={[30, 18, 16]}
        rotationY={0.1}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <SiteContextBuilding
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
