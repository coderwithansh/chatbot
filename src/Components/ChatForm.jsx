import { useRef } from 'react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const hendelFormSubmit =(e) => {
        e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage) return;

    inputRef.current.value = "";

    //update chat history for the user message
    setChatHistory((history) => [...history,{role : "user", text : userMessage}]);
    
    // Delay 600ms before showing "thinking..." or generate response
    setTimeout(() => {
      //add "thinking " for the bot response
      setChatHistory ((history) => [...history, {role : "model", text : "Thinking..."}]);

      //call the function to generate the bot response
      generateBotResponse([...chatHistory, { role : "user", text : userMessage }]);
      },600);
  };        
    

  return (
    <div>
       <form className="chat-form" onSubmit={hendelFormSubmit}>
          <input ref={inputRef} type="text"
           placeholder='Message...' 
           className="message-input"  
           required/>
         <button type="submit" id="send-message" className="material-symbols-outlined">arrow_upward</button>
        </form>
    </div>
  )

}
export default ChatForm;
