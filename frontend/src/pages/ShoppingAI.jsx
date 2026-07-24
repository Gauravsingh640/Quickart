import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Plus,
} from "lucide-react";

import ProductCard from "../components/ProductCard";

import {
  askShoppingAI,
  getShoppingChatHistory,
  clearShoppingChat,
} from "../services/shoppingAI";

const suggestions = [
  "Show me phones under ₹30000",
  "Best gaming laptop",
  "Compare iPhone and Samsung",
  "Wireless earbuds",
];

// ==========================================
// WELCOME MESSAGE
// ==========================================

const createWelcomeMessage = () => ({
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
});

function ShoppingAI() {
  // ==========================================
  // STATE
  // ==========================================

  const [messages, setMessages] = useState([
    createWelcomeMessage(),
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const chatRef = useRef(null);

  // ==========================================
  // LOAD OLD CHAT HISTORY
  // ==========================================

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setHistoryLoading(true);

        const data =
          await getShoppingChatHistory();

        console.log(
          "Loaded Chat History:",
          data
        );

        if (
          data.success &&
          Array.isArray(data.history) &&
          data.history.length > 0
        ) {
          const formattedMessages =
            data.history.map((chat) => ({
              sender:
                chat.role === "assistant"
                  ? "ai"
                  : "user",

              text: chat.message || "",

              products:
                chat.products || [],

              time: chat.createdAt
                ? new Date(
                    chat.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            }));

          setMessages(formattedMessages);
        } else {
          setMessages([
            createWelcomeMessage(),
          ]);
        }
      } catch (error) {
        console.error(
          "Failed to load chat history:",
          error
        );

        setMessages([
          createWelcomeMessage(),
        ]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    if (!chatRef.current) {
      return;
    }

    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSend = async (
    text = input
  ) => {
    const trimmedText = text.trim();

    if (!trimmedText || loading) {
      return;
    }

    const userMessage = {
      sender: "user",

      text: trimmedText,

      products: [],

      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setLoading(true);

    try {
      const data =
        await askShoppingAI(trimmedText);

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to get AI response"
        );
      }

      const aiMessage = {
        sender: "ai",

        text:
          data.answer ||
          "I couldn't generate a response.",

        products:
          data.products || [],

        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "Shopping AI Error:",
        error
      );

      const errorMessage = {
        sender: "ai",

        text:
          "Something went wrong. Please try again.",

        products: [],

        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NEW CHAT
  // ==========================================

  const handleNewChat = async () => {
    if (loading) {
      return;
    }

    try {
      const data =
        await clearShoppingChat();

      if (!data.success) {
        console.error(
          "Failed to clear chat"
        );

        return;
      }

      // Clear frontend chat
      setMessages([
        createWelcomeMessage(),
      ]);

      setInput("");

      console.log(
        "New chat started successfully"
      );
    } catch (error) {
      console.error(
        "New Chat Error:",
        error
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="ai-page">
      <div className="chat-container">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="chat-header">
          <div className="header-left">

            <div className="ai-logo">
              <Bot size={24} />
            </div>

            <div>
              <h2>
                QuickArt Shopping Assistant
              </h2>

              <p>
                Your intelligent shopping
                companion
              </p>
            </div>

          </div>

          <button
            className="new-chat-btn"
            onClick={handleNewChat}
            disabled={
              loading || historyLoading
            }
          >
            <Plus size={18} />

            New Chat
          </button>
        </div>

        {/* ================================= */}
        {/* CHAT BODY */}
        {/* ================================= */}

        <div
          className="chat-body"
          ref={chatRef}
        >

          {/* ================================= */}
          {/* HISTORY LOADING */}
          {/* ================================= */}

          {historyLoading ? (
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
          ) : (
            <>
              {/* ============================= */}
              {/* WELCOME / SUGGESTIONS */}
              {/* ============================= */}

              {messages.length === 1 && (
                <div className="welcome-screen">

                  <div className="welcome-icon">
                    <Sparkles size={45} />
                  </div>

                  <h1>
                    QuickArt Shopping
                    Assistant
                  </h1>

                  <p>
                    Ask anything about
                    products, compare items
                    and get personalized
                    recommendations
                    instantly.
                  </p>

                  <div className="suggestion-grid">

                    {suggestions.map(
                      (item, index) => (
                        <button
                          key={index}
                          className="suggestion-card"
                          onClick={() =>
                            handleSend(item)
                          }
                          disabled={loading}
                        >
                          {item}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* ============================= */}
              {/* MESSAGES */}
              {/* ============================= */}

              {messages.map(
                (msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "user"
                        ? "user-message"
                        : "ai-message"
                    }`}
                  >

                    {/* Message Header */}

                    <div className="message-header">

                      <div className="message-avatar">

                        {msg.sender ===
                        "user" ? (
                          <User size={18} />
                        ) : (
                          <Bot size={18} />
                        )}

                      </div>

                      <div className="message-info">

                        <span className="message-name">

                          {msg.sender ===
                          "user"
                            ? "You"
                            : "Shopping AI"}

                        </span>

                        <span className="message-time">
                          {msg.time}
                        </span>

                      </div>

                    </div>

                    {/* Message Content */}

                    <div className="message-content">

                      {(msg.text || "")
                        .split("\n")
                        .map((line, i) => (
                          <p key={i}>
                            {line || "\u00A0"}
                          </p>
                        ))}

                      {/* Product Cards */}

                      {Array.isArray(
                        msg.products
                      ) &&
                        msg.products.length >
                          0 && (
                          <div className="product-list">

                            {msg.products.map(
                              (item) => (
                                <ProductCard
                                  key={
                                    item._id
                                  }
                                  item={
                                    item
                                  }
                                />
                              )
                            )}

                          </div>
                        )}

                    </div>

                  </div>
                )
              )}

              {/* ============================= */}
              {/* AI TYPING */}
              {/* ============================= */}

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
            </>
          )}

        </div>

        {/* ================================= */}
        {/* INPUT */}
        {/* ================================= */}

        <div className="chat-input">

          <textarea
            placeholder="Ask anything about products..."
            value={input}
            rows={1}
            disabled={
              loading || historyLoading
            }
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();

                handleSend();
              }
            }}
          />

          <button
            onClick={() =>
              handleSend()
            }
            disabled={
              loading ||
              historyLoading ||
              !input.trim()
            }
          >
            <Send size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}

export default ShoppingAI;