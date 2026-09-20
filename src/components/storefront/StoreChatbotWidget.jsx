import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MessageSquareText,
  X,
  Minimize2,
  Maximize2,
  RotateCw,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function StoreChatbotWidget() {
  const { branding, currentTenant } = useTenant();
  const { isBn } = useLanguage();

  const chatbot = branding?.chatbot || {
    enabled: true,
    url: 'https://bot-platform-2qwf.onrender.com/chat/aaluh0fo',
    title: 'বই সহকারী AI Bot',
    welcome_message: 'আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো তথ্যের জন্য চ্যাট করুন।'
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
    <>
      {/* Mobile Backdrop when chat is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden transition-opacity"
        />
      )}

      {/* Main Container */}
      <div className="fixed z-50 bottom-20 sm:bottom-6 right-3 sm:right-6 flex flex-col items-end pointer-events-none">
        {/* Floating Teaser Speech Bubble (when closed) */}
        {!isOpen && showBubble && (
          <div
            onClick={handleOpen}
            className="pointer-events-auto mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-xl max-w-[260px] text-xs cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-0.5 relative group animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute -top-2 -left-2 bg-slate-200 hover:bg-rose-500 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-5 h-5 rounded-full text-xs flex items-center justify-center transition cursor-pointer shadow-xs"
            >
              ×
            </button>
            <div className="flex items-start space-x-2.5">
              <span className="text-lg leading-none shrink-0">👋</span>
              <div>
                <p className="font-semibold text-xs leading-snug">{welcomeMsg}</p>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-1 inline-block">
                  {isBn ? 'চ্যাট শুরু করতে ট্যাপ করুন 💬' : 'Click to chat now 💬'}
                </span>
              </div>
            </div>
            {/* Arrow pointing down to button */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 transform rotate-45" />
          </div>
        )}

        {/* Chatbot Window */}
        {isOpen ? (
          <div
            className={`pointer-events-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out fixed sm:relative inset-x-0 bottom-0 sm:inset-auto z-50 ${
              isExpanded
                ? 'h-[88vh] sm:h-[680px] w-full sm:w-[580px] max-h-[calc(100vh-40px)]'
                : 'h-[80vh] sm:h-[560px] w-full sm:w-[390px] max-h-[calc(100vh-90px)]'
            }`}
          >
            {/* Modern Glassmorphism Header */}
            <div
              className="px-4 py-3 text-white flex items-center justify-between shadow-md select-none shrink-0"
              style={{
                backgroundColor: primaryColor,
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.12) 100%)'
              }}
            >
              {/* Bot Info */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-xs animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-sm truncate leading-tight">{botTitle}</h3>
                    <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0">
                      AI
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-white/90 leading-none">
                      {isBn ? 'অনলাইনে আছেন (Instant Reply)' : 'Online (Instant Reply)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 text-white/90">
                <button
                  onClick={handleReload}
                  className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition cursor-pointer"
                  title={isBn ? 'চ্যাট রিলোড করুন' : 'Reload chat'}
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Resize Toggle (Desktop Only) */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition cursor-pointer"
                  title={isExpanded ? (isBn ? 'স্ট্যান্ডার্ড সাইজ' : 'Compact View') : (isBn ? 'প্রশস্ত ভিউ' : 'Expand View')}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition cursor-pointer"
                  title={isBn ? 'বন্ধ করুন' : 'Close'}
                >
                  <span className="sm:hidden">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                  <span className="hidden sm:inline">
                    <X className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Chatbot iframe Body */}
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

            {/* Clean Polished Footer */}
            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none shrink-0">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span className="font-medium text-[10px] text-slate-600 dark:text-slate-300">
                  Bot Platform AI
                </span>
              </div>
              <a
                href={chatbot.url}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1 font-medium text-[10px]"
              >
                <span>{isBn ? 'নতুন উইন্ডো' : 'Full Tab'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Floating Action Launcher Button (Modern Pill/FAB) */
          <button
            onClick={handleOpen}
            className="pointer-events-auto group relative flex items-center space-x-2.5 px-4 py-3 rounded-full text-white shadow-2xl transition-all duration-300 transform active:scale-95 hover:scale-105 cursor-pointer ring-4 ring-black/5 dark:ring-white/10 hover:shadow-sky-500/25"
            style={{
              backgroundColor: primaryColor,
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%)'
            }}
            aria-label="Open AI Chatbot"
            title={isBn ? 'সহায়তার জন্য চ্যাট করুন' : 'Open AI Chat'}
          >
            <div className="relative flex items-center justify-center">
              <MessageSquareText className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs" />
            </div>
            <span className="text-xs font-bold tracking-wide pr-0.5 hidden sm:inline">
              {isBn ? 'মেসেজ দিন' : 'Live Chat'}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
