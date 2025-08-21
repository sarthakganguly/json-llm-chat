import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { SendHorizonal } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/query/chat', { query: input });
      const botMessage: Message = { sender: 'bot', text: response.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I encountered an error while fetching a response.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-15rem)] max-h-[700px] bg-white rounded-xl shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-slate-800">Chat with your Data</h2>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>Upload a document and ask a question to start.</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar Placeholder */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'} `}></div>
            <div className={`max-w-xl px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-slate-700"></div>
               <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-slate-200 text-slate-800">
                  <div className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
               </div>
            </div>
         )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-slate-50 border-t">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
