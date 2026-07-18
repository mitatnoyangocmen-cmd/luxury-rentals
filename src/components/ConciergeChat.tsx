import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, User, ShieldAlert, CheckCircle2, ChevronRight, RefreshCw, X, HelpCircle, PhoneCall } from 'lucide-react';
import { FAQS } from '../data';

interface Message {
  sender: 'guest' | 'concierge';
  text: string;
  timestamp: string;
}

const LOCAL_RESPONSES: { [key: string]: string } = {
  wifi: "The high-speed Wi-Fi network is named 'IstanbulLuxe_HighSpeed_5G'. The password is 'historic_peninsula_2026'. It is symmetric 200 Mbps fiber, suitable for work and 4K cinema streaming.",
  jacuzzi: "The glass jacuzzi is private, inside the master suite. Ensure the drain is fully sealed, fill with warm water using the gold fixtures, and turn on the bubble jets via the remote. Turn on the LED therapy lights for maximum relaxation!",
  supermarket: "There is a well-stocked 'Şok Supermarket' just a 1-minute walk from our doorstep (turn left on the main road), and a premium 'CarrefourSA' a 3-minute walk away. Both are open from 9:00 AM to 10:00 PM daily.",
  baklava: "For the absolute best local Baklava experience, take the T1 Tram 3 stops to Karaköy and visit 'Karaköy Güllüoğlu'—the world's most legendary Baklava parlor since 1843. Try the pistachio cold baklava with Turkish tea!",
  luggage: "Absolutely! You can securely drop off your luggage at the apartment starting at 10:30 AM while our professional crew prepares the rooms. Simply notify us via WhatsApp 24 hours in advance."
};

export default function ConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'concierge',
      text: "Merhaba! Welcome to Istanbul Luxe. I am your premium AI Concierge and Local Guide. Ask me anything about our 150m² private residence, check-in details, VIP airport transfers, public transport, or local dining recommendations!",
      timestamp: '1:18 PM'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('faq');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const guestMsg: Message = {
      sender: 'guest',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, guestMsg]);
    setInputValue('');
    setIsTyping(true);

    // Analyze lowercase input for smart keyword fallback first
    const lowerText = textToSend.toLowerCase();
    let localReply = '';

    if (lowerText.includes('wi-fi') || lowerText.includes('wifi') || lowerText.includes('password')) {
      localReply = LOCAL_RESPONSES.wifi;
    } else if (lowerText.includes('jacuzzi') || lowerText.includes('hot tub') || lowerText.includes('spa')) {
      localReply = LOCAL_RESPONSES.jacuzzi;
    } else if (lowerText.includes('supermarket') || lowerText.includes('grocery') || lowerText.includes('shop')) {
      localReply = LOCAL_RESPONSES.supermarket;
    } else if (lowerText.includes('baklava') || lowerText.includes('sweet') || lowerText.includes('dessert') || lowerText.includes('restaurant')) {
      localReply = LOCAL_RESPONSES.baklava;
    } else if (lowerText.includes('luggage') || lowerText.includes('early check')) {
      localReply = LOCAL_RESPONSES.luggage;
    }

    try {
      // Try fetching from the real backend Gemini proxy route /api/concierge
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const aiMsg: Message = {
            sender: 'concierge',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI route failed or unavailable, falling back to smart local guide", e);
    }

    // Fallback response block
    setTimeout(() => {
      let finalReply = localReply;
      if (!finalReply) {
        finalReply = `Thank you for asking! I’ve registered your inquiry regarding "${textToSend}". Since my live server link is currently generating in the background, our host Mitat is available directly on WhatsApp (+90 530 000 00 00) to answer this immediately! \n\nQuick Tip: If you need information on WiFi, Jacuzzi, Supermarkets, or local Baklava, ask me about those keywords or check out the "Instant FAQs" tab!`;
      }

      const replyMsg: Message = {
        sender: 'concierge',
        text: finalReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleFaqClick = (faq: { question: string; answer: string }) => {
    setActiveTab('chat');
    handleSendMessage(faq.question);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Header with Luxury Brand details */}
      <div className="bg-charcoal p-5 flex justify-between items-center text-white border-b border-white/5">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-charcoal font-bold shadow-md">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wide flex items-center">
              Istanbul Luxe Concierge
            </h4>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[10px] text-gray-400 font-medium">Verified Local Host Assistant</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'faq' : 'chat')}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-gold font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition cursor-pointer"
          >
            {activeTab === 'chat' ? 'Show FAQs' : 'Launch Chat'}
          </button>
        </div>
      </div>

      {/* Tabs View Selector */}
      <div className="bg-cream/40 border-b border-gray-100 flex grid grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`py-3.5 text-center text-xs uppercase font-bold tracking-wider transition cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-white text-gold border-b-2 border-gold font-bold'
              : 'text-gray-400 hover:text-charcoal'
          }`}
        >
          Instant FAQs Directory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`py-3.5 text-center text-xs uppercase font-bold tracking-wider transition cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white text-gold border-b-2 border-gold font-bold'
              : 'text-gray-400 hover:text-charcoal'
          }`}
        >
          Ask AI Concierge
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-white relative">
        <AnimatePresence mode="wait">
          {activeTab === 'faq' ? (
            <motion.div
              key="faq-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center py-2">
                <HelpCircle className="w-7 h-7 text-gold mx-auto mb-1.5 opacity-60" />
                <h5 className="font-serif text-sm text-charcoal font-semibold">Pre-Compiled Instant Support</h5>
                <p className="text-[10px] text-gray-400 mt-1">Click any question below to see the verified host reply instantly.</p>
              </div>

              <div className="grid gap-3">
                {FAQS.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleFaqClick(faq)}
                    className="w-full p-3.5 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-cream/20 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-xs text-charcoal font-medium group-hover:text-gold transition">
                      {faq.question}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 h-full flex flex-col justify-between"
            >
              {/* Chat Logs scroll container */}
              <div className="space-y-4 flex-1 pr-1">
                {messages.map((msg, i) => {
                  const isConcierge = msg.sender === 'concierge';
                  return (
                    <div
                      key={i}
                      className={`flex ${isConcierge ? 'justify-start' : 'justify-end'} items-end space-x-2`}
                    >
                      {isConcierge && (
                        <div className="w-7 h-7 rounded-full bg-charcoal text-gold flex items-center justify-center shrink-0 text-[10px] font-bold">
                          IL
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed ${
                          isConcierge
                            ? 'bg-cream text-charcoal rounded-bl-none border border-gray-100'
                            : 'bg-gold text-white rounded-br-none'
                        }`}
                      >
                        <p className="whitespace-pre-line font-light">{msg.text}</p>
                        <span
                          className={`text-[9px] block mt-1.5 text-right ${
                            isConcierge ? 'text-gray-400' : 'text-white/70'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Bubble Indicator */}
                {isTyping && (
                  <div className="flex justify-start items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-charcoal text-gold flex items-center justify-center text-[10px] font-bold animate-pulse">
                      IL
                    </div>
                    <div className="bg-cream border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="pt-3 border-t border-gray-100 flex items-center space-x-2 bg-white sticky bottom-0">
                <input
                  type="text"
                  placeholder="Ask about WiFi speed, checkout hour, best tea..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputValue)}
                  className="flex-1 bg-cream border border-gray-200 px-4 py-3 rounded-full text-xs focus:border-gold focus:outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputValue)}
                  className="p-3 rounded-full bg-charcoal text-gold hover:bg-gold hover:text-white transition active:scale-90 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Direct Contact Button footer */}
      <div className="bg-cream/40 p-3 px-5 border-t border-gray-100 flex justify-between items-center text-xs">
        <span className="text-gray-500 font-medium">Need instant human contact?</span>
        <a
          href="https://wa.me/905300000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold font-bold hover:text-charcoal transition flex items-center space-x-1 underline cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 mr-1" />
          <span>Call Host Team</span>
        </a>
      </div>
    </div>
  );
}
