// src/App.jsx
import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Salve meu mano, vamos falar de shrek, o ogro estiloso?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    const start = Date.now();

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const botResponse = data.response || "Erro: resposta inválida.";

      const elapsed = Date.now() - start;
      const remaining = 2000 - elapsed;

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
        setLoading(false);
      }, remaining > 0 ? remaining : 0);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Erro ao se comunicar com o servidor." },
      ]);
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto border border-gray-300 rounded-md">
      <header className="bg-gray-800 text-white p-4 font-bold text-lg">
        Shrot, o shrek bot
      </header>

      <main className="flex-1 overflow-auto p-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-300 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none animate-pulse">
              Digitando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-gray-300 bg-white flex items-center gap-2">
        <textarea
          className="flex-grow border border-gray-300 rounded-md p-2 resize-none"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-2 rounded-md transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Enviar
        </button>
      </footer>
    </div>
  );
}
