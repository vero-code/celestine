import React, { useState } from 'react';

const SpaceChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! Where would you like to go today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_API_URL = import.meta.env.VITE_API_URL;
  if (!BACKEND_API_URL) {
    console.error('BACKEND_API_URL is required');
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const url = `${BACKEND_API_URL}/chat`;
      const body = JSON.stringify({ message: input });

      console.log('[SpaceChat] Sending request to:', url);
      console.log('[SpaceChat] Request body:', body);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      console.log('[SpaceChat] Response status:', response.status);

      const data = await response.json();

      console.log('[SpaceChat] Response JSON:', data);

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'agent', text: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { sender: 'agent', text: `Gemini error: ${data.error}` }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'agent', text: 'Error from Gemini (no reply)' }]);
      }
    } catch (error) {
      console.error('[SpaceChat] Fetch error:', error);
      setMessages((prev) => [...prev, { sender: 'agent', text: 'Failed to connect to backend' }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-placeholder">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <p key={idx} style={{ backgroundColor: msg.sender === 'agent' ? '#3b3b55' : '#555577' }}>
            <strong>{msg.sender === 'agent' ? 'Agent' : 'You'}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        className="chat-input"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={loading}
      />
      <button className="chat-send-button" onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default SpaceChat;
