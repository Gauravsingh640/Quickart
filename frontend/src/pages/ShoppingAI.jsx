import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, Plus } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { askShoppingAI } from "../services/shoppingAI";

const suggestions = [
  "Show me phones under ₹30000",
  "Best gaming laptop",
  "Compare iPhone and Samsung",
  "Wireless earbuds",
];

function ShoppingAI() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Welcome to QuickArt Shopping Assistant.

I can help you discover the perfect products.

You can ask me things like:
• Show phones under ₹30000
• Best gaming laptop
• Compare iPhone and Samsung
• Recommend wireless earbuds`,
      products: [],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const data = await askShoppingAI(text);

      const aiMessage = {
        sender: "ai",
        text: data.answer,
        products: data.products || [],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong. Please try again.",
          products: [],
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setLoading(false);
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
              <h2>QuickArt Shopping Assistant</h2>
              <p>Your intelligent shopping companion</p>
            </div>
          </div>

          <button
            className="new-chat-btn"
            onClick={() =>
              setMessages([
                {
                  sender: "ai",
                  text: `👋 Welcome to QuickArt Shopping Assistant.

How can I help you today?`,
                  products: [],
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

        <div className="chat-body" ref={chatRef}>

          {messages.length === 1 && (
            <div className="welcome-screen">

              <div className="welcome-icon">
                <Sparkles size={45} />
              </div>

              <h1>QuickArt Shopping Assistant</h1>

              <p>
                Ask anything about products, compare items and get personalized
                recommendations instantly.
              </p>

              <div className="suggestion-grid">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSend(item)}
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
                    {msg.sender === "user" ? "You" : "Shopping AI"}
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

                {msg.products?.length > 0 && (
                  <div className="product-list">
                    {msg.products.map((item) => (
                      <ProductCard
                        key={item._id}
                        item={item}
                      />
                    ))}
                  </div>
                )}

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
                    Shopping AI
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

          <div ref={chatRef}></div>

        </div>

        {/* Input */}

        <div className="chat-input">

          <textarea
            placeholder="Ask anything about products..."
            value={input}
            rows={1}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={() => handleSend()}
            disabled={loading}
          >
            <Send size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}

export default ShoppingAI;