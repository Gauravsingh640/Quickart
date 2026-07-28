// import React, { useEffect, useRef, useState } from "react";
// import { Bot, User, Send, Sparkles, Plus ,Square} from "lucide-react";
// import { toast } from "react-toastify";
// import { askAI } from "../services/ai";
// import "./AIChat.css";

// const suggestions = [
//   "Give me today's business overview",
//   "Show top selling products",
//   "Which products should I restock?",
//   "Show monthly sales report",
// ];

// const [chats, setChats] = useState([]);
// const [activeChatId, setActiveChatId] = useState(null);

// const [loadingChats, setLoadingChats] = useState(true);
// const [loadingHistory, setLoadingHistory] = useState(false);

// const [sidebarOpen, setSidebarOpen] = useState(true);

// const AIChat = () => {
//   const [messages, setMessages] = useState([
//     {
//       sender: "ai",
//       text: `👋 Welcome to AI Sales Assistant.

// I can help you analyze your business using real-time store data.

// You can ask me things like:
// • Show today's business overview
// • Which products should I restock?
// • Show top selling products
// • Give me sales insights`,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const abortControllerRef = useRef(null);
//   const chatBodyRef = useRef(null);

//   useEffect(() => {
//     chatBodyRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages, loading]);

//   const sendMessage = async (question = input) => {
//   if (!question.trim() || loading) return;

//   const controller = new AbortController();
//   abortControllerRef.current = controller;

//   // const res = await askAI(question, controller.signal);

//   const userMessage = {
//     sender: "user",
//     text: question,
//     time: new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };

//   setMessages((prev) => [...prev, userMessage]);
//   setInput("");
//   setLoading(true);

//   try {
//     const res = await askAI(question, controller.signal);

//     setMessages((prev) => [
//       ...prev,
//       {
//         sender: "ai",
//         text: res.answer,
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//     ]);
//   } catch (err) {
//   if (
//     err.name === "CanceledError" ||
//     err.code === "ERR_CANCELED"
//   ) {
//     // Stop button press hua tha
//     return;
//   }

//   toast.error("Failed to contact AI Assistant");

//   setMessages((prev) => [
//     ...prev,
//     {
//       sender: "ai",
//       text: "Something went wrong. Please try again.",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     },
//   ]);
// }finally {
//     abortControllerRef.current = null;
//     setLoading(false);
//   }
// };

//   const stopGeneration = () => {
//   abortControllerRef.current?.abort();
// };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="ai-page">
//       <div className="chat-container">

//         {/* Header */}

//         <div className="chat-header">
//           <div className="header-left">
//             <div className="ai-logo">
//               <Bot size={24} />
//             </div>

//             <div>
//               <h2>AI Sales Assistant</h2>
//               <p>Your intelligent business analyst</p>
//             </div>
//           </div>

//           <button
//             className="new-chat-btn"
//             onClick={() =>
//               setMessages([
//                 {
//                   sender: "ai",
//                   text: `👋 Welcome to AI Sales Assistant.

// How can I help you today?`,
//                   time: new Date().toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   }),
//                 },
//               ])
//             }
//           >
//             <Plus size={18} />
//             New Chat
//           </button>
//         </div>

//         {/* Chat Body */}

//         <div className="chat-body">

//           {messages.length === 1 && (
//             <div className="welcome-screen">

//               <div className="welcome-icon">
//                 <Sparkles size={45} />
//               </div>

//               <h1>AI Sales Assistant</h1>

//               <p>
//                 Ask anything about your business and I'll analyze your
//                 sales, inventory and products.
//               </p>

//               <div className="suggestion-grid">

//                 {suggestions.map((item, index) => (
//                   <button
//                     key={index}
//                     className="suggestion-card"
//                     onClick={() => sendMessage(item)}
//                   >
//                     {item}
//                   </button>
//                 ))}

//               </div>
//             </div>
//           )}
//                     {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`message ${
//                 msg.sender === "user" ? "user-message" : "ai-message"
//               }`}
//             >
//               <div className="message-header">
//                 <div className="message-avatar">
//                   {msg.sender === "user" ? (
//                     <User size={18} />
//                   ) : (
//                     <Bot size={18} />
//                   )}
//                 </div>

//                 <div className="message-info">
//                   <span className="message-name">
//                     {msg.sender === "user" ? "You" : "AI Assistant"}
//                   </span>

//                   <span className="message-time">
//                     {msg.time}
//                   </span>
//                 </div>
//               </div>

//               <div className="message-content">
//                 {msg.text.split("\n").map((line, i) => (
//                   <p key={i}>{line}</p>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="message ai-message">
//               <div className="message-header">
//                 <div className="message-avatar">
//                   <Bot size={18} />
//                 </div>

//                 <div className="message-info">
//                   <span className="message-name">
//                     AI Assistant
//                   </span>
//                 </div>
//               </div>

//               <div className="typing">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           )}

//           <div ref={chatBodyRef}></div>

//         </div>

//         {/* Input */}

//         <div className="chat-input">

//           <textarea
//             placeholder="Ask anything about your business..."
//             value={input}
//             rows={1}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />

//           {loading ? (
//               <button
//                 className="stop-btn"
//                 onClick={stopGeneration}
//               >
//                 <Square size={18} fill="currentColor" />
//               </button>
//             ) : (
//               <button onClick={() => sendMessage()}>
//                 <Send size={20} />
//               </button>
//             )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default AIChat;
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Plus,
  Square,
  Trash2,
  MessageSquare,
  PanelLeftClose,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  askAI,
  getAdminChats,
  createAdminChat,
  getAdminChatHistory,
  deleteAdminChat,
} from "../services/ai";

import LowStockCard from "../components/LowStockCard"; 

import "./AIChat.css";

/* ==========================================
   SUGGESTIONS
========================================== */

const suggestions = [
  "Give me today's business overview",
  "Show top selling products",
  "Which products should I restock?",
  "Show monthly sales report",
];

/* ==========================================
   WELCOME MESSAGE
========================================== */

const createWelcomeMessage = () => ({
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
});

/* ==========================================
   FORMAT TIME
========================================== */

const formatMessageTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ==========================================
   GROUP CHATS
========================================== */

const groupChats = (chats = []) => {
  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const chat of chats) {
    const date = new Date(chat.updatedAt);

    const chatDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const difference = today.getTime() - chatDay.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days === 0) {
      groups.Today.push(chat);
    } else if (days === 1) {
      groups.Yesterday.push(chat);
    } else if (days <= 7) {
      groups["Previous 7 Days"].push(chat);
    } else {
      groups.Older.push(chat);
    }
  }

  return groups;
};

/* ==========================================
   AI CHAT
========================================== */

const AIChat = () => {
  /* ==========================================
     STATES
  ========================================== */

  const [messages, setMessages] = useState([createWelcomeMessage()]);

  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingChats, setLoadingChats] = useState(true);

  const [loadingHistory, setLoadingHistory] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ==========================================
     REFS
  ========================================== */

  const chatBodyRef = useRef(null);

  const abortControllerRef = useRef(null);

  /* ==========================================
     LOAD ALL CHATS
  ========================================== */

  const loadChats = async () => {
    try {
      setLoadingChats(true);

      const data = await getAdminChats();

      if (data?.success) {
        const validChats = (data.chats || []).filter((chat) => {
          if (!chat) return false;

          const title = chat.title?.trim();

          return title && title !== "New Chat";
        });

        setChats(validChats);
      }
    } catch (error) {
      console.error("Load Chats Error:", error);
    } finally {
      setLoadingChats(false);
    }
  };
  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    loadChats();
  }, []);

  /* ==========================================
     AUTO SCROLL
  ========================================== */

  useEffect(() => {
    if (!chatBodyRef.current) return;

    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, loadingHistory]);

  /* ==========================================
     NEW CHAT
  ========================================== */

  const handleNewChat = () => {
    if (loading) {
      handleStop();
    }

    // Don't create backend chat here.
    // Chat will be created when user
    // sends first message.

    setActiveChatId(null);

    setMessages([createWelcomeMessage()]);

    setInput("");

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  /* ==========================================
     OPEN CHAT HISTORY
  ========================================== */

  const handleOpenChat = async (chatId) => {
    if (!chatId) return;

    if (chatId === activeChatId && !loadingHistory) {
      return;
    }

    if (loading) {
      handleStop();
    }

    try {
      setLoadingHistory(true);

      const data = await getAdminChatHistory(chatId);

      if (!data?.success) {
        toast.error("Unable to load chat");
        return;
      }

      setActiveChatId(chatId);

      const history = data.history || [];

      const formattedMessages = history.map((item) => ({
        sender: item.role === "assistant" ? "ai" : "user",

        text: item.message || "",

        time: formatMessageTime(item.createdAt),
      }));

      if (formattedMessages.length === 0) {
        setMessages([createWelcomeMessage()]);
      } else {
        setMessages(formattedMessages);
      }

      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Open Chat Error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };
  /* ==========================================
     SEND MESSAGE
  ========================================== */

  const sendMessage = async (question = input) => {
    const cleanText = question?.trim();

    if (!cleanText || loading || loadingHistory) {
      return;
    }

    let chatId = activeChatId;

    /* ==========================================
       CREATE CHAT IF NEEDED
    ========================================== */

    if (!chatId) {
      try {
        const data = await createAdminChat();

        if (!data?.success || !data?.chat?._id) {
          toast.error("Unable to create chat");
          return;
        }

        chatId = data.chat._id;

        setActiveChatId(chatId);
      } catch (error) {
        console.error("Create Chat Error:", error);

        toast.error("Unable to create chat");

        return;
      }
    }

    /* ==========================================
       ADD USER MESSAGE
    ========================================== */

    const userMessage = {
      sender: "user",

      text: cleanText,

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => {
      const onlyWelcome = prev.length === 1 && prev[0].sender === "ai";

      if (onlyWelcome) {
        return [userMessage];
      }

      return [...prev, userMessage];
    });

    setInput("");

    setLoading(true);

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      const res = await askAI(chatId, cleanText, controller.signal);
      console.log("AI Response:", res);
      if (!res?.success) {
        throw new Error(res?.answer || "Failed to get AI response");
      }

      if (res.chatId) {
        setActiveChatId(res.chatId);
      }

      const aiMessage = {
        sender: "ai",

        text: res.answer || "",
        tool: res.tool,
        data: res.data,

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      await loadChats();
    } catch (err) {
  console.error("FULL ERROR:", err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Response:", err.response.data);
  }

  toast.error(
    err.response?.data?.message || err.message || "Unknown Error"
  );

  setMessages((prev) => [
    ...prev,
    {
      sender: "ai",
      text: err.response?.data?.message || err.message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
}finally {
      abortControllerRef.current = null;

      setLoading(false);
    }
  };

  /* ==========================================
     STOP GENERATION
  ========================================== */

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();

      abortControllerRef.current = null;
    }

    setLoading(false);
  };

  /* ==========================================
     DELETE CHAT
  ========================================== */

  const handleDeleteChat = async (event, chatId) => {
    event.stopPropagation();

    if (!chatId) return;

    try {
      const data = await deleteAdminChat(chatId);

      if (!data?.success) return;

      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      if (activeChatId === chatId) {
        setActiveChatId(null);

        setMessages([createWelcomeMessage()]);

        setInput("");
      }
    } catch (error) {
      console.error("Delete Chat Error:", error);
    }
  };

  /* ==========================================
     SIDEBAR HELPERS
  ========================================== */

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const groupedChats = groupChats(chats);
  /* ==========================================
     RENDER
  ========================================== */

  return (
    <div className="ai-chat-layout">
      {/* ==========================
          SIDEBAR
      ========================== */}

      <aside className={`ai-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Sidebar Header */}

        {/* <div className="ai-sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <Bot size={28} />
            </div>

            <h2>QUICKART AI</h2>
          </div>

          <button className="sidebar-toggle" onClick={handleCloseSidebar}>
            <PanelLeftClose size={20} />
          </button>
        </div>

        <div className="sidebar-new-chat">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={22} />
            <span>New Chat</span>
          </button>
        </div> */}

        <div className="sidebar-top">

              <div
                className="sidebar-logo"
                onClick={
                  handleOpenSidebar
                }
              >

                <div className="sidebar-logo-icon">
                  <Bot size={22} />
                </div>

                <span>
                  QUICKART AI
                </span>

              </div>

              <button
                type="button"
                className="sidebar-close-btn"
                onClick={
                  handleCloseSidebar
                }
                title="Close sidebar"
              >
                <PanelLeftClose
                  size={20}
                />
              </button>

            </div>

            {/* NEW CHAT */}

            <button
              type="button"
              className="sidebar-new-chat"
              onClick={handleNewChat}
              disabled={
                loadingHistory
              }
            >
              <Plus size={18} />

              <span>
                New Chat
              </span>
            </button>

        {/* Chat History */}

        <div className="ai-sidebar-body">
          {loadingChats ? (
            <div className="sidebar-loading">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="sidebar-empty">No previous chats</div>
          ) : (
            Object.entries(groupedChats).map(([title, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={title} className="chat-group">
                  <div className="chat-group-title">{title}</div>

                  {items.map((chat) => (
                    <div
                      key={chat._id}
                      className={`chat-item ${
                        activeChatId === chat._id ? "active" : ""
                      }`}
                      onClick={() => handleOpenChat(chat._id)}
                    >
                      <div className="chat-info">
                        <MessageSquare size={16} />

                        <span>{chat.title}</span>
                      </div>

                      <button
                        className="delete-chat-btn"
                        onClick={(e) => handleDeleteChat(e, chat._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ==========================
          MAIN CHAT AREA
      ========================== */}

      <div className="ai-chat-container">
        {/* {!sidebarOpen && (
          <button className="open-sidebar-btn" onClick={handleOpenSidebar}>
            <PanelLeftClose
              size={18}
              style={{
                transform: "rotate(180deg)",
              }}
            />
          </button>
        )} */}
        {/* ==========================
            HEADER
        ========================== */}

        <div className="ai-chat-header">
          <div className="header-left">
            <div className="header-icon">
              <button
                type="button"
                className="header-ai-logo-btn"
                onClick={
                  handleOpenSidebar
                }
                title={
                  sidebarOpen
                    ? "QuickArt AI"
                    : "Open sidebar"
                }
              >
                <div className="ai-logo">
                  <Bot size={24} />
                </div>
              </button>
            </div>

            <div>
              <h2>AI Sales Assistant</h2>
              <p>Ask anything about your business</p>
            </div>
          </div>
        </div>

        {/* ==========================
            CHAT BODY
        ========================== */}

        <div className="ai-chat-body" ref={chatBodyRef}>
          {/* Welcome Suggestions */}

          {messages.length === 1 && messages[0].sender === "ai" && !loading && (
            <div className="welcome-section">
              <div className="welcome-icon">
                <Sparkles size={42} />
              </div>

              <h2>AI Sales Assistant</h2>

              <p>
                Ask questions about your products, orders, sales, revenue,
                customers and analytics.
              </p>

              <div className="suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="suggestion-btn"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ==========================
              MESSAGES
          ========================== */}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="avatar">
                {message.sender === "user" ? (
                  <User size={18} />
                ) : (
                  <Bot size={18} />
                )}
              </div>

              <div className="message-content">
                <div className="message-text">{message.text}</div>
                {message.tool === "LOW_STOCK" &&
                  message.data?.lowStockProducts?.length > 0 && (

                    <div className="low-stock-list">

                      {message.data.lowStockProducts.map((product) => (
                        <LowStockCard
                          key={product._id}
                          product={product}
                          onUpdated={(productId) => {
                          setMessages((prev) =>
                            prev.map((msg) => {
                              if (msg.tool !== "LOW_STOCK") return msg;

                              const updatedProducts =
                                msg.data.lowStockProducts.filter(
                                  (p) => p._id !== productId
                                );

                              return {
                                ...msg,
                                text:
                                  updatedProducts.length === 0
                                    ? "✅ All low stock products have been restocked."
                                    : msg.text,
                                data: {
                                  ...msg.data,
                                  lowStockProducts: updatedProducts,
                                  lowStockCount: updatedProducts.length,
                                },
                              };
                            })
                          );
                        }}
                        />
                      ))}

                    </div>
                )}

                <div className="message-time">{message.time}</div>
              </div>
            </div>
          ))}

          {/* ==========================
              AI TYPING
          ========================== */}

          {loading && (
            <div className="message ai-message">
              <div className="avatar">
                <Bot size={18} />
              </div>

              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ==========================
            INPUT AREA
        ========================== */}

        <div className="ai-chat-input">
          <textarea
            placeholder="Ask something about your business..."
            value={input}
            rows={1}
            disabled={loadingHistory}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (loading) {
                  handleStop();
                } else {
                  sendMessage();
                }
              }
            }}
          />

          {loading ? (
            <button className="stop-btn" onClick={handleStop}>
              <Square size={18} />
            </button>
          ) : (
            <button
              className="send-btn"
              disabled={!input.trim() || loadingHistory}
              onClick={() => sendMessage()}
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
