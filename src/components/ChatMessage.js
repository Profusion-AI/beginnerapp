import React from 'react';

const ChatMessage = ({ role, content }) => {
  return (
    <div className={`message ${role}`}>
      <p>{content}</p>
    </div>
  );
}

export default ChatMessage;
