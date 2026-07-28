import React, { useMemo } from "react";
import {
  PanelLeft,
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  Bot,
} from "lucide-react";

const AIChatSidebar = ({
  sidebarOpen,
  toggleSidebar,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}) => {
  const groupedChats = useMemo(() => {
    const today = [];
    const yesterday = [];
    const lastWeek = [];
    const older = [];

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    chats.forEach((chat) => {
      const updatedDate = new Date(chat.updatedAt);
      updatedDate.setHours(0, 0, 0, 0);

      const diff =
        (todayDate.getTime() - updatedDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 0) {
        today.push(chat);
      } else if (diff === 1) {
        yesterday.push(chat);
      } else if (diff <= 7) {
        lastWeek.push(chat);
      } else {
        older.push(chat);
      }
    });

    return {
      Today: today,
      Yesterday: yesterday,
      "Last 7 Days": lastWeek,
      Older: older,
    };
  }, [chats]);

  return (
    <aside
      className={`ai-chat-sidebar ${
        sidebarOpen ? "" : "collapsed"
      }`}
    >
      {/* ===========================
            TOP
      =========================== */}

      <div className="ai-sidebar-top">
        {sidebarOpen ? (
          <>
            <div className="ai-sidebar-logo">
              <div className="ai-sidebar-logo-icon">
                <Bot size={18} />
              </div>

              <span>QuickAI</span>
            </div>

            <button
              className="ai-sidebar-toggle"
              onClick={toggleSidebar}
            >
              <PanelLeft size={18} />
            </button>
          </>
        ) : (
          <button
            className="ai-sidebar-toggle"
            onClick={toggleSidebar}
          >
            <PanelLeft size={18} />
          </button>
        )}
      </div>

      {/* ===========================
            NEW CHAT
      =========================== */}

      <button
        className="new-chat-btn"
        onClick={onNewChat}
      >
        <Plus size={18} />

        {sidebarOpen && <span>New Chat</span>}
      </button>

      {/* ===========================
            HISTORY
      =========================== */}

      {sidebarOpen && (
        <div className="ai-sidebar-history">
          {Object.entries(groupedChats).map(
            ([groupName, list]) => {
              if (list.length === 0) return null;

              return (
                <div
                  key={groupName}
                  className="sidebar-group"
                >
                  <div className="sidebar-group-title">
                    {groupName}
                  </div>

                  <div className="sidebar-chat-list">
                                        {list.map((chat) => (
                      <div
                        key={chat.id}
                        className={`sidebar-chat-item ${
                          currentChatId === chat.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          onSelectChat(chat.id)
                        }
                      >
                        <MessageSquare
                          size={16}
                          className="sidebar-chat-icon"
                        />

                        <span
                          className="sidebar-chat-title"
                          title={chat.title}
                        >
                          {chat.title}
                        </span>

                        <div
                          className="sidebar-chat-actions"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <button
                            className="sidebar-action-btn sidebar-rename-btn"
                            onClick={() => {
                              const newTitle = prompt(
                                "Rename chat",
                                chat.title
                              );

                              if (
                                newTitle &&
                                newTitle.trim()
                              ) {
                                onRenameChat(
                                  chat.id,
                                  newTitle.trim()
                                );
                              }
                            }}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            className="sidebar-action-btn sidebar-delete-btn"
                            onClick={() =>
                              onDeleteChat(chat.id)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}

          {chats.length === 0 && (
            <div className="ai-sidebar-empty">
              No conversations yet.
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default AIChatSidebar;