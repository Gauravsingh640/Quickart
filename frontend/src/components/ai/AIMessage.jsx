import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";

const AIMessage = ({
  message,
  copied,
  onCopy,
}) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`ai-message ${
        isUser
          ? "ai-user-message"
          : "ai-bot-message"
      }`}
    >
      <div className="ai-message-header">
        <div className="ai-message-avatar">
          {isUser ? (
            <User size={17} />
          ) : (
            <Bot size={17} />
          )}
        </div>

        <div className="ai-message-info">
          <span className="ai-message-name">
            {isUser ? "You" : "AI Assistant"}
          </span>

          <span className="ai-message-time">
            {message.time}
          </span>
        </div>
      </div>

      <div className="ai-message-content">
        <ReactMarkdown>
          {message.text}
        </ReactMarkdown>
      </div>

      {!isUser && (
        <div className="ai-message-actions">
          <button
            className="copy-message-btn"
            onClick={() =>
              onCopy(message.text)
            }
          >
            {copied ? (
              <>
                <Check size={15} />
                Copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIMessage;