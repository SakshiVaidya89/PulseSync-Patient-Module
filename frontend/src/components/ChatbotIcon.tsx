"use client"

import { useState } from "react"

export default function ChatbotIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "user" | "bot" }>>([
    { id: 1, text: "Hi! 👋 How can I help you today?", sender: "bot" },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user" as const,
      }
      setMessages([...messages, newMessage])

      // Simulate bot response
      setTimeout(() => {
        const botResponses = [
          "That's great! Is there anything else I can help with?",
          "I'm here to assist you with any questions about PulseSync.",
          "Thank you for reaching out! Our team will get back to you shortly.",
          "Would you like help with booking an appointment or finding a hospital?",
          "I'm available 24/7 to support you!",
        ]
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: randomResponse,
            sender: "bot",
          },
        ])
      }, 500)

      setInputValue("")
    }
  }

  return (
    <>
      {/* Chatbot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg z-[999] hover:-translate-y-1"
      >
        💬
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col border-2 border-sky-100 z-[999] animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-4 rounded-t-3xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">PulseSync Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-2xl hover:scale-110 transition-transform">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl font-['Inter',sans-serif] text-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-br-none"
                      : "bg-sky-100 text-slate-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-sky-100 flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 border-2 border-sky-200 rounded-full text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 font-['Inter',sans-serif]"
            />
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 font-bold"
            >
              →
            </button>
          </div>
        </div>
      )}

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
    </>
  )
}
