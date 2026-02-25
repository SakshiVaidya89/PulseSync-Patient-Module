interface ChatbotIframeModalProps {
    onClose: () => void
  }
  
  export default function ChatbotIframeModal({ onClose }: ChatbotIframeModalProps) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40 z-[998]"
          onClick={onClose}
        />
  
        {/* Modal */}
        <div className="fixed bottom-24 right-8 w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden z-[999] border-2 border-sky-100">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
            <span className="font-semibold">Pulse AI Assistant</span>
            <button onClick={onClose} className="text-xl">
              ✕
            </button>
          </div>
  
          {/* IFRAME */}
          <iframe
            src="/chatbot.html"
            className="w-full h-[calc(100%-48px)] border-0"
            title="Pulse Chatbot"
          />
        </div>
      </>
    )
  }