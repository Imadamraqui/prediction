"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const formatBotResponse = (content: string) => {
    try {
      // Essayer de parser le contenu comme du JSON
      const jsonContent = JSON.parse(content);
      
      // Si c'est un objet avec une propriété summary
      if (jsonContent.summary) {
        let formattedResponse = "";
        
        // Ajouter le titre
        if (jsonContent.summary.title) {
          formattedResponse += `## ${jsonContent.summary.title}\n\n`;
        }
        
        // Ajouter les user stories
        if (jsonContent.summary.userStories) {
          formattedResponse += "### User Stories\n\n";
          jsonContent.summary.userStories.forEach((story: string) => {
            formattedResponse += `- ${story}\n`;
          });
          formattedResponse += "\n";
        }
        
        // Ajouter les étapes
        if (jsonContent.summary.steps) {
          formattedResponse += "### Étapes\n\n";
          jsonContent.summary.steps.forEach((step: string, index: number) => {
            formattedResponse += `${index + 1}. ${step}\n`;
          });
        }
        
        return formattedResponse;
      }
      
      // Si ce n'est pas un objet summary, retourner le JSON formaté
      return JSON.stringify(jsonContent, null, 2);
    } catch (e) {
      // Si ce n'est pas du JSON, retourner le contenu tel quel
      return content;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || "Une erreur est survenue");
      }

      const botReply = data.choices?.[0]?.message?.content || "❌ Pas de réponse.";
      const formattedReply = formatBotResponse(botReply);
      setMessages((prev) => [...prev, { role: "bot", content: formattedReply }]);
    } catch (error) {
      console.error("Erreur:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: `❌ Erreur: ${errorMessage}\n\nVeuillez vérifier que le serveur backend est bien démarré et que la clé API est valide.` 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-green-700">💬 Assistant Médical</h2>
            <p className="text-gray-600 mt-2">Posez vos questions médicales, je suis là pour vous aider.</p>
          </div>

          <div
            ref={chatContainerRef}
            className="overflow-y-auto h-[calc(100vh-300px)] p-6 space-y-4 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-md max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code: ({ className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl shadow-md bg-white text-gray-800 border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-grow px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
