"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("http://localhost:5000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botReply = data.choices?.[0]?.message?.content || "❌ Pas de réponse.";
    setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">💬 Chatbot Médical</h2>

        <div
          ref={chatContainerRef}
          className="overflow-y-auto h-[320px] border p-4 rounded bg-gray-50 space-y-3"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg shadow max-w-[80%] text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-200 text-right"
                    : "bg-white text-left border"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-grow border rounded-l px-4 py-2 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-6 py-2 rounded-r hover:bg-green-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
