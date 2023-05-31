import React, { useState,} from 'react';
import ChatWindow from './components/ChatWindow';
import './App.css';

function renderTopicBubbles({ topics, handleTopicClick }) {
  return (
    <div className="topic-bubbles">
      {topics.map((category, index) => (
        <div key={index}>
          <h3>{category.name}</h3>
          {category.topics.map((topic, index) => (
            <div
              key={index}
              className="topic-bubble"
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [interactionPhase, setInteractionPhase] = useState('initial');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I am Arial. What would you like to know more about?' },
  ]);
  const [userInput, setUserInput] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const TOPIC_CATEGORIES = [
    { name: "STEM", topics: ["Science", "Technology", "Engineering", "Math"] },
    { name: "Arts & Humanities", topics: ["Art", "History", "Literature", "Music"] },
    { name: "Social Sciences", topics: ["Geography", "Politics", "Economics", "Psychology"] },
    { name: "Languages", topics: ["English", "Spanish", "French", "Chinese"] },
  ];

  const handleSendMessage = async () => {
    // Add the user's message to the chat
    if (userInput.trim()) {
      setMessages([...messages, { role: 'user', content: userInput }]);

      if (interactionPhase === 'initial') {
        setInteractionPhase('chatbot');
      }
      
      try {
        // Send the user's message to the backend and get the response
        const aiResponse = await sendMessageToBackend(userInput);

        // Add the AI's response to the chat
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: aiResponse }]);
      } catch (error) {
        console.error('Failed to send message:', error);

        // You can also display an error message in the chat window if the request fails
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: 'Sorry, I am not currently connected to the internet. Please try again.' },
        ]);
      }
      setUserInput("");  // Reset userInput after sending
    }
};

  async function sendMessageToBackend(userInput) {
    try {
      const response = await fetch('https://sw8snt1h64.execute-api.us-east-1.amazonaws.com/beta2/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: userInput,
          previous_messages: messages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status}. Response text: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const message = data.message; // Access 'message' directly from 'data'

      return message;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleTopicClick = (topic) => {
    setUserInput(topic);  // Set userInput to the selected topic
    handleSendMessage();  // Send the message
  };
  
  const handleCustomTopicSubmit = () => {
    if (customTopic.trim()) {
      handleTopicClick(customTopic);
      setCustomTopic("");  // Reset customTopic after submitting
    }
  };

  return (
    <div className="container">
      <main>
        <ChatWindow messages={messages} />
        <div className="topics-container">
          {renderTopicBubbles({ topics: TOPIC_CATEGORIES, handleTopicClick })}
          <div className="custom-topic-input">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter a custom topic"
            />
            <button onClick={handleCustomTopicSubmit}>Submit</button>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response here"
            className={`input-field ${interactionPhase === 'chatbot' ? 'smaller' : ''}`}
          />
          <button className="send-button" onClick={handleSendMessage}>Send</button>
        </div>
      </main>
      <footer>
        <p>Powered by Arial, the AI</p>
      </footer>
    </div>
  );
}


export default App;
