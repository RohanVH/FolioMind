import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useState } from "react";
import { askAiAssistant } from "../../api/portfolioApi";

const buildLocalFallbackReply = ({ message, site, skills, projects }) => {
  const prompt = (message || "").toLowerCase();
  const siteName = "FolioMind";
  const roleText =
    site?.heroSubtitle ||
    site?.heroIntro ||
    "Full stack developer focused on React, Node.js, and AI integrations.";

  if (
    prompt.includes("name of this site") ||
    prompt.includes("site name") ||
    prompt.includes("website name") ||
    prompt.includes("name of the website")
  ) {
    return `This site is called ${siteName}. It is an AI powered developer portfolio platform.`;
  }

  if (prompt.includes("what this website does") || prompt.includes("what does this website do")) {
    return `${siteName} showcases the developer profile, skills, projects, contact details, and has an AI assistant for visitor questions.`;
  }

  if (prompt.includes("name") || prompt.includes("who is")) {
    return `His name is ${site?.heroTitle || "not configured yet"}.`;
  }

  if (prompt.includes("role") || prompt.includes("position") || prompt.includes("what does he do")) {
    return `His role: ${roleText}`;
  }

  if (prompt.includes("skill") || prompt.includes("tech") || prompt.includes("stack")) {
    if (!skills?.length) {
      return "No skills are configured yet in the portfolio.";
    }
    const summary = skills
      .slice(0, 12)
      .map((skill) => skill.name)
      .join(", ");
    return `Rohan's skills include: ${summary}.`;
  }

  if (prompt.includes("project") || prompt.includes("built")) {
    if (!projects?.length) {
      return "No projects are configured yet in the portfolio.";
    }
    const summary = projects
      .slice(0, 3)
      .map((project) => project.title)
      .join(", ");
    return `He has built projects like: ${summary}.`;
  }

  if (prompt.includes("full stack")) {
    return site?.heroSubtitle
      ? `Yes. ${site.heroSubtitle}`
      : "Yes, this portfolio presents him as a full stack developer.";
  }

  if (prompt.includes("contact") || prompt.includes("email") || prompt.includes("github")) {
    return `Contact details:\nEmail: ${site?.contactEmail || "Not configured"}\nGitHub: ${site?.github || "Not configured"}`;
  }

  if (prompt.includes("thank")) {
    return "You are welcome. Ask me about projects, skills, role, or contact details.";
  }

  return site?.aboutText || "Portfolio data is available, but this answer is currently limited.";
};

export const FloatingChatbot = ({ site, skills = [], projects = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me anything about this portfolio."
    }
  ]);

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
      const res = await askAiAssistant({
        message: content,
        history
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.message }]);
    } catch (error) {
      const fallback = buildLocalFallbackReply({
        message: content,
        site,
        skills,
        projects
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallback }
      ]);
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
