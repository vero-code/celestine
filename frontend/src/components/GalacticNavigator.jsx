import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import './GalacticNavigator.css';

const celestialBodies = [
  { name: 'Sun', position: { top: '50%', left: '50%' } },
  { name: 'Mercury', position: { top: '45%', left: '55%' } },
  { name: 'Venus', position: { top: '55%', left: '45%' } },
  { name: 'Earth', position: { top: '60%', left: '60%' } },
  { name: 'Mars', position: { top: '40%', left: '40%' } },
];

const GalacticNavigator = () => {
  const setTarget = useAppStore((state) => state.setTarget);

  return (
    <div className="navigator-container">
      {celestialBodies.map((body) => (
        <div
          key={body.name}
          className="celestial-body"
          style={{ top: body.position.top, left: body.position.left }}
          onClick={() => setTarget(body.name)}
        >
          <div className="dot"></div>
          <div className="label">{body.name}</div>
        </div>
      ))}
      {/* Drop target and free flight */}
      <button className="reset-button" onClick={() => setTarget(null)}>
        Free Roam
      </button>
    </div>
  );
};

export default GalacticNavigator;