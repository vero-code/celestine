import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './css/SpaceChat.css';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
);

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
          <div key={idx} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'agent-row'}`}>
            <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'agent-bubble'}`}>
                <strong>{msg.sender === 'agent' ? 'Agent' : 'You'}:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isAgentThinking && (
          <div className="message-row agent-row">
            <div className="message-bubble agent-bubble">
              <strong>Agent:</strong>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
        </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
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
          {isAgentThinking ? <div className="spinner-small" /> : <SendIcon />}
        </button>
      </div>
    </div>
  );
};

export default SpaceChat;
