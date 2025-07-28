// useAppStore.js
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_API_URL;
if (!BACKEND_URL) {
  console.error('BACKEND_API_URL is required');
}

const playAudioFromStream = async (text) => {
  const { isSpeechEnabled } = useAppStore.getState();
  if (!isSpeechEnabled) return;

  const textToSpeak = text.replace(/\*/g, '');
  try {
    const response = await fetch(`${BACKEND_URL}/synthesize-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToSpeak }),
    });

    if (!response.ok) {
      throw new Error(`Speech synthesis failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  } catch (error) {
    console.error("Could not play audio:", error);
  }
};

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
  isAgentThinking: false,

  isSpeechEnabled: true,
  toggleSpeech: () => set((state) => ({ isSpeechEnabled: !state.isSpeechEnabled })),

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
    set({ isAgentThinking: true });
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
        const jsonMatch = agentReply.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON object found in the agent's response.");
        }

        const jsonString = jsonMatch[0];
        const structuredResponse = JSON.parse(jsonString);

        if (structuredResponse.summary && structuredResponse.places) {
          const summaryText = structuredResponse.summary;
          set((state) => ({
            messages: [...state.messages, { sender: 'agent', text: summaryText }]
          }));

          set({ placeResults: structuredResponse.places });

          playAudioFromStream(summaryText);

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
        playAudioFromStream(agentReply);
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
      set((state) => ({
        messages: [...state.messages, { sender: 'agent', text: `Error: Failed to get response from AI. ${error.message}` }]
      }));
    } finally {
      set({ isAgentThinking: false });
    }
  },

  addAgentMessage: (message) => set((state) => ({
    messages: [...state.messages, { sender: 'agent', text: message }]
  })),
}));