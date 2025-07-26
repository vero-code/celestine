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

  // Function for sending messages from USER (from input field)
  sendMessageToChat: async (message) => {
    // User message to the local state
    set((state) => ({
      messages: [...state.messages, { sender: 'user', text: message }]
    }));

    // Send a message to the FastAPI backend and process the response
    await get()._sendToBackendAndAddResponse(message);
  },

  // New feature for sending prompts from POI
  sendPoiPromptToChat: async (prompt) => {
    // 1. Add prompt as a user message to chat
    set((state) => ({
      messages: [...state.messages, { sender: 'user', text: prompt }]
    }));

    // 2. Send a prompt to the FastAPI backend and wait for the AI's response
    await get()._sendToBackendAndAddResponse(prompt);
  },

  // Send to backend and add response
  _sendToBackendAndAddResponse: async (messageToSend) => {
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const agentReply = data.reply;

      // AI agent response to the local state
      set((state) => ({
        messages: [...state.messages, { sender: 'agent', text: agentReply }]
      }));

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