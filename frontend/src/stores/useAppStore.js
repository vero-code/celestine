// useAppStore.js
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_API_URL;
if (!BACKEND_URL) {
  console.error('BACKEND_API_URL is required');
}

export const useAppStore = create((set, get) => ({
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

  messages: [],
  placeResults: [],

  sendMessageToChat: async (message) => {
    set((state) => ({
      messages: [...state.messages, { sender: 'user', text: message }]
    }));
    await get()._sendToBackendAndAddResponse(message);
  },

  sendPoiPromptToChat: async (prompt) => {
    set((state) => ({
      messages: [...state.messages, { sender: 'user', text: prompt }]
    }));
    await get()._sendToBackendAndAddResponse(prompt);
  },

  _sendToBackendAndAddResponse: async (messageToSend) => {
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: messageToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const agentReply = data.response;

      try {
        const structuredResponse = JSON.parse(agentReply);
        if (structuredResponse.summary && structuredResponse.places) {
          set((state) => ({
            messages: [...state.messages, { sender: 'agent', text: structuredResponse.summary }]
          }));

          set({ placeResults: structuredResponse.places });

          if (structuredResponse.places.length > 0) {
            get().setCurrentMap('earth2d');
          }
        } else {
          throw new Error("Invalid JSON structure from agent");
        }
      } catch (e) {
        set((state) => ({
          messages: [...state.messages, { sender: 'agent', text: agentReply }]
        }));
        set({ placeResults: [] });
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
      set((state) => ({
        messages: [...state.messages, { sender: 'agent', text: `Error: Failed to get response from AI. ${error.message}` }]
      }));
    }
  },

  addAgentMessage: (message) => set((state) => ({
    messages: [...state.messages, { sender: 'agent', text: message }]
  })),
}));