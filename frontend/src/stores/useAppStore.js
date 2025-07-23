import { create } from 'zustand';

// target - name of the planet to fly to; null - free flight.
// setTarget - function to change the target.
export const useAppStore = create((set) => ({
  target: null,
  setTarget: (newTarget) => set({ target: newTarget }),

  isUserControlling: false,
  setUserControlling: (value) => set({ isUserControlling: value }),
}));