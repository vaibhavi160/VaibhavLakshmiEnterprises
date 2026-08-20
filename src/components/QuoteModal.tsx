import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wrench, Send, CheckCircle2, Upload, FileText, Image as ImageIcon, Lock, LogIn, UserCheck } from 'lucide-react';

export const QuoteModal: React.FC = () => {
  const {
    isQuoteOpen,
    setIsQuoteOpen,
    quotePreSelectedService,
    setQuotePreSelectedService,
    submitQuery,
    user,
    setIsAuthOpen,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState<
    'Waterproofing' | 'Painting' | 'Construction & Structural Maintenance' | 'Epoxy & PU Flooring' | 'Other'
  >('Waterproofing');
  const [location, setLocation] = useState('Lucknow');
  const [requirement, setRequirement] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.phone) setPhone(user.phone);
    }
    if (quotePreSelectedService) {
      if (quotePreSelectedService.toLowerCase().includes('waterproof')) setServiceType('Waterproofing');
      else if (quotePreSelectedService.toLowerCase().includes('paint')) setServiceType('Painting');
      else if (quotePreSelectedService.toLowerCase().includes('epoxy') || quotePreSelectedService.toLowerCase().includes('floor')) setServiceType('Epoxy & PU Flooring');
      else setServiceType('Construction & Structural Maintenance');
    }
  }, [user, quotePreSelectedService, isQuoteOpen]);

  if (!isQuoteOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
        showToast('Site image attached!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in or create an account to request a quote.', 'error');
      setIsAuthOpen(true);
      return;
    }

    if (!name.trim() || !phone.trim() || !requirement.trim()) {
      showToast('Please fill in Name, Phone, and Requirement description.', 'error');
      return;
    }

    submitQuery({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || user.email || 'customer@lucknow.in',
      serviceType,
      location: location || 'Lucknow',
      requirement,
      attachmentUrl: attachmentUrl || undefined,
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsQuoteOpen(false);
    setQuotePreSelectedService(null);
    setIsSubmitted(false);
    setRequirement('');
    setAttachmentUrl('');
  };

  return (
    <div id="quote-modal-overlay" className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-3 sm:p-4">
      <div id="quote-modal-card" className="glass-modal-card rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl relative text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Sticky Header */}
        <div className="px-5 py-4 glass-header-bar flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">Get a Technical Quote</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Schedule on-site survey by Rajeshwar Shukla & Team</p>
            </div>
          </div>

          <button
            id="quote-modal-close-btn"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          /* Authentication Gate */
          <div id="quote-auth-gate" className="p-8 text-center space-y-5 my-auto">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Sign In Required for Technical Quotes</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                To connect your site inspection request with verified customer records and receive direct quotation updates from our master applicators, please log in or create an account.
              </p>
            </div>
            <div className="space-y-2 pt-3 max-w-xs mx-auto">
              <button
                type="button"
                id="quote-login-btn"
                onClick={() => {
                  setIsAuthOpen(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In or Create Account</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* User Logged In Bar */}
            <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-900 dark:text-white">Requesting as <span className="font-bold">{user.name}</span></span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</span>
            </div>

            {/* Scrollable Form Fields */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                <input
                  id="quote-input-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    id="quote-input-phone"
                    type="tel"
                    required
                    placeholder="e.g. 9839123456"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    id="quote-input-email"
                    type="email"
                    placeholder="e.g. email@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Required *</label>
                  <select
                    id="quote-select-service"
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Waterproofing">Waterproofing Solutions</option>
                    <option value="Painting">Decorative & Exterior Painting</option>
                    <option value="Epoxy & PU Flooring">Epoxy & PU Flooring Coating</option>
                    <option value="Construction & Structural Maintenance">Construction & Grouting</option>
                    <option value="Other">Other Custom Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Area *</label>
                  <input
                    id="quote-input-location"
                    type="text"
                    required
                    placeholder="e.g. Gomti Nagar, Lucknow"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Describe Requirement / Problem *</label>
                <textarea
                  id="quote-textarea-requirement"
                  rows={2}
                  required
                  placeholder="e.g. Roof leakage during monsoon in 2000 sq.ft terrace slab, wall dampness in bedroom..."
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attach Site Photo / Blueprint (Optional)</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-2.5">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <input
                    id="quote-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-100 dark:file:bg-emerald-950 file:text-emerald-800 dark:file:text-emerald-300 hover:file:bg-emerald-200 cursor-pointer"
                  />
                </div>
                {attachmentUrl && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image attached successfully!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <button
                id="quote-submit-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Service Request</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-6 space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Enquiry Received!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-slate-900 dark:text-white">{name}</span>. Your enquiry for <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{serviceType}</span> has been logged.
                Our technical team (Rajeshwar Shukla) will contact you at <span className="font-bold text-slate-900 dark:text-white">{phone}</span> shortly.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold py-2 px-5 rounded-xl transition-colors"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
