import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";


function FloatingAIButton() {
  const navigate = useNavigate();

  return (
    <div
      className="floating-ai"
      onClick={() => navigate("/products/ai-chat")}
    >
      <div className="ai-tooltip">
        Ask me anything
      </div>

      <div className="ai-button">
        <Bot size={28} />
      </div>
    </div>
  );
}

export default FloatingAIButton;