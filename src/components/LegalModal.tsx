import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, CheckCircle2, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = React.useState<LegalDocType>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="legal-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 glass-backdrop overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="legal-modal-content"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="glass-modal-card rounded-3xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 glass-header-bar flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                {activeTab === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                  {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maa Vaibhav Lakshmi Enterprises • Lucknow
                </p>
              </div>
            </div>

            <button
              id="close-legal-modal-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 px-6 pt-3 gap-2">
            <button
              id="legal-tab-privacy-btn"
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'privacy'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Policy</span>
            </button>
            <button
              id="legal-tab-terms-btn"
              onClick={() => setActiveTab('terms')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'terms'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Terms & Conditions</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeTab === 'privacy' ? (
              <div className="space-y-6" id="privacy-policy-content">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Effective Date: January 1, 2024</span>
                  <p className="text-emerald-700/90 dark:text-emerald-300/80">
                    Maa Vaibhav Lakshmi Enterprises ("we", "our", or "us") operates the store and technical service portal in Lucknow. This policy outlines how we collect, safeguard, and use your information.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    1. Information We Collect
                  </h4>
                  <p>When you contact us, request a quotation, place an order, or schedule a technical site inspection, we may collect:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li><strong>Contact Details:</strong> Full Name, Phone number, WhatsApp contact, Email address.</li>
                    <li><strong>Site & Delivery Information:</strong> Construction site address, landmark, pin code, and architectural dimensions.</li>
                    <li><strong>Technical Documents:</strong> Photos, floor plans, leakage images, or requirement descriptions you submit for diagnosis.</li>
                    <li><strong>Transactional Data:</strong> Product inquiries, invoice details, order items, and billing preferences.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    2. How We Use Your Data
                  </h4>
                  <p>Your data is used strictly to fulfill your construction and maintenance requirements, including:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Providing accurate waterproofing estimations and product consumption calculators.</li>
                    <li>Scheduling technician visits and on-site engineering consultations in Lucknow.</li>
                    <li>Processing chemical orders, dispatching shipments, and confirming delivery status.</li>
                    <li>Responding to live chat inquiries, support calls, and WhatsApp technical queries.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    3. No Third-Party Selling
                  </h4>
                  <p>
                    We value your trust. We do not sell, rent, trade, or broadcast your personal contact details or site photos to third-party marketing agencies. Data is only shared with authorized logistics partners or product manufacturer technical teams (such as Dr. Fixit, Sika, Nippon, Birla Opus) when essential for site warranty certification.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    4. Data Security & Storage
                  </h4>
                  <p>
                    We maintain secure operational standards to protect your confidential information against unauthorized access, loss, or misuse. Customer inquiries and quote attachments are stored securely within our authenticated business database.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    5. Contact Us Regarding Your Privacy
                  </h4>
                  <p>If you have any questions regarding your data or wish to update your records, please reach out to:</p>
                  <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl text-xs space-y-1 border border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">Maa Vaibhav Lakshmi Enterprises</p>
                    <p>Contact Officer: Rajeshwar Shukla</p>
                    <p>Phone: +91 {settings.primaryPhone} / +91 {settings.secondaryPhone}</p>
                    <p>Email: {settings.email}</p>
                    <p>Address: {settings.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6" id="terms-conditions-content">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Last Updated: January 1, 2024</span>
                  <p className="text-emerald-700/90 dark:text-emerald-300/80">
                    Please review these terms and conditions carefully before placing orders or contracting application services through Maa Vaibhav Lakshmi Enterprises.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    1. Scope of Products & Dealership
                  </h4>
                  <p>
                    Maa Vaibhav Lakshmi Enterprises is an authorized distributor and specialized applicator for leading brands including <strong>Dr. Fixit, Sika, Nippon Paint, Birla Opus, Birla White, and AkzoNobel</strong>. All products sold are 100% genuine and sourced directly from certified manufacturer supply chains.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    2. Technical Quotes & Site Estimates
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Online quotes and chemical requirement estimates are indicative figures based on user-provided surface dimensions and substrate conditions.</li>
                    <li>Final material requirement and service pricing are confirmed after comprehensive physical site inspection by our technical specialist.</li>
                    <li>Written formal quotations are valid for 15 calendar days from the date of issuance due to raw material and manufacturer pricing adjustments.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    3. Application Services & Warranty
                  </h4>
                  <p>
                    Specialized services—such as roof waterproofing, injection grouting, expansion joint sealing, and epoxy flooring—are executed according to standard technical protocols and manufacturer guidelines.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Warranty certificates are issued specifically for qualified full-system application projects supervised by our authorized engineers.</li>
                    <li>Warranties do not cover structural settlement cracks, structural modifications performed post-application, physical damage, or third-party interference.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    4. Delivery, Inspection & Returns
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Deliveries in Lucknow and nearby zones in Uttar Pradesh are dispatched promptly upon order confirmation.</li>
                    <li>Customers must inspect packaging seals and bucket integrity at the time of delivery. Any damaged or tampered containers must be reported immediately.</li>
                    <li>Unopened, unmixed chemicals in pristine original condition may be returned or exchanged within 7 days with valid invoice proof. Tinted or custom-tinted paints are non-returnable.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    5. Jurisdiction
                  </h4>
                  <p>
                    All contracts, disputes, and claims arising out of sales or technical services shall be subject exclusively to the jurisdiction of the competent courts in Lucknow, Uttar Pradesh.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Lucknow, Uttar Pradesh</span>
            </div>
            <button
              id="confirm-legal-modal-btn"
              onClick={onClose}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-sm"
            >
              I Understand & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
