"use client"; // Obligatoire pour les composants interactifs

import Chatbot from "@/components/Chatbot";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex items-center justify-center">
      <Chatbot />
    </div>
  );
}
