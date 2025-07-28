// components/GalacticNavigator.jsx
import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import './css/GalacticNavigator.css';

const planets = ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

const GalacticNavigator = () => {
  const setTarget = useAppStore((state) => state.setTarget);
  const currentTarget = useAppStore((state) => state.target);

  return (
    <div className="planet-sidebar">
      <h3>📡 Navigate to:</h3>
      <ul>
        {planets.map((planet) => (
          <li
            key={planet}
            className={currentTarget === planet ? 'active' : ''}
            onClick={() => setTarget(planet)}
          >
            {planet}
          </li>
        ))}
        <li className="free-roam" onClick={() => setTarget(null)}>
          🛰 Free Roam
        </li>
      </ul>
    </div>
  );
};

export default GalacticNavigator;
