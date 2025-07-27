import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_API_URL;
if (!BACKEND_URL) {
  console.error('BACKEND_API_URL is required in usePlacesStore.js');
}

export const usePlacesStore = create((set, get) => ({
  searchResults: [],
  searchLoading: false,
  searchError: null,

  searchPlaces: async (query) => {
    set({ searchLoading: true, searchError: null, searchResults: [] });
    try {
      const response = await fetch(`${BACKEND_URL}/search_places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      set({ searchResults: data.places, searchLoading: false });
      return data.places;
    } catch (error) {
      console.error("Error searching places:", error);
      set({ searchError: error.message, searchLoading: false });
      throw error;
    }
  },

  clearSearchResults: () => set({ searchResults: [], searchError: null }),
}));
