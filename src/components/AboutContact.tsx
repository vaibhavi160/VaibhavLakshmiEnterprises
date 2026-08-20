import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MessageSquare,
  Wrench,
  ExternalLink,
  Hammer,
  HardHat,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

export const AboutContact: React.FC = () => {
  const { settings, setIsQuoteOpen } = useApp();
  const primaryContactNumber = '+91 9454666748';
  const rawPrimaryPhone = (settings.primaryPhone || '9454666748').replace(/[^0-9]/g, '');
  const rawSecondaryPhone = (settings.secondaryPhone || '7080805601').replace(/[^0-9]/g, '');

  return (
    <div id="about-contact-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* About Section */}
      <section id="about-firm-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Maa Vaibhav Lakshmi Enterprises <br />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-2xl sm:text-3xl">Chinhat, Lucknow</span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Maa Vaibhav Lakshmi Enterprises is a premier construction chemicals dealer and specialized applicator firm located near Neem Karoli Dham, Faizabad Road, Chinhat, Lucknow. We bridge the gap between world-class chemical formulations and precision on-site civil and waterproofing execution.
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Head technical expert <span className="font-bold text-slate-900 dark:text-white">Rajeshwar Shukla</span> brings over 15 years of field experience in structural repairs, terrace waterproofing, epoxy flooring, injection grouting, and high-durability protective painting across residential, commercial, and industrial sites in Uttar Pradesh.
          </p>

          {/* Quick Contact Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Direct Helpline & Technical Inquiries</p>
                <a
                  href={`tel:+91${rawPrimaryPhone}`}
                  className="text-base sm:text-lg font-black text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors tracking-tight"
                >
                  {primaryContactNumber}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:+91${rawPrimaryPhone}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/91${rawPrimaryPhone}?text=${encodeURIComponent('Hello Maa Vaibhav Lakshmi Enterprises, I would like to inquire about your construction and waterproofing services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">100% Genuine Materials</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Dr. Fixit, Sika & Nippon</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">On-Site Warranty</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Guaranteed Workmanship</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Showcase Frame */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Official Brand Identity</span>
            <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 text-[10px] font-bold px-2.5 py-1 rounded-md">
              SINCE 2012
            </span>
          </div>

          {/* Official Full Logo Embed */}
          <div className="p-4 bg-amber-50/50 dark:bg-slate-950/80 rounded-2xl border border-amber-200/60 dark:border-slate-800 flex justify-center py-6 shadow-inner">
            <Logo variant="full" />
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-2 pt-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">Specialized Technical Application & Dealership:</p>
              <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Waterproofing Coating</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Decorative & PU Paint</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Tiles Adhesive Chemical</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Expansion Joint Treatment</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Injection Grouting</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span> Epoxy & PU Flooring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION: Neem Karoli Dham Constructions */}
      <section id="neem-karoli-constructions-section" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-200 dark:border-emerald-800 rounded-full px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
                <HardHat className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Civil & Structural Division</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Neem Karoli Dham Constructions
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-semibold">
                Engineering Integrity, Durable Structures & Certified Construction Execution in Lucknow
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:+91${rawPrimaryPhone}`}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 sm:px-5 rounded-xl text-xs shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+91 9454666748</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              <p>
                <strong className="text-slate-900 dark:text-white font-bold">Neem Karoli Dham Constructions</strong> represents our dedicated civil works, structural rehabilitation, and specialized application division operating in tandem with <em>Maa Vaibhav Lakshmi Enterprises</em>. Situated right near the sacred Neem Karoli Dham landmark on Faizabad Road in Chinhat, Lucknow, our construction division delivers end-to-end building solutions built upon strong ethics, master craftsmanship, and chemical-grade waterproofing precision.
              </p>
              <p>
                Under the technical leadership of <strong className="text-slate-900 dark:text-white font-bold">Rajeshwar Shukla</strong>, our construction teams have executed hundreds of structural rehabilitation projects, residential builds, heritage temple renovations, commercial damp-proofing contracts, and advanced concrete protection systems across Lucknow, Barabanki, Ayodhya, and surrounding UP districts since 2012.
              </p>
              <p>
                Unlike conventional contractors who rely on superficial patches, Neem Karoli Dham Constructions integrates advanced chemical diagnostics — using ultrasonic non-destructive testing, infrared moisture profiling, and lab-certified admixtures from Dr. Fixit, Sika, and Pidilite to ensure long-term structural longevity backed by multi-year written warranties.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Structural Concrete Repair</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Micro-concrete encasement, polymer-modified mortar repairs, and rebar rust-passivation.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">PU Injection Grouting</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  High-pressure expanding polyurethane grouting for live water leakages, slabs, and basements.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Hammer className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Renovation & Waterproofing</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Terrace heat-reflective waterproofing, bathroom seepage cures without breaking tiles, and tank lining.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Decorative & PU Finishes</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Architectural paints by Nippon & Birla Opus with anti-fungal exterior elastomeric coats.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Free On-Site Diagnostic Survey across Lucknow • Call <strong className="text-slate-900 dark:text-white font-bold">+91 9454666748</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-xs transition-colors"
              >
                Book Site Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details & Map Section */}
      <section id="contact-info-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Store Location & Contact Details</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Visit Our Store or Schedule a Site Inspection
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Main Office Address</h4>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{settings.address}</p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Near Neem Karoli Dham, Chinhat, Lucknow - 226028</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Direct Phone Numbers</h4>
            <div className="space-y-1.5">
              <a
                href={`tel:+91${rawPrimaryPhone}`}
                className="block font-black text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
              >
                +91 {settings.primaryPhone || '9454666748'}
              </a>
              <a
                href={`tel:+91${rawSecondaryPhone}`}
                className="block font-black text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
              >
                +91 {settings.secondaryPhone || '7080805601'}
              </a>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Technical Inquiries: Rajeshwar Shukla</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email & Working Hours</h4>
            <div className="space-y-1">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">{settings.email}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">Open All Days: 8:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        {/* Map & Call-to-Action Card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <MapPin className="w-5 h-5" />
            <span>Lucknow Region Service Area</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            We provide on-site waterproofing, painting, and Neem Karoli Dham construction service execution across Chinhat, Gomti Nagar, Indira Nagar, Mahanagar, Aliganj, Hazratganj, and all nearby districts in Lucknow, UP.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-md transition-colors"
            >
              Request On-Site Inspection Quote
            </button>
            <a
              href={`tel:+91${rawPrimaryPhone}`}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call +91 9454666748</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;
