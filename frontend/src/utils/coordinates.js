import * as THREE from 'three';

export function latLonToXY(lat, lon, w, h) {
  const x = THREE.MathUtils.lerp(-w / 2, w / 2, (lon + 180) / 360);
  const y = THREE.MathUtils.lerp(h / 2, -h / 2, (lat + 90) / 180);
  return [x, y];
}
