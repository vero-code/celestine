import * as THREE from 'three';

// Note: Positions and radii are not to scale, but are chosen for good visualization.
export const planetData = [
  {
    name: 'Sun',
    position: new THREE.Vector3(0, 0, 0),
    radius: 2,
    color: '#FFDAB9',
    emissive: true,
    info: 'The center of the Solar System. A star of hot plasma.',
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
    info: 'Venus has a thick, toxic atmosphere and is incredibly hot.',
  },
  {
    name: 'Earth',
    position: new THREE.Vector3(15, 0, 0),
    radius: 1,
    color: 'deepskyblue',
    info: 'Our home planet with life and oceans.',
  },
  {
    name: 'Moon',
    position: new THREE.Vector3(15 + 1.5, 0, 0),
    radius: 0.27,
    color: 'lightgray',
    info: "Earth's only natural satellite."
  },
  {
    name: 'Mars',
    position: new THREE.Vector3(20, 0, 0),
    radius: 0.7,
    color: 'orangered',
    info: 'The Red Planet, a prime target for future exploration.',
  },
  {
    name: 'Jupiter',
    position: new THREE.Vector3(30, 0, 0),
    radius: 1.8,
    color: '#D2B48C',
    info: 'The largest planet in our Solar System, a gas giant.',
  },
  {
    name: 'Saturn',
    position: new THREE.Vector3(40, 0, 0),
    radius: 1.6,
    color: '#F0E68C',
    info: 'Known for its stunning system of icy rings.',
  },
  {
    name: 'Uranus',
    position: new THREE.Vector3(50, 0, 0),
    radius: 1.2,
    color: '#ADD8E6',
    info: 'An ice giant that rotates on its side.',
  },
  {
    name: 'Neptune',
    position: new THREE.Vector3(60, 0, 0),
    radius: 1.1,
    color: 'blue',
    info: 'The most distant planet from the Sun, a dark and cold world.',
  },
];