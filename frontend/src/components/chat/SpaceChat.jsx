import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SpaceChat = () => {
  const messages = useAppStore((state) => state.messages);
  const addAgentMessage = useAppStore((state) => state.addAgentMessage);
  const sendMessageToChat = useAppStore((state) => state.sendMessageToChat);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const hasInitializedChat = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!hasInitializedChat.current && messages.length === 0) {
      addAgentMessage('Hello! Where would you like to go today?');
      hasInitializedChat.current = true;
    }
  }, [messages.length, addAgentMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      await sendMessageToChat(userMessage);
    } catch (error) {
      console.error('[SpaceChat] Error during message sending process:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-placeholder">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} style={{ backgroundColor: msg.sender === 'agent' ? '#3b3b55' : '#555577', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
            <strong>{msg.sender === 'agent' ? 'Agent' : 'You'}:</strong>
            {msg.sender === 'agent' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
