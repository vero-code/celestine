import * as THREE from "three";

export const planetData = [
  {
    name: 'Sun',
    position: new THREE.Vector3(0, 0, 0),
    radius: 2,
    color: '#FFDAB9',
    emissive: true,
    info: 'The center of the Solar System. Hot stuff!',
  },
  {
    name: 'Mercury',
    position: new THREE.Vector3(5, 0, 0),
    radius: 0.5,
    color: 'gray',
    info: 'Smallest and fastest planet in the Solar System.',
  },
  {
    name: 'Venus',
    position: new THREE.Vector3(10, 0, 0),
    radius: 0.8,
    color: 'orange',
    info: 'Venus has a thick atmosphere and is very hot.',
  },
  {
    name: 'Earth',
    position: new THREE.Vector3(15, 0, 0),
    radius: 1,
    color: 'deepskyblue',
    info: 'Our home planet with life and oceans.',
  },
  {
    name: 'Mars',
    position: new THREE.Vector3(20, 0, 0),
    radius: 0.7,
    color: 'orangered',
    info: 'The Red Planet — possible future colony.',
  },
];