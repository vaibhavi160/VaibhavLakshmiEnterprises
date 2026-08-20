import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  MessageCircle,
  X,
  Send,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Phone,
  Droplets,
  Building,
  Paintbrush,
  HelpCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SupportChatWidget: React.FC = () => {
  const {
    conversations,
    sendMessage,
    startNewConversation,
    user,
    settings,
    setIsAuthOpen,
    showToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'whatsapp'>('whatsapp');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentTimeTick, setCurrentTimeTick] = useState(Date.now());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Periodic clock refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute live technician availability status in IST
  const availability = useMemo(() => {
    const now = new Date(currentTimeTick);
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istDate = new Date(utc + 5.5 * 3600000);

    const day = istDate.getDay();
    const hour = istDate.getHours() + istDate.getMinutes() / 60;

    const startHour = settings.businessHoursStart ?? 8.5; // 8:30 AM
    const endHour = settings.businessHoursEnd ?? 20.5; // 8:30 PM
    const workingDays = settings.businessDays ?? [0, 1, 2, 3, 4, 5, 6];

    const isWorkingDay = workingDays.includes(day);
    const isWorkingHour = hour >= startHour && hour < endHour;

    let isOnline = isWorkingDay && isWorkingHour;
    if (
      settings.technicianOnlineOverride !== undefined &&
      settings.technicianOnlineOverride !== null
    ) {
      isOnline = settings.technicianOnlineOverride;
    }

    const formatHour = (h: number) => {
      const whole = Math.floor(h);
      const mins = Math.round((h - whole) * 60);
      const period = whole >= 12 ? 'PM' : 'AM';
      const displayHour = whole % 12 === 0 ? 12 : whole % 12;
      const displayMins = mins < 10 ? `0${mins}` : mins;
      return `${displayHour}:${displayMins} ${period}`;
    };

    const opensAtStr = formatHour(startHour);
    const closesAtStr = formatHour(endHour);

    const formattedIstTime = istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[day];

    return {
      isOnline,
      currentDayName,
      formattedIstTime,
      opensAtStr,
      closesAtStr,
      technicianName: settings.technicianName || 'Rajeshwar Shukla',
      technicianRole: settings.technicianRole || 'Senior Chemical & Waterproofing Specialist',
      businessHoursText: settings.businessHoursText || `Mon – Sun: ${opensAtStr} – ${closesAtStr} IST`,
    };
  }, [settings, currentTimeTick]);

  // Synchronize conversation with user
  useEffect(() => {
    if (!activeConvId && user) {
      const userConv = conversations.find(
        c => c && ((c.userId && (c.userId === user.uid || c.userId === (user as any).id)) || (user.email && c.userEmail === user.email))
      );
      if (userConv && userConv.id) {
        setActiveConvId(userConv.id);
      }
    }
  }, [user, conversations, activeConvId]);

  const currentConv = conversations.find(c => c.id === activeConvId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [isOpen, activeTab, currentConv?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!user) {
      showToast('Please log in or register to chat with technical support.', 'info');
      setIsAuthOpen(true);
      return;
    }

    const messageText = inputText.trim();
    setInputText('');

    if (!activeConvId || !currentConv) {
      const name = user.name || 'Valued Customer';
      const email = user.email || 'customer@lucknow.in';
      const phone = user.phone || '9454666748';
      
      const newId = startNewConversation(name, email, phone, messageText);
      setActiveConvId(newId);
    } else {
      sendMessage(activeConvId, messageText, 'user');
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!user) {
      showToast('Please log in or register to start a chat session.', 'info');
      setIsAuthOpen(true);
      return;
    }

    if (!activeConvId || !currentConv) {
      const name = user.name || 'Valued Customer';
      const email = user.email || 'customer@lucknow.in';
      const phone = user.phone || '9454666748';
      const newId = startNewConversation(name, email, phone, promptText);
      setActiveConvId(newId);
    } else {
      sendMessage(activeConvId, promptText, 'user');
    }
  };

  const quickTemplates = [
    {
      id: 'waterproofing',
      icon: Droplets,
      label: 'Waterproofing Consultation',
      msg: `Hello ${availability.technicianName}, I need urgent technical consultation for roof / basement / bathroom waterproofing in Lucknow. Could you please advise the best chemical application process?`,
    },
    {
      id: 'inspection',
      icon: Building,
      label: 'Site Inspection Request',
      msg: `Hello ${availability.technicianName}, I would like to request an on-site structural inspection and chemical estimation for my construction site in Lucknow.`,
    },
    {
      id: 'paint',
      icon: Paintbrush,
      label: 'Paint / PU Polish Shades',
      msg: `Hello ${availability.technicianName}, I am inquiring about Nippon Paint & Birla Opus interior/exterior shades and PU polish pricing.`,
    },
    {
      id: 'pricing',
      icon: HelpCircle,
      label: 'Bulk Price / Contractor Quote',
      msg: `Hello Maa Vaibhav Lakshmi Enterprises, I need wholesale contractor pricing for Dr. Fixit & Sika construction chemicals.`,
    },
  ];

  const handleWhatsAppSend = (customText?: string) => {
    const textToSend =
      customText ||
      selectedTemplate ||
      `Hello ${availability.technicianName} (Maa Vaibhav Lakshmi Enterprises), I would like to inquire about your products and specialized waterproofing services in Lucknow.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(waUrl, '_blank');
    setIsOpen(false);
  };

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div
      id="floating-support-hub"
      className="fixed bottom-20 md:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="support-hub-popover"
            initial={{ opacity: 0, scale: 0.9, y: 16, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 glass-floating-popover text-slate-800 dark:text-slate-100 rounded-3xl w-[360px] sm:w-[410px] max-w-[calc(100vw-1.5rem)] h-[550px] max-h-[min(580px,calc(100dvh-6.5rem))] flex flex-col overflow-hidden transition-colors"
          >
            {/* Top Expert Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-3.5 text-white border-b border-slate-800 shrink-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-base shadow-md border border-emerald-400/40">
                      {availability.technicianName ? availability.technicianName[0] : 'R'}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                        availability.isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    >
                      {availability.isOnline && (
                        <span className="w-full h-full rounded-full bg-emerald-300 animate-ping opacity-80" />
                      )}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs text-white leading-tight">
                        {availability.technicianName}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-tight mt-0.5">
                      {availability.technicianRole}
                    </p>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                      Authorized Dr. Fixit & Sika Specialist
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {activeTab === 'chat' && currentConv && (
                    <button
                      id="support-chat-new-btn"
                      onClick={() => setActiveConvId(null)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                      title="Start New Chat Session"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    id="support-hub-close-btn"
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                    aria-label="Close Support Hub"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Indicator Bar */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      availability.isOnline
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        availability.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span>{availability.isOnline ? 'Online in Lucknow' : 'Technician Away'}</span>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{availability.formattedIstTime} IST</span>
                  </span>
                </div>
                <span className={`font-bold ${availability.isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {availability.isOnline ? '⚡ Avg. Reply < 5m' : 'Replies 8:30 AM'}
                </span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 p-1 gap-1">
              <button
                id="support-tab-whatsapp"
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp</span>
              </button>

              <button
                id="support-tab-livechat"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
                  activeTab === 'chat'
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Web Live Chat</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab 1: Instant WhatsApp & Direct Phone Consultation */}
            {activeTab === 'whatsapp' && (
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-white dark:bg-slate-900 text-xs">
                {/* Working Hours Notice */}
                <div
                  className={`p-3 rounded-2xl border flex items-start gap-2.5 text-[11px] ${
                    availability.isOnline
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-slate-800 dark:text-slate-200'
                      : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <Clock
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      availability.isOnline
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>Consultation Hours</span>
                      <span className="font-mono text-[10px]">
                        {availability.opensAtStr} – {availability.closesAtStr}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-90 leading-tight">
                      {availability.isOnline
                        ? `Rajeshwar is active now for instant WhatsApp site guidance in Lucknow (${availability.currentDayName}).`
                        : `Currently outside consultation hours (${availability.businessHoursText}). Leave a WhatsApp message for priority morning reply.`}
                    </p>
                  </div>
                </div>

                {/* Quick Topic Selection */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Select Quick Inquiry Topic:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickTemplates.map(t => {
                      const Icon = t.icon;
                      const isSel = selectedTemplate === t.msg;
                      return (
                        <button
                          key={t.id}
                          id={`wa-template-${t.id}`}
                          onClick={() => setSelectedTemplate(isSel ? null : t.msg)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                            isSel
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon
                              className={`w-4 h-4 ${
                                isSel ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                              }`}
                            />
                            {isSel && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            )}
                          </div>
                          <span className="font-bold text-[10px] leading-tight line-clamp-2">
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary WhatsApp Action Button */}
                <button
                  id="wa-primary-chat-btn"
                  onClick={() => handleWhatsAppSend()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat with Rajeshwar on WhatsApp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Direct Phone & Store Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <a
                    href={`tel:+91${settings.primaryPhone}`}
                    className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Direct Call: +91 {settings.primaryPhone}</span>
                  </a>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">
                    Chinhat, Lucknow
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Web Live Consultation with Real-time Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                {!user ? (
                  /* Auth Gate for Live Chat */
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-800/60">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Sign In Required for Live Chat
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Please log in to chat directly with our master waterproofing & chemical specialist, Rajeshwar Shukla. Your chat history and recommendations will be saved.
                      </p>
                    </div>
                    <div className="w-full max-w-xs space-y-2 pt-2">
                      <button
                        type="button"
                        id="chat-auth-gate-login-btn"
                        onClick={() => setIsAuthOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log In or Create Account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('whatsapp')}
                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Use WhatsApp Instead</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Scroll View */}
                    <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                      {currentConv && currentConv.messages.length > 0 ? (
                        <>
                          {currentConv.messages.map(msg => {
                            const isUserMsg = msg.sender === 'user';
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isUserMsg ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                    isUserMsg
                                      ? 'bg-emerald-600 text-white rounded-br-none'
                                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-bold opacity-80">
                                      {msg.senderName}
                                    </span>
                                    {!isUserMsg && (
                                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                                        EXPERT
                                      </span>
                                    )}
                                  </div>
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                                  {msg.timestamp}
                                </span>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        /* Initial Welcome View */
                        <div className="text-center py-2 space-y-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-300 dark:border-emerald-800">
                            <ShieldCheck className="w-5 h-5" />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Live Technical Consultation
                            </h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 px-2">
                              Logged in as <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>. Ask technical questions regarding Dr. Fixit waterproofing, Sika coatings, Nippon paint shades, or request site visits in Lucknow.
                            </p>
                          </div>

                          <div className="text-left space-y-1 pt-1">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 px-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              <span>Common Topics</span>
                            </p>
                            <div className="space-y-1">
                              {[
                                '🏠 I need a roof leakage & waterproofing inspection',
                                '🧪 What Dr. Fixit & Sika products do you stock?',
                                '🎨 Can you help with paint shade selection?',
                                '📞 Where is your store located near Neem Karauli Dham?',
                              ].map((chip, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleQuickPrompt(chip)}
                                  className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium transition-all"
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Chips in Chat */}
                    {currentConv && (
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 overflow-x-auto flex items-center gap-1 scrollbar-none shrink-0">
                        {[
                          'Roof Leakage Survey',
                          'Dr. Fixit 101 LW+',
                          'Paint Shade Guide',
                          'Store Address',
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPrompt(chip)}
                            className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input Field */}
                    <form
                      onSubmit={handleSend}
                      className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
                    >
                      <input
                        id="support-chat-input"
                        type="text"
                        placeholder="Type technical query here..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        id="support-chat-send-btn"
                        type="submit"
                        disabled={!inputText.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shrink-0 shadow-xs"
                        aria-label="Send message"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <div className="relative flex items-center">
        {/* Unexpanded Mini-Badge Pill for Desktop */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden md:flex items-center gap-1.5 mr-2.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-md border cursor-pointer backdrop-blur-md transition-all hover:scale-102 ${
              availability.isOnline
                ? 'bg-slate-900/90 text-slate-100 border-slate-700 hover:border-slate-600'
                : 'bg-slate-900/90 text-slate-300 border-slate-700/60'
            }`}
            onClick={() => setIsOpen(true)}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                availability.isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="font-bold text-white">
              {availability.isOnline ? 'Technical Support Online' : 'Support Team Away'}
            </span>
            <span className="text-[10px] text-slate-400 opacity-80">
              • {availability.isOnline ? 'Chat / WhatsApp' : 'Leave Message'}
            </span>
          </motion.div>
        )}

        <motion.button
          id="floating-support-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', damping: 15, stiffness: 350 }}
          className={`relative text-white p-3.5 sm:p-4 rounded-full shadow-xl flex items-center justify-center border transition-all ${
            availability.isOnline
              ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-600'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
          }`}
          aria-label="Open Technical Support & WhatsApp"
          title={`Support & WhatsApp: ${availability.isOnline ? 'Online (8:30 AM - 8:30 PM)' : 'Away'}`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-6 h-6 fill-current text-white" />
            </div>
          )}

          {/* Live Status Pill badge on the Floating Button */}
          {!isOpen && (
            <span
              className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                availability.isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          )}

          {/* Unread Chat Badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
};
