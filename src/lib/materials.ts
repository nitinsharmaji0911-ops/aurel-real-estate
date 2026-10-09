import * as THREE from 'three';

/**
 * AUREL Residences — Architectural PBR Material Palette
 *
 * Replaces crude black-and-gold with real luxury architectural finishes:
 * - Warm off-white French limestone / travertine
 * - Neutral blue-grey reflective curtain wall glass
 * - Refined champagne bronze metal accents
 * - Dark graphite architectural aluminum frames
 * - Clear laminated safety glass railings
 * - Refined paving and curbs
 */

export const ARCH_MATERIALS = {
  // 1. Primary Structural Cladding: Warm Off-White Limestone / Travertine
  limestone: {
    color: '#ded9ce',
    roughness: 0.65,
    metalness: 0.05,
  },
  limestoneLight: {
    color: '#e8e4dc',
    roughness: 0.6,
    metalness: 0.05,
  },
  podiumStone: {
    color: '#d4cebe',
    roughness: 0.7,
    metalness: 0.08,
  },

  // 2. Curtain Wall Glazing: Neutral Blue-Grey Specular Glass
  curtainGlass: {
    color: '#1a2836',
    roughness: 0.06,
    metalness: 0.88,
    transparent: true,
    opacity: 0.82,
  },
  curtainGlassLit: {
    color: '#2a3540',
    roughness: 0.08,
    metalness: 0.75,
    transparent: true,
    opacity: 0.88,
    emissive: '#ffd99e',
    emissiveIntensity: 0.28,
  },
  balconyGlass: {
    color: '#658ca8',
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: 0.42,
  },

  // 3. Metal Finishes
  champagneBronze: {
    color: '#9e845a',
    roughness: 0.3,
    metalness: 0.78,
  },
  champagneBronzeLight: {
    color: '#bfa77b',
    roughness: 0.28,
    metalness: 0.82,
  },
  graphiteFrame: {
    color: '#22252c',
    roughness: 0.45,
    metalness: 0.55,
  },
  darkMetal: {
    color: '#1c1e24',
    roughness: 0.5,
    metalness: 0.5,
  },

  // 4. Concrete & Slabs
  slabEdge: {
    color: '#e0dcd4',
    roughness: 0.55,
    metalness: 0.1,
  },
  slabShadowReveal: {
    color: '#2b2d35',
    roughness: 0.8,
    metalness: 0.2,
  },

  // 5. Ground, Site & Paving
  granitePaving: {
    color: '#52545d',
    roughness: 0.75,
    metalness: 0.15,
  },
  plazaTravertine: {
    color: '#beb7a5',
    roughness: 0.68,
    metalness: 0.08,
  },
  asphaltRoad: {
    color: '#202227',
    roughness: 0.85,
    metalness: 0.1,
  },
  roadMarking: {
    color: '#eae5d8',
    roughness: 0.6,
    metalness: 0.05,
  },
  graniteCurb: {
    color: '#8b8e96',
    roughness: 0.65,
    metalness: 0.2,
  },
  lawnGrass: {
    color: '#1f3323',
    roughness: 0.88,
    metalness: 0.02,
  },
  waterPool: {
    color: '#0d283c',
    roughness: 0.08,
    metalness: 0.92,
  },
};
