import { useState } from "react";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ChatWidgetButton } from "./components/chat/ChatWidgetButton";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          AnonQs <span className="text-primary italic">Chat</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          The anonymous Q&A widget for students. Ask questions without fear, get
          real-time responses, and see AI-powered summaries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Anonymous",
              desc: "No names, no profiles. Just helpful responses.",
              icon: "🔒",
            },
            {
              title: "Real-time",
              desc: "Chat-like interface for instant discussions.",
              icon: "⚡",
            },
            {
              title: "AI-Powered",
              desc: "Get concise summaries of long threads automatically.",
              icon: "🤖",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-primary/50 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ChatWidgetButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ChatContainer />
        </div>
      )}
    </div>
  );
}

export default App;
