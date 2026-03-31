import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useState, useEffect } from "react";
import { askAiAssistant, fetchCertificates } from "../../api/portfolioApi";
import { IntentDetectionService } from "../../services/intentDetectionService";

export const FloatingChatbot = ({ site, skills = [], projects = [] }) => {
  const [certificates, setCertificates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me anything about this portfolio."
    }
  ]);

  // Load certificates on mount
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const certs = await fetchCertificates();
        setCertificates(certs || []);
      } catch (error) {
        console.error("Failed to load certificates:", error);
      }
    };
    loadCertificates();
  }, []);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || loading) {
      return;
    }

    const history = messages.slice(-6);
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // LOGIC-FIRST: Try to handle with intent detection
      const portfolioData = { site, skills, projects, certificates };
      const logicResult = IntentDetectionService.handleLogicFirst(content, portfolioData);

      if (!logicResult.fallbackToAI) {
        // We have a direct answer - no AI needed
        const response = IntentDetectionService.formatResponse(logicResult.response);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        setLoading(false);
        return;
      }

      // FALLBACK TO AI: Unknown intent - use LLM
      const aiResult = await askAiAssistant({
        message: content,
        history
      });
      setMessages((prev) => [...prev, { role: "assistant", content: aiResult.message }]);
    } catch (error) {
      console.error("Error handling message:", error);
      // Final fallback - return helpful error message
      const response = "I encountered an error. Please try again or ask about certificates, skills, projects, or contact info.";
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="glass-card mb-3 flex h-[460px] w-[350px] flex-col overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="font-semibold">FolioMind Assistant</p>
              <button type="button" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user" ? "ml-auto bg-primary/20" : "bg-slate-900/70"
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
              {loading && <div className="w-fit rounded-xl bg-slate-900/70 px-3 py-2 text-xs text-slate-300">Thinking...</div>}
            </div>
            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSend()}
                placeholder="Ask about name, skills, projects..."
                className="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                disabled={loading}
                onClick={handleSend}
                className="rounded-lg bg-primary px-3 text-sm font-medium text-slate-950 disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-slate-950 shadow-xl transition hover:scale-105"
      >
        <Bot size={24} />
      </button>
    </div>
  );
};
