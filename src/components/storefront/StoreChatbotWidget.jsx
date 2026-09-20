import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MessageSquare,
  MessageSquareText,
  X,
  Minimize2,
  Maximize2,
  RotateCw,
  Sparkles,
  Bot,
  ExternalLink
} from 'lucide-react';

export default function StoreChatbotWidget() {
  const { branding, currentTenant } = useTenant();
  const { isBn } = useLanguage();

  const chatbot = branding?.chatbot || {
    enabled: true,
    url: 'https://bot-platform-2qwf.onrender.com/chat/aaluh0fo',
    title: 'বই সহকারী AI Bot',
    welcome_message: 'আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো সহায়তার জন্য মেসেজ দিন।'
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  // Auto-hide teaser bubble after 8 seconds if not clicked
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // If disabled or no URL provided, don't render
  if (chatbot.enabled === false || !chatbot.url) {
    return null;
  }

  const primaryColor = branding?.primary_color || '#0284c7';
  const botTitle = chatbot.title || (isBn ? `${currentTenant?.name || 'স্টোর'} AI সহকারী` : `${currentTenant?.name || 'Store'} AI Assistant`);
  const welcomeMsg = chatbot.welcome_message || (isBn ? 'যেকোনো তথ্যের জন্য চ্যাট করুন!' : 'Chat with our AI assistant!');

  const handleOpen = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="fixed z-50 bottom-16 md:bottom-6 right-3 sm:right-6 flex flex-col items-end">
      {/* Floating Teaser Speech Bubble */}
      {!isOpen && showBubble && (
        <div
          onClick={handleOpen}
          className="mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-2xl shadow-xl max-w-[240px] text-xs cursor-pointer animate-bounce relative group"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-1.5 -left-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-4 h-4 rounded-full text-[10px] flex items-center justify-center hover:bg-rose-500 hover:text-white"
          >
            ×
          </button>
          <div className="flex items-start space-x-2">
            <span className="text-base leading-none">👋</span>
            <p className="font-semibold text-[11px] leading-snug">{welcomeMsg}</p>
          </div>
          {/* Arrow pointing down-right */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 transform rotate-45" />
        </div>
      )}

      {/* Expanded Chat Popup Window */}
      {isOpen ? (
        <div
          className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-3 sm:inset-6 z-50 max-w-4xl mx-auto h-[90vh]'
              : 'w-[92vw] sm:w-[390px] h-[520px] max-h-[82vh]'
          }`}
        >
          {/* Chat Window Header */}
          <div
            className="p-3.5 text-white flex items-center justify-between shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs truncate leading-tight flex items-center space-x-1.5">
                  <span>{botTitle}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </h3>
                <span className="text-[10px] text-white/80 block leading-none mt-0.5">
                  {isBn ? 'অটো-রিপ্লাই ও লাইভ সাপোর্ট' : 'Automated AI Chat'}
                </span>
              </div>
            </div>

            {/* Window Action Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleReload}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 transition cursor-pointer"
                title="রিলোড করুন"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-white/20 text-white/90 transition cursor-pointer"
                title={isExpanded ? 'ছোট করুন' : 'বড় করুন'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat iframe Container */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <iframe
              key={iframeKey}
              src={chatbot.url}
              title={botTitle}
              className="w-full h-full border-0"
              allow="microphone; camera; clipboard-read; clipboard-write;"
              loading="lazy"
            />
          </div>

          {/* Footer branding */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>AI Chatbot Powered by Bot Platform</span>
            </span>
            <a
              href={chatbot.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500 flex items-center space-x-0.5"
            >
              <span>নতুন ট্যাবে খুলুন</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Floating Trigger Launcher Button */
        <button
          onClick={handleOpen}
          className="group relative p-3.5 sm:p-4 rounded-full text-white shadow-2xl transition transform active:scale-95 hover:scale-105 flex items-center justify-center cursor-pointer ring-4 ring-white/30 dark:ring-slate-800/60"
          style={{ backgroundColor: primaryColor }}
          aria-label="Open Chatbot"
          title={isBn ? 'সহায়তার জন্য চ্যাট করুন' : 'Open AI Chat'}
        >
          <MessageSquareText className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
      )}
    </div>
  );
}
