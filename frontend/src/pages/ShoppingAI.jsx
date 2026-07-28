import {
  useEffect,
  useRef,
  useState,
} from "react";

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

import ProductCard from "../components/ProductCard";
import "./ShoppingAI.css";
import {
  askShoppingAI,
  getShoppingChats,
  createShoppingChat,
  getShoppingChatHistory,
  deleteShoppingChat,
} from "../services/shoppingAI";

/* ==========================================
   SUGGESTIONS
========================================== */

const suggestions = [
  "Show me phones under ₹30000",
  "Best gaming laptop",
  "Compare iPhone and Samsung",
  "Wireless earbuds",
];

/* ==========================================
   WELCOME MESSAGE
========================================== */

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

/* ==========================================
   FORMAT MESSAGE TIME
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

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  for (const chat of chats) {
    const date = new Date(chat.updatedAt);

    const chatDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const difference =
      today.getTime() - chatDay.getTime();

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

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
   SHOPPING AI
========================================== */

function ShoppingAI() {
  /* ==========================================
     STATE
  ========================================== */

  const [messages, setMessages] = useState([
    createWelcomeMessage(),
  ]);

  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] =
    useState(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingChats, setLoadingChats] =
    useState(true);

  const [loadingHistory, setLoadingHistory] =
    useState(false);

  // Sidebar open/close
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  /* ==========================================
     REFS
  ========================================== */

  const chatBodyRef = useRef(null);

  const abortControllerRef =
    useRef(null);

  /* ==========================================
     LOAD ALL CHATS
  ========================================== */

  const loadChats = async () => {
    try {
      setLoadingChats(true);

      const data =
        await getShoppingChats();

      if (data?.success) {
        /*
         * Defensive filter.
         *
         * If old empty "New Chat" records
         * already exist, don't show them
         * in sidebar.
         *
         * Real conversations are still shown.
         */
        const validChats = (
          data.chats || []
        ).filter((chat) => {
          if (!chat) return false;

          const title =
            chat.title?.trim();

          return (
            title &&
            title !== "New Chat"
          );
        });

        setChats(validChats);
      }
    } catch (error) {
      console.error(
        "Load Chats Error:",
        error
      );
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
    if (!chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [
    messages,
    loading,
    loadingHistory,
  ]);

  /* ==========================================
     NEW CHAT
  ========================================== */

  const handleNewChat = () => {
    if (loading) {
      handleStop();
    }

    /*
     * IMPORTANT:
     *
     * DO NOT create chat in backend here.
     *
     * Chat will only be created when
     * first actual message is sent.
     *
     * This prevents:
     *
     * New Chat
     * New Chat
     * New Chat
     *
     * appearing in MongoDB/sidebar.
     */

    setActiveChatId(null);

    setMessages([
      createWelcomeMessage(),
    ]);

    setInput("");
  };

  /* ==========================================
     OPEN OLD CHAT
  ========================================== */

  const handleOpenChat = async (
    chatId
  ) => {
    if (!chatId) {
      return;
    }

    if (
      chatId === activeChatId &&
      !loadingHistory
    ) {
      return;
    }

    if (loading) {
      handleStop();
    }

    try {
      setLoadingHistory(true);

      const data =
        await getShoppingChatHistory(
          chatId
        );

      if (!data?.success) {
        console.error(
          "Failed to load chat"
        );

        return;
      }

      setActiveChatId(chatId);

      const history =
        data.history || [];

      const formattedMessages =
        history.map((item) => ({
          sender:
            item.role === "assistant"
              ? "ai"
              : "user",

          text:
            item.message || "",

          products:
            item.products || [],

          time:
            formatMessageTime(
              item.createdAt
            ),
        }));

      if (
        formattedMessages.length === 0
      ) {
        setMessages([
          createWelcomeMessage(),
        ]);
      } else {
        setMessages(
          formattedMessages
        );
      }

      /*
       * Mobile:
       * after selecting chat close sidebar.
       */
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error(
        "Open Chat Error:",
        error
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  /* ==========================================
     SEND MESSAGE
  ========================================== */

  const handleSend = async (
    text = input
  ) => {
    const cleanText =
      text?.trim();

    if (
      !cleanText ||
      loading ||
      loadingHistory
    ) {
      return;
    }

    let chatId =
      activeChatId;

    /*
     * No active chat means user is currently
     * on a fresh local New Chat screen.
     *
     * NOW create backend chat because user
     * actually sent something.
     */

    if (!chatId) {
      try {
        const newChatData =
          await createShoppingChat();

        if (
          !newChatData?.success ||
          !newChatData?.chat?._id
        ) {
          console.error(
            "Unable to create chat"
          );

          return;
        }

        chatId =
          newChatData.chat._id;

        setActiveChatId(chatId);

        /*
         * Do NOT immediately add "New Chat"
         * to sidebar.
         *
         * Backend will generate/update title
         * after first message.
         *
         * loadChats() runs after response.
         */
      } catch (error) {
        console.error(
          "Create Chat Error:",
          error
        );

        return;
      }
    }

    /* ==========================================
       ADD USER MESSAGE IMMEDIATELY
    ========================================== */

    const userMessage = {
      sender: "user",

      text: cleanText,

      products: [],

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
    };

    setMessages((prev) => {
      const onlyWelcome =
        prev.length === 1 &&
        prev[0]?.sender === "ai" &&
        prev[0]?.text?.includes(
          "Welcome to QuickArt"
        );

      if (onlyWelcome) {
        return [userMessage];
      }

      return [
        ...prev,
        userMessage,
      ];
    });

    setInput("");

    setLoading(true);

    /* ==========================================
       ABORT CONTROLLER
    ========================================== */

    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    try {
      const data =
        await askShoppingAI(
          chatId,
          cleanText,
          controller.signal
        );

      if (!data?.success) {
        throw new Error(
          data?.answer ||
            data?.message ||
            "Failed to get AI response"
        );
      }

      /*
       * Backend may return chatId.
       * Keep frontend synced.
       */
      if (data.chatId) {
        setActiveChatId(
          data.chatId
        );
      }

      const aiMessage = {
        sender: "ai",

        text:
          data.answer || "",

        products:
          data.products || [],

        time:
          new Date().toLocaleTimeString(
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

      /*
       * Refresh sidebar AFTER first message
       * has been processed.
       *
       * Now backend title should be:
       *
       * Samsung vs Sony
       * Best gaming laptop
       * Wireless earbuds
       *
       * instead of "New Chat".
       */

      await loadChats();
    } catch (error) {
      /*
       * User manually stopped generation.
       */

      if (
        error.code ===
          "ERR_CANCELED" ||
        error.name ===
          "CanceledError"
      ) {
        console.log(
          "AI generation stopped"
        );

        return;
      }

      console.error(
        "Shopping AI Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",

          text:
            "Something went wrong. Please try again.",

          products: [],

          time:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
        },
      ]);
    } finally {
      setLoading(false);

      abortControllerRef.current =
        null;
    }
  };

  /* ==========================================
     STOP GENERATION
  ========================================== */

  const handleStop = () => {
    if (
      abortControllerRef.current
    ) {
      abortControllerRef.current.abort();

      abortControllerRef.current =
        null;
    }

    setLoading(false);
  };

  /* ==========================================
     DELETE CHAT
  ========================================== */

  const handleDeleteChat = async (
    event,
    chatId
  ) => {
    event.stopPropagation();

    if (!chatId) {
      return;
    }

    try {
      const data =
        await deleteShoppingChat(
          chatId
        );

      if (!data?.success) {
        return;
      }

      setChats((prev) =>
        prev.filter(
          (chat) =>
            chat._id !== chatId
        )
      );

      /*
       * Current open chat deleted.
       */

      if (
        activeChatId === chatId
      ) {
        setActiveChatId(null);

        setMessages([
          createWelcomeMessage(),
        ]);

        setInput("");
      }
    } catch (error) {
      console.error(
        "Delete Chat Error:",
        error
      );
    }
  };

  /* ==========================================
     SIDEBAR
  ========================================== */

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const groupedChats =
    groupChats(chats);

  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="ai-page">

      <div
        className={`ai-layout ${
          sidebarOpen
            ? "sidebar-visible"
            : "sidebar-hidden"
        }`}
      >

        {/* =====================================
            SIDEBAR
        ===================================== */}

        {sidebarOpen && (
          <aside className="ai-sidebar">

            {/* SIDEBAR HEADER */}

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

            {/* CHAT HISTORY */}

            <div className="sidebar-history">

              {loadingChats ? (
                <div className="sidebar-loading">
                  Loading chats...
                </div>
              ) : chats.length === 0 ? (
                <div className="sidebar-empty">
                  No previous chats
                </div>
              ) : (
                Object.entries(
                  groupedChats
                ).map(
                  ([
                    groupName,
                    groupItems,
                  ]) => {
                    if (
                      groupItems.length ===
                      0
                    ) {
                      return null;
                    }

                    return (
                      <div
                        className="chat-group"
                        key={groupName}
                      >

                        <p className="chat-group-title">
                          {groupName}
                        </p>

                        {groupItems.map(
                          (chat) => (
                            <div
                              key={
                                chat._id
                              }
                              className={`sidebar-chat-item ${
                                activeChatId ===
                                chat._id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleOpenChat(
                                  chat._id
                                )
                              }
                            >

                              <MessageSquare
                                size={16}
                              />

                              <span className="sidebar-chat-title">
                                {chat.title}
                              </span>

                              <button
                                type="button"
                                className="sidebar-delete-chat"
                                title="Delete chat"
                                onClick={(
                                  event
                                ) =>
                                  handleDeleteChat(
                                    event,
                                    chat._id
                                  )
                                }
                              >
                                <Trash2
                                  size={15}
                                />
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    );
                  }
                )
              )}

            </div>

          </aside>
        )}

        {/* =====================================
            MAIN CHAT
        ===================================== */}

        <div className="chat-container">

          {/* ===================================
              HEADER
          =================================== */}

          <div className="chat-header">

            <div className="header-left">

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

              <div className="header-title">

                <h2>
                  QuickArt Shopping
                  Assistant
                </h2>

                <p>
                  Your intelligent shopping
                  companion
                </p>

              </div>

            </div>

          </div>

          {/* ===================================
              CHAT BODY
          =================================== */}

          <div
            className="chat-body"
            ref={chatBodyRef}
          >

            {loadingHistory ? (
              <div className="history-loading">
                Loading conversation...
              </div>
            ) : (
              <>

                {/* =============================
                    WELCOME SCREEN
                ============================= */}

                {messages.length === 1 &&
                  messages[0]?.text?.includes(
                    "Welcome to QuickArt"
                  ) && (
                    <div className="welcome-screen">

                      <div className="welcome-icon">
                        <Sparkles
                          size={45}
                        />
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
                          (
                            item,
                            index
                          ) => (
                            <button
                              type="button"
                              key={index}
                              className="suggestion-card"
                              onClick={() =>
                                handleSend(
                                  item
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              {item}
                            </button>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* =============================
                    MESSAGES
                ============================= */}

                {messages.map(
                  (msg, index) => (
                    <div
                      key={index}
                      className={`message ${
                        msg.sender ===
                        "user"
                          ? "user-message"
                          : "ai-message"
                      }`}
                    >

                      {/* MESSAGE HEADER */}

                      <div className="message-header">

                        <div className="message-avatar">

                          {msg.sender ===
                          "user" ? (
                            <User
                              size={18}
                            />
                          ) : (
                            <Bot
                              size={18}
                            />
                          )}

                        </div>

                        <div className="message-info">

                          <span className="message-name">

                            {msg.sender ===
                            "user"
                              ? "You"
                              : "Shopping AI"}

                          </span>

                          {msg.time && (
                            <span className="message-time">
                              {msg.time}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* MESSAGE CONTENT */}

                      <div className="message-content">

                        {msg.text
                          ?.split("\n")
                          .map(
                            (
                              line,
                              lineIndex
                            ) => (
                              <p
                                key={
                                  lineIndex
                                }
                              >
                                {line ||
                                  "\u00A0"}
                              </p>
                            )
                          )}

                        {/* =====================
                            PRODUCT CARDS
                        ===================== */}

                        {msg.products
                          ?.length >
                          0 && (
                          <div className="ai-products">

                            {msg.products.map(
                              (
                                item,
                                productIndex
                              ) => (
                                <ProductCard
                                  key={
                                    item._id ||
                                    productIndex
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

                {/* =============================
                    TYPING
                ============================= */}

                {loading && (
                  <div className="message ai-message">

                    <div className="message-header">

                      <div className="message-avatar">
                        <Bot
                          size={18}
                        />
                      </div>

                      <div className="message-info">
                        <span className="message-name">
                          Shopping AI
                        </span>
                      </div>

                    </div>

                    <div className="typing">
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>
                )}

              </>
            )}

          </div>

          {/* ===================================
              INPUT
          =================================== */}

          <div className="chat-input">

            <textarea
              placeholder="Ask anything about products..."
              value={input}
              rows={1}
              disabled={
                loadingHistory
              }
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (!loading) {
                    handleSend();
                  }
                }
              }}
            />

            {/* SEND / STOP */}

            {loading ? (
              <button
                type="button"
                className="stop-generation-btn"
                onClick={
                  handleStop
                }
                title="Stop generating"
              >
                <Square
                  size={19}
                  fill="currentColor"
                />
              </button>
            ) : (
              <button
                type="button"
                className="send-message-btn"
                onClick={() =>
                  handleSend()
                }
                disabled={
                  !input.trim() ||
                  loadingHistory
                }
                title="Send"
              >
                <Send size={20} />
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ShoppingAI;