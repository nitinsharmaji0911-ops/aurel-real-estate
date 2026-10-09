import * as THREE from 'three';

let cachedWaterTexture: THREE.CanvasTexture | null = null;

export function getProceduralWaterNormalTexture(): THREE.CanvasTexture | null {
  if (cachedWaterTexture) return cachedWaterTexture;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Wave function parameters
  const scale1 = (Math.PI * 2) / 64;
  const scale2 = (Math.PI * 2) / 32;
  const scale3 = (Math.PI * 2) / 16;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        Math.cos(x * scale1) * Math.sin(y * scale1) * 0.4 +
        Math.cos(x * scale2 + y * scale2 * 0.5) * 0.35 +
        Math.cos((x - y) * scale3) * 0.25;

      const dy =
        Math.sin(x * scale1) * Math.cos(y * scale1) * 0.4 +
        Math.sin(x * scale2 * 0.5 + y * scale2) * 0.35 -
        Math.sin((x - y) * scale3) * 0.25;

      const nx = -dx * 1.8;
      const ny = -dy * 1.8;
      const nz = 1.0;

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const r = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
      const g = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
      const b = Math.floor(((nz / len) * 0.5 + 0.5) * 255);

      const idx = (y * size + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 18);
  cachedWaterTexture = texture;
  return texture;
}
