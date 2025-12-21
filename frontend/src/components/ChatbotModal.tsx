"use client"

import { useState, useRef, useEffect } from "react"
import { getChatbotResponse } from "../actions/chatbot"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

interface ChatbotModalProps {
  onClose: () => void
}

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Pulse, your AI health assistant. Please describe your symptoms, and I'll do my best to help guide you.",
      sender: "bot",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const chatboxRef = useRef<HTMLDivElement>(null)

  const chatHistory = useRef<Array<{ role: string; parts: Array<{ text: string }> }>>([
    {
      role: "model",
      parts: [
        {
          text: "Hello! I'm Pulse, your AI health assistant. Please describe your symptoms, and I'll do my best to help guide you.",
        },
      ],
    },
  ])

  const systemInstruction = {
    role: "system",
    parts: [
      {
        text: `You are 'Pulse', a friendly, empathetic, and cautious AI healthcare assistant.
Your primary goal is to help users understand their symptoms by asking clarifying follow-up questions.
RULES:
1. NEVER PROVIDE A DIAGNOSIS. Never say "you have..." or "it is...". Use cautious phrases like "Your symptoms could suggest...", "This might be related to...", or "It's possible that...".
2. ASK FOLLOW-UP QUESTIONS. Ask one clear, relevant question at a time to gather more information. Continue asking until you have a clear picture.
3. EXPLAIN POSSIBILITIES. Once you have enough information, explain what the combination of symptoms could mean in simple terms.
4. SUGGEST SPECIALISTS. Recommend the type of doctor to see (e.g., for persistent joint pain, suggest a Rheumatologist).
5. PRIORITIZE URGENCY. For severe symptoms (chest pain, difficulty breathing, severe headache, high fever, confusion), immediately and strongly advise seeking emergency medical attention.
6. SUGGEST OTC MEDS CAUTIOUSLY. For minor, non-urgent issues, you can suggest common over-the-counter medicine but ALWAYS follow with "consult a doctor or pharmacist before taking any medication."
7. FORMATTING. Format responses using HTML for readability.`,
      },
    ],
  }

  const addMessage = (sender: "user" | "bot", text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    addMessage("user", userText)
    setInputValue("")

    chatHistory.current.push({
      role: "user",
      parts: [{ text: userText }],
    })

    setIsLoading(true)

    try {
      const botResponse = await getChatbotResponse(chatHistory.current)

      // Add bot response to history
      chatHistory.current.push({
        role: "model",
        parts: [{ text: botResponse }],
      })

      addMessage("bot", botResponse)
    } catch (error) {
      console.error("Error calling chatbot:", error)
      addMessage("bot", "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      className={`fixed bottom-24 right-8 w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border-2 border-sky-100 z-[999] animate-fade-in ${
        isDarkMode ? "bg-slate-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-4 rounded-t-3xl flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Pulse Assistant</h3>
          <p className="text-xs opacity-90">Your AI Health Assistant</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full hover:bg-sky-400 transition-colors text-lg"
            aria-label="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform" aria-label="Close chat">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatboxRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-br-none"
                  : isDarkMode
                    ? "bg-slate-600 text-white rounded-bl-none"
                    : "bg-sky-100 text-slate-800 rounded-bl-none"
              }`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${isDarkMode ? "bg-slate-600" : "bg-sky-100"}`}>
              <div className="flex gap-2 items-center">
                <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-white" : "bg-slate-800"}`} />
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-white" : "bg-slate-800"}`}
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-white" : "bg-slate-800"}`}
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className={`p-4 border-t flex gap-3 ${isDarkMode ? "border-slate-600 bg-slate-800" : "border-sky-100 bg-white rounded-b-3xl"}`}
      >
        <input
          type="text"
          placeholder="Tell me about your symptoms..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
          disabled={isLoading}
          className={`flex-1 px-4 py-2 border-2 rounded-full text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${
            isDarkMode
              ? "border-slate-500 bg-slate-700 text-white placeholder-slate-400 focus:border-sky-400 focus:ring-sky-300"
              : "border-sky-200 bg-white text-slate-800 placeholder-slate-500 focus:border-sky-400 focus:ring-sky-100"
          }`}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          aria-label="Send message"
        >
          →
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
