import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { LegalModal, LegalDocType } from './LegalModal';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, setIsQuoteOpen } = useApp();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('privacy');

  const openLegalDoc = (doc: LegalDocType) => {
    setLegalDocType(doc);
    setLegalModalOpen(true);
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-8 pb-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800/80 text-xs">
          {/* Column 1: Brand Summary */}
          <div className="space-y-2.5">
            <Logo variant="horizontal" />
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
              Specialist applicator and dealer for Dr. Fixit, Sika, Nippon & Birla Opus in Lucknow. Expert waterproofing, PU paints & epoxy flooring since 2012.
            </p>
          </div>

          {/* Column 2: Key Services & Quote */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-l-2 border-emerald-400 pl-2">
              Key Waterproofing Services
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-slate-400">
              <button onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-emerald-400 transition-colors flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Roof Waterproofing</span>
              </button>
              <button onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-emerald-400 transition-colors flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">PU & Decorative Paint</span>
              </button>
              <button onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-emerald-400 transition-colors flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Epoxy Flooring</span>
              </button>
              <button onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-emerald-400 transition-colors flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Crack & Joint Filling</span>
              </button>
            </div>
            <button
              id="footer-quote-btn"
              onClick={() => setIsQuoteOpen(true)}
              className="mt-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Schedule Inspection / Technical Quote</span>
            </button>
          </div>

          {/* Column 3: Store Contact & Address */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-l-2 border-emerald-400 pl-2">
              Store & Contact
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:+91${(settings.primaryPhone || '9454666748').replace(/[^0-9]/g, '')}`} className="hover:text-emerald-400 font-semibold transition-colors">
                    +91 {settings.primaryPhone}
                  </a>
                  {settings.secondaryPhone && (
                    <>
                      <span className="text-slate-600">/</span>
                      <a href={`tel:+91${settings.secondaryPhone.replace(/[^0-9]/g, '')}`} className="hover:text-emerald-400 font-semibold transition-colors">
                        +91 {settings.secondaryPhone}
                      </a>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-emerald-400 transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar with TSDC Link */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Maa Vaibhav Lakshmi Enterprises. All rights reserved.</p>

          <div className="flex items-center gap-1.5">
            <span>Made by</span>
            <a
              id="footer-tsdc-link"
              href="https://tsdc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              <span>TSDC</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              id="footer-privacy-policy-btn"
              onClick={() => openLegalDoc('privacy')}
              className="hover:text-emerald-400 font-medium cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              id="footer-terms-conditions-btn"
              onClick={() => openLegalDoc('terms')}
              className="hover:text-emerald-400 font-medium cursor-pointer transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Terms Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalDocType}
      />
    </footer>
  );
};
