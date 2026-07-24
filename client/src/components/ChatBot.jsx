import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from "react-icons/fa";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hello traveler! I am your VoyageAI companion. Ask me anything about your destination's highlights, food recommendations, safety tips, or hotel advice!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-smart-travel-agent-3.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: data.text || "I'm sorry, I couldn't process that response.",
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to contact chat assistant");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "⚠️ I'm having trouble connecting to the AI server. Please make sure the backend is active and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble Launcher */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-16 h-16 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_30px_rgba(37,99,235,0.6)] flex items-center justify-center text-2xl hover:scale-105 transition-all duration-200 z-40 border border-blue-500 cursor-pointer"
      >
        {open ? <FaTimes /> : <FaRobot className="animate-pulse" />}
      </button>

      {/* Chat Window Container */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 z-40 transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <FaRobot className="text-xl text-blue-200" />
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">VoyageAI Concierge</h3>
                <span className="text-[10px] text-blue-200 font-semibold tracking-widest uppercase">Online Companion</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
              <FaTimes />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold
                  ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-blue-100 text-blue-600"}`}
                >
                  {msg.sender === "user" ? <FaUser /> : <FaRobot />}
                </div>

                {/* Bubble content */}
                <div
                  className={`rounded-2xl p-3 max-w-[78%] text-xs leading-relaxed shadow-sm font-medium
                  ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Bouncing Dot Loader */}
            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs">
                  <FaRobot />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Footer Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a travel question..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium outline-none bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-9 h-9 flex items-center justify-center shadow-md disabled:opacity-50 transition-colors cursor-pointer shrink-0 border border-blue-500"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

export default ChatBot;