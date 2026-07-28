import React, { useEffect, useRef } from "react";
import {
  SendHorizontal,
  Square,
} from "lucide-react";

const AIInput = ({
  value,
  onChange,
  onSend,
  loading,
  onStop,
}) => {
  const textareaRef = useRef(null);

  // Auto Resize
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <>
      <div className="ai-chat-input">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder="Ask anything about your business..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {loading ? (
          <button
            className="stop-btn"
            onClick={onStop}
            title="Stop generation"
          >
            <Square size={18} />
          </button>
        ) : (
          <button
            className="send-btn"
            onClick={onSend}
            disabled={!value.trim()}
            title="Send message"
          >
            <SendHorizontal size={20} />
          </button>
        )}
      </div>

      <div className="ai-input-footer">
        AI can make mistakes. Please verify important business decisions before
        taking action.
      </div>
    </>
  );
};

export default AIInput;