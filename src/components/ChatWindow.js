import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div key={index} className={message.role === 'user' ? 'message user' : 'message ai'}>
          <ReactMarkdown
            children={message.content}
            components={{
              a: ({ node, ...props }) => {
                if (!props.href.startsWith("internal:")) {
                  return (
                    <a href={props.href} target="_blank" rel="noopener noreferrer">
                      {props.children}
                    </a>
                  );
                }
              },
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
