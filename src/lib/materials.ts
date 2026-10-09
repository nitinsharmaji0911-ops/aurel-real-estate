import * as THREE from 'three';

/**
 * AUREL Residences — Architectural PBR Material Palette
 *
 * Authentic luxury architectural finishes:
 * - Warm French limestone / travertine / honed precast concrete
 * - Neutral blue-grey reflective curtain wall glazing
 * - Satin champagne bronze metal accents
 * - Dark graphite architectural aluminum frames & mullions
 * - Laminated safety glass railings with subtle cyan/blue tone
 * - Light travertine & granite plaza pavers (no dark flat slabs)
 * - Fine-graded slate asphalt with light granite curbs
 */

export const ARCH_MATERIALS = {
  // 1. Primary Structural Cladding: Warm Off-White French Limestone & Concrete
  limestone: {
    color: '#e2ddd2',
    roughness: 0.62,
    metalness: 0.04,
  },
  limestoneLight: {
    color: '#eae6dc',
    roughness: 0.58,
    metalness: 0.04,
  },
  concretePrecast: {
    color: '#dbd6cb',
    roughness: 0.68,
    metalness: 0.05,
  },
  podiumStone: {
    color: '#ded8cc',
    roughness: 0.65,
    metalness: 0.06,
  },

  // 2. Curtain Wall Glazing: Neutral Blue-Grey Specular Glass
  curtainGlass: {
    color: '#1a2736',
    roughness: 0.08,
    metalness: 0.88,
    transparent: true,
    opacity: 0.84,
  },
  curtainGlassLit: {
    color: '#263342',
    roughness: 0.08,
    metalness: 0.75,
    transparent: true,
    opacity: 0.88,
    emissive: '#ffd99e',
    emissiveIntensity: 0.28,
  },
  balconyGlass: {
    color: '#527794',
    roughness: 0.06,
    metalness: 0.85,
    transparent: true,
    opacity: 0.45,
  },

  // 3. Architectural Metals
  champagneBronze: {
    color: '#9e845a',
    roughness: 0.32,
    metalness: 0.78,
  },
  champagneBronzeLight: {
    color: '#bda275',
    roughness: 0.28,
    metalness: 0.82,
  },
  graphiteFrame: {
    color: '#22252c',
    roughness: 0.45,
    metalness: 0.6,
  },
  darkMetal: {
    color: '#1e2026',
    roughness: 0.48,
    metalness: 0.55,
  },

  // 4. Concrete Slabs, Reveals & Soffits
  slabEdge: {
    color: '#ded9ce',
    roughness: 0.55,
    metalness: 0.08,
  },
  slabShadowReveal: {
    color: '#24262d',
    roughness: 0.8,
    metalness: 0.2,
  },
  timberSoffit: {
    color: '#5c432d',
    roughness: 0.65,
    metalness: 0.05,
  },

  // 5. Rooftops & Mechanical Penthouse Screens (Light & Articulated, No Blank Black Slabs)
  roofPaverLight: {
    color: '#cfc9bd',
    roughness: 0.75,
    metalness: 0.08,
  },
  roofGravel: {
    color: '#beb8aa',
    roughness: 0.85,
    metalness: 0.05,
  },
  greenRoof: {
    color: '#2c4530',
    roughness: 0.82,
    metalness: 0.02,
  },
  mechanicalLouver: {
    color: '#30343e',
    roughness: 0.45,
    metalness: 0.65,
  },

  // 6. Ground, Site & Paving (Warm & Inviting)
  granitePaving: {
    color: '#c2bcaf',
    roughness: 0.68,
    metalness: 0.08,
  },
  granitePavingDark: {
    color: '#767982',
    roughness: 0.7,
    metalness: 0.12,
  },
  plazaTravertine: {
    color: '#ded9ce',
    roughness: 0.62,
    metalness: 0.05,
  },
  asphaltRoad: {
    color: '#24262b',
    roughness: 0.85,
    metalness: 0.1,
  },
  roadMarking: {
    color: '#f0ece2',
    roughness: 0.6,
    metalness: 0.04,
  },
  graniteCurb: {
    color: '#9ba0a9',
    roughness: 0.65,
    metalness: 0.18,
  },
  lawnGrass: {
    color: '#223827',
    roughness: 0.88,
    metalness: 0.02,
  },
  boxwoodHedge: {
    color: '#1d3321',
    roughness: 0.78,
    metalness: 0.02,
  },
  waterPool: {
    color: '#0d283c',
    roughness: 0.08,
    metalness: 0.92,
  },
};
