"use client"

import { useState } from "react"
import ChatbotIframeModal from "./ChatbotIframeModal"

export default function ChatbotIcon() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg z-[999]"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && <ChatbotIframeModal onClose={() => setIsOpen(false)} />}
    </>
  )
}