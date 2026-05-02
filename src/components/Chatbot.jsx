import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import API_URL from '../config';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not connect to the server. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 hover:scale-105 transition-transform duration-200 flex items-center justify-center bg-transparent border-0 p-0"
        style={{ width: '80px', height: '80px' }}
      >
        {isOpen ? (
          <div className="w-10 h-10 rounded-full bg-black border border-red-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <DotLottieReact
            src="https://lottie.host/a81d0278-d4eb-4e60-98a9-841bbac3a526/Hylw7g1fdP.lottie"
            loop
            autoplay
            speed={1}
            style={{ width: '80px', height: '80px' }}
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-black rounded-xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden border border-neutral-800" style={{ height: '500px', maxHeight: 'calc(100vh-8rem)' }}>
          {/* Header */}
          <div className="bg-black border-b border-red-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/a81d0278-d4eb-4e60-98a9-841bbac3a526/Hylw7g1fdP.lottie"
                  loop
                  autoplay
                  speed={1}
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">ArtArtist Assistant</h3>
                <p className="text-xs text-red-500">Your AI Art Guide</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-900">
            {messages.length === 0 && (
              <div className="text-center text-neutral-400 mt-12">
                <p className="text-sm font-medium">Hello! I'm your AI art assistant.</p>
                <p className="text-xs mt-2 text-red-500">Ask me about artists, events, or artworks!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 rounded-xl px-4 py-3 border border-neutral-700">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-black border-t border-neutral-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about artists, events, artworks..."
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-600 text-sm text-white placeholder-neutral-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
