import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './Components/ChatbotIcon'
import ChatForm from './Components/ChatForm'
import ChatMessage from './Components/ChatMessage';
import { companyInfo } from './companyInfo';

const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([{hideInChat: true,role: "model",text: companyInfo,},]);
  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text != "Thinking..."), { role: "model", text, isError }]);
    };
    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
    try {
      console.log("API URL:", import.meta.env.VITE_API_URL); // Debug API URL
    
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      console.log("Response Status:", response.status, response.statusText); // Log status
    
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    
      // Get raw response text
      const responseText = await response.text();
      console.log("Raw API Response:", responseText); // Debug raw response
    
      let data;
      try {
        data = JSON.parse(responseText); // Convert to JSON
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        throw new Error("Invalid API response format.");
      }
    
      const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!apiResponseText) {
        throw new Error("Invalid API response structure.");
      }
    
      // Clean response & update chat history
      const cleanedResponse = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(cleanedResponse);
    
    } catch (error) {
      console.error("API Error:", error);
      updateHistory(error.message || "An unexpected error occurred.", true);
    }
    
  };
  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);
  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded"><p className='message-text'>mode</p><p className='message-text'>comment</p></span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)}  className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there👋 <br /> How can I help you today?
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
      <div className="name "> <span className="material-symbols-rounded">
            <p className='message-text'>All rights reserve Copyright &copy; 2025 &nbsp;</p>
            <p className="message-text">Design by : ANSH KUMAR DEWANGAN</p></span>
            
            
        </div>
    </div>
  );
};
export default App;
