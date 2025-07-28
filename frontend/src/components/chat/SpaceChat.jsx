import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../css/SpaceChat.css';

const SpaceChat = () => {
  const messages = useAppStore((state) => state.messages);
  const addAgentMessage = useAppStore((state) => state.addAgentMessage);
  const sendMessageToChat = useAppStore((state) => state.sendMessageToChat);
  const isAgentThinking = useAppStore((state) => state.isAgentThinking);

  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);
  const hasInitializedChat = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentThinking]);

  useEffect(() => {
    if (!hasInitializedChat.current && messages.length === 0) {
      addAgentMessage('Greetings, Explorer! Which world shall we chart today?');
      hasInitializedChat.current = true;
    }
  }, [messages.length, addAgentMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    try {
      await sendMessageToChat(userMessage);
    } catch (error) {
      console.error('[SpaceChat] Error during message sending process:', error);
    }
  };

  return (
    <div className="chat-placeholder">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender === 'agent' ? 'Agent' : 'You'}:</strong>
            {msg.sender === 'agent' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}

        {isAgentThinking && (
          <div>
            <strong>Agent:</strong>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        className="chat-input"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={isAgentThinking}
      />
      <button className="chat-send-button" onClick={handleSend} disabled={isAgentThinking}>
        {isAgentThinking ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
};

export default SpaceChat;
