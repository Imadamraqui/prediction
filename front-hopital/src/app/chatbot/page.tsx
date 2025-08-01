"use client"; // Obligatoire pour les composants interactifs

import Chatbot from "@/components/Chatbot";
import Header from "@/components/header";
export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center justify-center">
   
      <div className="flex-grow flex items-center justify-center p-4">
        <Chatbot />
      </div>
        <p className="text-gray-600">© 2025 Assistant Médical. Tous droits réservés.</p>
    </div>
  );
}
