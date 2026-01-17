'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
import { Send, ShoppingBag, User, CheckCircle, AlertCircle, Tag, ArrowRight } from 'lucide-react';

// ==========================================
// 🎨 Theme Constants (White/Bluish)
// ==========================================
const THEME = {
  primary: 'bg-slate-900', // Deep Blue/Black for high contrast
  secondary: 'bg-blue-50', // Very light blue for backgrounds
  accent: 'text-blue-600',
  white: 'bg-white',
  text: 'text-slate-800',
  subtext: 'text-slate-500',
  border: 'border-slate-200'
};

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  sustainability?: { score: number }; // UCP Field
}

interface Message {
  role: 'user' | 'agent';
  content: string;
  type?: 'text' | 'product_carousel' | 'confirmation_request' | 'ap2_receipt' | 'offer_card';
  data?: any;
  mandate?: any; // For AP2
  offer_details?: any; // For Retention
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Generate Session ID on mount
  useEffect(() => {
    setSessionId(`session_${Math.random().toString(36).substring(7)}`);
  }, []);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;

    // Optimistic UI Update
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId // 🧵 IMPORTANT: Maintains LangGraph Thread
        })
      });

      const data = await res.json();

      // Handle the various response types from Backend
      const agentMsg: Message = {
        role: 'agent',
        content: data.content || (data.type === 'confirmation_request' ? data.query : "Processing..."),
        type: data.type || 'text',
        data: data.data,
        mandate: data.mandate,
        offer_details: data.offer_details
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'agent', content: "Unable to connect to the Agent Network." }]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🧩 Component: Product Card (UCP Style)
  // ==========================================
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-[280px]">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-slate-800">{product.name}</h3>
        <span className="font-bold text-blue-600">${product.price}</span>
      </div>
      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>

      {product.sustainability && (
        <div className="mt-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit">
          <span>🌱 Eco-Score: {product.sustainability.score}/100</span>
        </div>
      )}

      <div className="mt-3 flex gap-1 flex-wrap">
        {product.features.map((f, i) => (
          <span key={i} className="text-[10px] uppercase tracking-wider bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
            {f}
          </span>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // 🧩 Component: AP2 Receipt
  // ==========================================
  const ReceiptCard = ({ content, data }: { content: string, data: any }) => (
    <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm mt-2">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="font-bold text-slate-800">Payment Authorized</span>
      </div>
      <p className="text-sm text-slate-600 mb-3">{content}</p>
      <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-500">
        <div className="flex justify-between">
          <span>MANDATE ID:</span>
          <span>{data.mandate_id}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>AMOUNT:</span>
          <span className="font-bold text-slate-800">{data.currency} {data.total_amount}</span>
        </div>
        {data.auth_token && (
          <div className="flex justify-between mt-1 pt-1 border-t border-slate-200">
            <span>TOKEN:</span>
            <span>{data.auth_token}</span>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // 🧩 Component: HITL Confirmation
  // ==========================================
  const ConfirmationCard = ({ mandate, query }: { mandate: any, query: string }) => (
    <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm mt-3">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold">Authorization Required (AP2)</span>
      </div>
      <p className="text-sm text-slate-700 mb-4">{query}</p>

      <div className="flex gap-3">
        <button
          onClick={() => sendMessage("Yes, I authorize this payment.")}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Confirm Pay ${mandate.total_amount}
        </button>
        <button
          onClick={() => sendMessage("No, cancel transaction.")}
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 🧩 Component: Retention Offer
  // ==========================================
  const OfferCard = ({ details, content }: { details: any, content: string }) => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mt-2 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Tag className="w-24 h-24" />
      </div>
      <h4 className="font-bold text-blue-900 flex items-center gap-2">
        <Tag className="w-4 h-4" /> Exclusive Offer
      </h4>
      <p className="text-sm text-blue-800 mt-1">{content}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-blue-600">{details.discount} OFF</span>
        <span className="text-xs text-blue-500">Code: {details.code}</span>
      </div>
      <div className="mt-1 text-[10px] text-blue-400">Expires in: {details.expiry}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-5xl mx-auto shadow-2xl overflow-hidden">
      {/* 🟢 Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Agentic Commerce
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
            Protocol: AP2 + UCP
          </span>
          <div className="p-1.5 bg-slate-100 rounded-full">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </header>

      {/* 🟢 Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>

            {msg.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
            )}

            <div className={`max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
              ? 'bg-slate-800 text-white rounded-br-none'
              : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
              }`}>

              {/* Text Content */}
              {msg.content && msg.type !== 'ap2_receipt' && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              )}

              {/* Dynamic Components based on Message Type */}

              {msg.type === 'product_carousel' && msg.data && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2 snap-x">
                  {msg.data.map((p: Product) => (
                    <div className="snap-center" key={p.id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}

              {msg.type === 'confirmation_request' && msg.mandate && (
                <ConfirmationCard mandate={msg.mandate} query={msg.content || (msg as any).query} />
              )}

              {msg.type === 'ap2_receipt' && (
                <ReceiptCard content={msg.content} data={msg.data} />
              )}

              {msg.type === 'offer_card' && msg.offer_details && (
                <OfferCard details={msg.offer_details} content={msg.content} />
              )}

            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start ml-11">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        )}
      </div>

      {/* 🟢 Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 max-w-4xl mx-auto relative">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-800 placeholder:text-slate-400 transition-all font-medium"
            placeholder="Search products, compare prices, or check order status..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] text-slate-400 font-mono">
          Powered by LangGraph & Universal Commerce Protocol
        </div>
      </div>
    </div>
  );
}
