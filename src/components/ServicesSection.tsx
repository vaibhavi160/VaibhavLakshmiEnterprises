import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Paintbrush,
  ShieldCheck,
  Wrench,
  Grid,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Building,
  Images,
  Camera,
  Video,
  Play,
  Film,
  Clock,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, setIsQuoteOpen, setQuotePreSelectedService, settings, setSelectedServiceId, user } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<string>('All');
  const [hoveredImageMap, setHoveredImageMap] = useState<Record<string, string>>({});

  // Filter only active services
  const activeServices = services.filter(s => s && s.active !== false && s.id);

  // Extract unique category tabs
  const categoryTabs: string[] = ['All', ...Array.from(new Set<string>(activeServices.filter(s => s.category).map(s => s.category)))];

  const filteredServices = activeTabFilter === 'All'
    ? activeServices
    : activeServices.filter(s => s.category === activeTabFilter);

  const handleRequestQuote = (serviceTitle: string) => {
    setQuotePreSelectedService(serviceTitle);
    setIsQuoteOpen(true);
  };

  const handleWhatsAppService = (serviceTitle: string) => {
    const msg = `Hello Maa Vaibhav Lakshmi Enterprises, I am interested in your ${serviceTitle} service. I checked your construction site videos. I would like to schedule an on-site technical inspection in Lucknow.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="services-section-wrapper" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest mb-3">
          <Wrench className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Maa Vaibhav Lakshmi Certified Execution</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Specialized Application Services
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Backed by 15+ years of specialized application expertise under Rajeshwar Shukla (Technical Expert). Watch live construction site videos and inspect surface preparation before booking your service.
        </p>

        {/* Service Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categoryTabs.map(tab => (
            <button
              key={tab}
              id={`service-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveTabFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabFilter === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(srv => {
          const serviceImagesList = srv.images && srv.images.length > 0 ? srv.images : (srv.image ? [srv.image] : ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80']);
          const videoCount = (srv.videos ? srv.videos.length : 0) + (srv.siteMedia ? srv.siteMedia.filter(m => m.type === 'video').length : 0);
          const hasVideos = videoCount > 0;
          const activeDisplayImage = hoveredImageMap[srv.id] || serviceImagesList[0];

          return (
            <div
              key={srv.id}
              id={`service-card-${srv.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between group transition-all duration-300 interactive-card"
            >
              <div>
                {/* Image Banner with Click to Open Gallery */}
                <div
                  className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer group/img"
                  onClick={() => setSelectedServiceId(srv.id)}
                  title="Click to view site videos, photo gallery and details"
                >
                  <img
                    src={activeDisplayImage}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  <span className="absolute top-3 left-3 bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-md">
                    {srv.category}
                  </span>

                  {/* Media count indicators (Photos + Videos) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {hasVideos && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 animate-pulse">
                        <Video className="w-3 h-3" />
                        <span>{videoCount} {videoCount === 1 ? 'Site Video' : 'Videos'}</span>
                      </span>
                    )}
                    <span className="bg-slate-950/80 text-white border border-slate-700/60 text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                      <Images className="w-3 h-3 text-emerald-400" />
                      <span>{serviceImagesList.length}</span>
                    </span>
                  </div>

                  {srv.startingPrice && (
                    <span className="absolute bottom-3 right-3 bg-slate-900/85 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-md">
                      From {srv.startingPrice}
                    </span>
                  )}

                  {/* Hover hint with Video Play cue */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-xs">
                    <span className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                      {hasVideos ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>Watch Site Video & Gallery</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>View Gallery & Photos</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Multiple Images Thumbnail Strip */}
                {serviceImagesList.length > 1 && (
                  <div className="px-5 pt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {serviceImagesList.map((imgUrl, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHoveredImageMap(prev => ({ ...prev, [srv.id]: imgUrl }));
                        }}
                        onMouseEnter={() => setHoveredImageMap(prev => ({ ...prev, [srv.id]: imgUrl }))}
                        className={`relative w-12 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeDisplayImage === imgUrl
                            ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                            : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        title={`View photo ${imgIdx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${srv.title} preview ${imgIdx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedServiceId(srv.id)}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 whitespace-nowrap pl-1"
                    >
                      + View All
                    </button>
                  </div>
                )}

                {/* Service Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setSelectedServiceId(srv.id)}
                      className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {srv.title}
                    </h3>
                  </div>

                  {srv.duration && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{srv.duration}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {srv.description}
                  </p>

                  {/* Features list */}
                  {srv.features && srv.features.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      {srv.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id={`quote-btn-${srv.id}`}
                    onClick={() => handleRequestQuote(srv.title)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`wa-service-btn-${srv.id}`}
                    onClick={() => handleWhatsAppService(srv.title)}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* View Photos & Site Videos Button */}
                <button
                  onClick={() => setSelectedServiceId(srv.id)}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {hasVideos ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>View Site Videos & Photos ({serviceImagesList.length + videoCount})</span>
                    </>
                  ) : (
                    <>
                      <Images className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>View Gallery & Photos ({serviceImagesList.length})</span>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <span className="ml-1 text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold">
                      Upload Video/Photo
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

