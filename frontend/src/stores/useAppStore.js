import { create } from 'zustand';

export const useAppStore = create((set) => ({
  target: null,
  setTarget: (newTarget) => set({ target: newTarget }),

  isUserControlling: false,
  setUserControlling: (value) => set({ isUserControlling: value }),

  currentMap: 'space',
  setCurrentMap: (map) => set({ currentMap: map }),

  landOnPlanet: (planetName) => set({
    target: planetName,
    currentMap: 'planet'
  }),
}));