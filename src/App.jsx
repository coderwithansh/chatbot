import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './Components/ChatbotIcon';
import ChatForm from './Components/ChatForm';
import ChatMessage from './Components/ChatMessage';
import { companyInfo } from './companyInfo';

const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: 'model', text: companyInfo },
  ]);

  // ✅ Bot Response Generator
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== 'Thinking...'),
        { role: 'model', text, isError },
      ]);
    };

    // ✅ Prepare message format for backend
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      console.log('API URL:', import.meta.env.VITE_API_URL); // Debug

      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: formattedHistory }),
      });

      console.log('Response Status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // ✅ direct json parse
      console.log('API Data:', data);

      const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!apiResponseText) {
        throw new Error('Invalid API response structure.');
      }

      const cleanedResponse = apiResponseText
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim();

      updateHistory(cleanedResponse);
    } catch (error) {
      console.error('API Error:', error);
      updateHistory(error.message || 'An unexpected error occurred.', true);
    }
  };

  // ✅ Auto-scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">
          <p className="message-text">mode</p>
          <p className="message-text">comment</p>
        </span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-outlined"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>

      <div className="name">
        <span className="material-symbols-rounded">
          <p className="message-text">
            All rights reserved © 2025 — Design by: ANSH KUMAR DEWANGAN
          </p>
        </span>
      </div>
    </div>
  );
};

export default App;
