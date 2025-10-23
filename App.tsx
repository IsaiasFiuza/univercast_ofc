import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { BotIcon } from './components/Icons';
import type { Message } from './types';
import { MessageRole } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: MessageRole.MODEL,
      text: 'Olá! Eu sou o assistente virtual da UNIVERCAST. Como posso ajudar com nossos serviços e preços hoje?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      text: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToGemini(userInput);
      const botMessage: Message = {
        id: `model-${Date.now()}`,
        role: MessageRole.MODEL,
        text: botResponseText,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: MessageRole.MODEL,
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col w-full max-w-2xl h-full max-h-[95vh] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <header className="p-4 border-b border-gray-700">
           <div className="header-content flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-full">
                <BotIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">UNIVERCAST</h1>
                <p className="text-sm text-green-400">● Online</p>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 my-4">
                 <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-gray-300" />
                 </div>
                 <div className="p-3 rounded-2xl max-w-md bg-gray-700 rounded-bl-none">
                    <div className="flex items-center justify-center gap-2 dots-container h-5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
