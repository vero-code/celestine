import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { planetData } from '../data/planetData';
import './css/GalacticNavigator.css';

const GalacticNavigator = () => {
  const setTarget = useAppStore((state) => state.setTarget);
  const currentTarget = useAppStore((state) => state.target);

  return (
    <div className="galactic-navigator">
      <h3>📡 Navigate to:</h3>
      <ul>
        {planetData.map((planet) => (
          <li
            key={planet.name}
            className={currentTarget === planet.name ? 'active' : ''}
            onClick={() => setTarget(planet.name)}
          >
            {planet.name}
          </li>
        ))}
        <li
          className={`free-roam ${!currentTarget ? 'active' : ''}`}
          onClick={() => setTarget(null)}
        >
          🛰️ Free Roam
        </li>
      </ul>
    </div>
  );
};

export default GalacticNavigator;
