import React from "react";
import {
  Bot,
  PanelLeft,
  Trash2,
} from "lucide-react";

const AIHeader = ({
  sidebarOpen,
  toggleSidebar,
  currentChat,
  onClearChat,
}) => {
  return (
    <header className="ai-chat-header">
      <div className="ai-header-left">
        {!sidebarOpen && (
          <button
            className="sidebar-open-btn"
            onClick={toggleSidebar}
          >
            <PanelLeft size={20} />
          </button>
        )}

        <div className="ai-header-logo">
          <Bot size={20} />
        </div>

        <div className="ai-header-title">
          <h2>
            {currentChat?.title || "New Chat"}
          </h2>

          <p>
            AI Sales Assistant • Intelligent Business Analytics
          </p>
        </div>
      </div>

      <div className="ai-header-right">
        {currentChat &&
          currentChat.messages.length > 1 && (
            <button
              className="clear-chat-btn"
              onClick={onClearChat}
            >
              <Trash2 size={17} />
              Clear Chat
            </button>
          )}
      </div>
    </header>
  );
};

export default AIHeader;