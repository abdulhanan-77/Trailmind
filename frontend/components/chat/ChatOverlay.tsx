'use client';

import { useState, useRef, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { dispatchAgentCommand, AgentCommand, AgentActionType } from '@/types/agent-commands';

// ========================================
// 🎨 SVG Icons
// ========================================
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
        <path d="m21.854 2.147-10.94 10.939" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
}

// Extended to support agent commands
interface Message {
    role: 'user' | 'agent';
    content: string;
    type?: 'text' | 'product_carousel' | 'agent_command';
    data?: Product[];
    command?: AgentCommand;
}

// Helper to check if response contains an agent command
function extractAgentCommand(data: any): AgentCommand | null {
    if (data.action && ['ROTATE_MODEL', 'ZOOM_MODEL', 'RESET_VIEW', 'HIGHLIGHT_FEATURE'].includes(data.action)) {
        return {
            action: data.action as AgentActionType,
            coordinates: data.coordinates,
            zoomLevel: data.zoomLevel,
            featureId: data.featureId,
            message: data.message
        };
    }
    return null;
}

export default function ChatOverlay() {
    const { isChatOpen, toggleChat, closeChat } = useUI();
    const { addToCart } = useCart();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'agent', content: "Hello! I'm your AI Concierge. How can I help you today? I can also control the 3D viewer - just ask me to show you different angles!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isChatOpen) scrollToBottom();
    }, [messages, isChatOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content })
            });

            const data = await res.json();

            // Check for agent command in response
            const agentCommand = extractAgentCommand(data);

            if (agentCommand) {
                // Dispatch command to 3D viewer
                dispatchAgentCommand(agentCommand);
            }

            const agentMsg: Message = {
                role: 'agent',
                content: agentCommand?.message || data.content || JSON.stringify(data),
                type: agentCommand ? 'agent_command' : (data.type || 'text'),
                data: data.data,
                command: agentCommand || undefined
            };

            setMessages(prev => [...prev, agentMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'agent', content: "Sorry, I'm having trouble connecting." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button (Bottom Right) */}
            {!isChatOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Open AI Assistant"
                    id="tour-chat"
                >
                    <MessageIcon />
                </button>
            )}

            {/* Chat Sidebar Panel */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">AI Assistant</h2>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button onClick={closeChat} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <CloseIcon />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.role === 'user'
                                ? 'bg-slate-800 text-white rounded-br-sm'
                                : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100 shadow-sm'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                {/* Product Cards */}
                                {msg.type === 'product_carousel' && msg.data && (
                                    <div className="mt-3 space-y-2">
                                        {msg.data.map((p) => (
                                            <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <span className="font-bold text-blue-600 text-sm">${p.price}</span>
                                                    <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-50">
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2 items-end bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                        <textarea
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 resize-none max-h-24 p-2 placeholder:text-slate-400"
                            placeholder="Ask anything..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">Powered by LangGraph</p>
                </div>
            </div>

            {/* Backdrop (Mobile) */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeChat}
                />
            )}
        </>
    );
}
