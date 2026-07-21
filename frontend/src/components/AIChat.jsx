import React, { useEffect, useRef, useState } from "react";
import { Bot, User, Send, Sparkles, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { askAI } from "../services/ai";
// import "./AIChat.css";

const suggestions = [
  "Give me today's business overview",
  "Show top selling products",
  "Which products should I restock?",
  "Show monthly sales report",
];

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Welcome to AI Sales Assistant.

I can help you analyze your business using real-time store data.

You can ask me things like:
• Show today's business overview
• Which products should I restock?
• Show top selling products
• Give me sales insights`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await askAI(question);

      const aiMessage = {
        sender: "ai",
        text: res.answer,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast.error("Failed to contact AI Assistant");

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong. Please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-page">
      <div className="chat-container">

        {/* Header */}

        <div className="chat-header">
          <div className="header-left">
            <div className="ai-logo">
              <Bot size={24} />
            </div>

            <div>
              <h2>AI Sales Assistant</h2>
              <p>Your intelligent business analyst</p>
            </div>
          </div>

          <button
            className="new-chat-btn"
            onClick={() =>
              setMessages([
                {
                  sender: "ai",
                  text: `👋 Welcome to AI Sales Assistant.

How can I help you today?`,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ])
            }
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat Body */}

        <div className="chat-body">

          {messages.length === 1 && (
            <div className="welcome-screen">

              <div className="welcome-icon">
                <Sparkles size={45} />
              </div>

              <h1>AI Sales Assistant</h1>

              <p>
                Ask anything about your business and I'll analyze your
                sales, inventory and products.
              </p>

              <div className="suggestion-grid">

                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => sendMessage(item)}
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>
          )}
                    {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="message-header">
                <div className="message-avatar">
                  {msg.sender === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div className="message-info">
                  <span className="message-name">
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </span>

                  <span className="message-time">
                    {msg.time}
                  </span>
                </div>
              </div>

              <div className="message-content">
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai-message">
              <div className="message-header">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>

                <div className="message-info">
                  <span className="message-name">
                    AI Assistant
                  </span>
                </div>
              </div>

              <div className="typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* Input */}

        <div className="chat-input">

          <textarea
            placeholder="Ask anything about your business..."
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
          >
            <Send size={20} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default AIChat;