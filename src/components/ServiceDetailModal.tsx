import React, { useState, useEffect, useRef } from 'react';
import { ServiceItem, SiteMediaItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Video,
  Play,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  MapPin,
  Film,
  Layers,
  Plus,
  Info,
  Check,
} from 'lucide-react';

interface ServiceDetailModalProps {
  serviceId: string | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  serviceId,
  onClose,
}) => {
  const {
    services,
    setIsQuoteOpen,
    setQuotePreSelectedService,
    settings,
    user,
    uploadServicePhotos,
    uploadServiceVideos,
    uploadServiceSiteMedia,
    deleteServiceMedia,
    updateService,
    showToast,
  } = useApp();

  const isAdmin = user?.role === 'admin';
  const service = services.find(s => s.id === serviceId);

  const [activeMediaIdx, setActiveMediaIdx] = useState<number>(0);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Upload Form State
  const [mediaUploadType, setMediaUploadType] = useState<'image' | 'video'>('video');
  const [customMediaUrl, setCustomMediaUrl] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('Lucknow Site');
  const [customStage, setCustomStage] = useState<'Before Work' | 'In Progress' | 'Completed' | 'Water Test' | 'Inspection'>('In Progress');
  const [customDescription, setCustomDescription] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Derive consolidated list of media items
  const mediaList: SiteMediaItem[] = React.useMemo(() => {
    if (!service) return [];

    const list: SiteMediaItem[] = [];

    // If service has structured siteMedia array
    if (service.siteMedia && service.siteMedia.length > 0) {
      list.push(...service.siteMedia);
    }

    // Also include videos if not already in siteMedia
    if (service.videos && service.videos.length > 0) {
      service.videos.forEach((vidUrl, idx) => {
        if (!list.some(m => m.url === vidUrl)) {
          list.push({
            id: `vid-${idx}-${vidUrl.slice(-10)}`,
            type: 'video',
            url: vidUrl,
            title: `Construction Site Video Walkthrough ${idx + 1}`,
            siteLocation: 'Lucknow Site Execution',
            stage: 'In Progress',
          });
        }
      });
    }

    // Also include images if not already in siteMedia
    const rawImages = service.images && service.images.length > 0 ? service.images : (service.image ? [service.image] : []);
    rawImages.forEach((imgUrl, idx) => {
      if (!list.some(m => m.url === imgUrl)) {
        list.push({
          id: `img-${idx}-${imgUrl.slice(-10)}`,
          type: 'image',
          url: imgUrl,
          title: `Project Site Photo ${idx + 1}`,
          siteLocation: 'Lucknow Site',
          stage: idx === 0 ? 'Completed' : 'In Progress',
        });
      }
    });

    if (list.length === 0) {
      list.push({
        id: 'default-img',
        type: 'image',
        url: service.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        title: service.title,
        siteLocation: 'Lucknow Region',
        stage: 'Completed',
      });
    }

    return list;
  }, [service]);

  // Filtered Media List
  const filteredMedia = React.useMemo(() => {
    if (filterType === 'video') return mediaList.filter(m => m.type === 'video');
    if (filterType === 'image') return mediaList.filter(m => m.type === 'image');
    return mediaList;
  }, [mediaList, filterType]);

  useEffect(() => {
    setActiveMediaIdx(0);
    setIsUploading(false);
    setFilterType('all');
  }, [serviceId]);

  if (!serviceId || !service) return null;

  const currentMedia: SiteMediaItem | undefined = filteredMedia[activeMediaIdx] || filteredMedia[0] || mediaList[0];

  const totalVideos = mediaList.filter(m => m.type === 'video').length;
  const totalPhotos = mediaList.filter(m => m.type === 'image').length;

  const handleRequestQuote = () => {
    setQuotePreSelectedService(service.title);
    setIsQuoteOpen(true);
    onClose();
  };

  const handleWhatsAppConsult = () => {
    const msg = `Hello Maa Vaibhav Lakshmi Enterprises, I would like to consult regarding your "${service.title}" (${service.category}) service in Lucknow. I checked your construction site videos and photos. Please provide an estimated timeline and site survey schedule.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const isVideoUrl = (url: string, type?: string) => {
    if (type === 'video') return true;
    const lower = url.toLowerCase();
    return (
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.mov') ||
      lower.endsWith('.ogg') ||
      lower.startsWith('data:video/') ||
      lower.includes('youtube.com') ||
      lower.includes('youtu.be') ||
      lower.includes('vimeo.com')
    );
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (url.includes('youtube.com/watch')) {
      const vidId = new URL(url).searchParams.get('v');
      return vidId ? `https://www.youtube.com/embed/${vidId}?autoplay=1` : null;
    }
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      const vidId = parts[1]?.split('?')[0];
      return vidId ? `https://www.youtube.com/embed/${vidId}?autoplay=1` : null;
    }
    return null;
  };

  // Handle files selected via input or drop
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));

    if (validFiles.length === 0) {
      showToast('Please select valid image (PNG, JPG, WebP) or video (MP4, WebM, MOV) files.', 'error');
      return;
    }

    const newMediaItems: SiteMediaItem[] = [];
    let count = 0;

    validFiles.forEach((file, index) => {
      const isVid = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = e => {
        const resultUrl = e.target?.result as string;
        if (resultUrl) {
          newMediaItems.push({
            id: `upload-${Date.now()}-${index}`,
            type: isVid ? 'video' : 'image',
            url: resultUrl,
            title: isVid ? `Site Execution Video (${file.name})` : `Construction Site Photo (${file.name})`,
            siteLocation: customLocation || 'Lucknow Site',
            stage: customStage,
            description: customDescription || `Uploaded construction site media: ${file.name}`,
            createdAt: new Date().toISOString().split('T')[0],
          });
        }

        count++;
        if (count === validFiles.length) {
          uploadServiceSiteMedia(service.id, newMediaItems);
          setActiveMediaIdx(0);
          showToast(`Successfully uploaded ${newMediaItems.length} site media file(s)!`, 'success');
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMediaUrl.trim()) return;

    const newItem: SiteMediaItem = {
      id: `url-media-${Date.now()}`,
      type: mediaUploadType,
      url: customMediaUrl.trim(),
      title: customTitle.trim() || (mediaUploadType === 'video' ? 'Construction Site Video Walkthrough' : 'Construction Site Photo'),
      siteLocation: customLocation.trim() || 'Lucknow Site Execution',
      stage: customStage,
      description: customDescription.trim() || `Site documentation for ${service.title}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    uploadServiceSiteMedia(service.id, [newItem]);
    setCustomMediaUrl('');
    setCustomTitle('');
    setCustomDescription('');
    setActiveMediaIdx(0);
  };

  const handleDeleteMedia = (mediaItem: SiteMediaItem) => {
    if (mediaList.length <= 1) {
      showToast('Service must retain at least 1 media item.', 'error');
      return;
    }
    deleteServiceMedia(service.id, mediaItem.type, mediaItem.id || mediaItem.url);
    setActiveMediaIdx(0);
  };

  const handleMakeCover = (mediaItem: SiteMediaItem) => {
    if (mediaItem.type === 'image') {
      updateService(service.id, {
        image: mediaItem.url,
      });
      showToast('Set as main cover image for service card!', 'success');
    } else {
      showToast('Only images can be set as the main thumbnail cover.', 'info');
    }
  };

  return (
    <div
      id="service-detail-modal-overlay"
      className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="service-detail-modal-card"
        className="glass-modal-card rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col justify-between"
      >
        {/* Sticky Top Header */}
        <div className="sticky top-0 z-20 glass-header-bar px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
              {service.category}
            </span>

            {/* Media Count Badges */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{totalPhotos} {totalPhotos === 1 ? 'Photo' : 'Photos'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md text-[11px] font-bold">
                <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{totalVideos} {totalVideos === 1 ? 'Site Video' : 'Site Videos'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                id="admin-service-upload-toggle-btn"
                onClick={() => setIsUploading(!isUploading)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  isUploading
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isUploading ? 'Close Media Uploader' : 'Upload Images & Videos (Admin)'}</span>
              </button>
            )}

            <button
              id="service-modal-close-btn"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* MEDIA FILTER TABS */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => { setFilterType('all'); setActiveMediaIdx(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Media ({mediaList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setFilterType('video'); setActiveMediaIdx(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  filterType === 'video'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-emerald-500" />
                <span>Site Videos ({totalVideos})</span>
              </button>

              <button
                type="button"
                onClick={() => { setFilterType('image'); setActiveMediaIdx(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  filterType === 'image'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Photos ({totalPhotos})</span>
              </button>
            </div>

            {isAdmin && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                Admin Mode: Upload & Manage Real Site Videos
              </span>
            )}
          </div>

          {/* MAIN PLAYER & GALLERY VIEWER */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 group shadow-xl">
              {currentMedia && isVideoUrl(currentMedia.url, currentMedia.type) ? (
                /* VIDEO PLAYER */
                getYouTubeEmbedUrl(currentMedia.url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(currentMedia.url)!}
                    title={currentMedia.title || 'Site Execution Video'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={currentMedia.url}
                    src={currentMedia.url}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  >
                    Your browser does not support HTML5 video playback.
                  </video>
                )
              ) : (
                /* PHOTO VIEWER */
                <img
                  src={currentMedia?.url || service.image}
                  alt={currentMedia?.title || service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Prev / Next Navigation Arrows */}
              {filteredMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIdx(prev => (prev > 0 ? prev - 1 : filteredMedia.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-lg z-10"
                    title="Previous Media"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIdx(prev => (prev < filteredMedia.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-lg z-10"
                    title="Next Media"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Media Type & Stage Pill */}
              {currentMedia && (
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <div className="bg-black/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 border border-white/10 shadow-md">
                    {currentMedia.type === 'video' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-extrabold uppercase">Live Site Video</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-extrabold uppercase">Site Photo</span>
                      </>
                    )}
                    <span>• {activeMediaIdx + 1} of {filteredMedia.length}</span>
                  </div>
                </div>
              )}

              {/* Media Title & Location Caption Overlay */}
              {currentMedia && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-10 text-white z-10 pointer-events-none">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white drop-shadow-md">
                        {currentMedia.title || `${service.title} - Site Documentation`}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                        {currentMedia.siteLocation && (
                          <span className="flex items-center gap-1 text-emerald-300 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{currentMedia.siteLocation}</span>
                          </span>
                        )}
                        {currentMedia.description && (
                          <span className="text-slate-300 line-clamp-1">{currentMedia.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Action Overlay Buttons */}
              {isAdmin && currentMedia && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  {currentMedia.type === 'image' && (
                    <button
                      onClick={() => handleMakeCover(currentMedia)}
                      className="bg-black/70 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 transition-colors shadow-md"
                      title="Set this image as service main banner cover"
                    >
                      Make Cover
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMedia(currentMedia)}
                    className="bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-md flex items-center gap-1 transition-colors"
                    title="Delete this media item from portfolio"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* THUMBNAILS CAROUSEL STRIP */}
            {filteredMedia.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
                {filteredMedia.map((mediaItem, idx) => {
                  const isCurrent = activeMediaIdx === idx;
                  const isVid = mediaItem.type === 'video' || isVideoUrl(mediaItem.url, mediaItem.type);

                  return (
                    <button
                      key={mediaItem.id || idx}
                      type="button"
                      onClick={() => setActiveMediaIdx(idx)}
                      className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all group/thumb ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                      title={mediaItem.title || `Media ${idx + 1}`}
                    >
                      {isVid ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                          <img
                            src={mediaItem.thumbnailUrl || service.image}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-70"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-md">
                              <Play className="w-3 h-3 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-emerald-400 text-[8px] font-black px-1 rounded">
                            VIDEO
                          </span>
                        </div>
                      ) : (
                        <img
                          src={mediaItem.url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ADMIN MULTI-MEDIA UPLOADER (DRAG & DROP + LOCAL FILES + DIRECT URL + PRESETS) */}
          {isAdmin && isUploading && (
            <div
              id="admin-service-upload-box"
              className="bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-dashed border-emerald-500/60 rounded-3xl p-4 sm:p-6 space-y-5 shadow-inner"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
                      Upload Construction Site Videos & Photos
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Showcase actual on-site waterproofing, grouting, and chemical application execution in Lucknow
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaUploadType('video')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      mediaUploadType === 'video'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>Video Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaUploadType('image')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      mediaUploadType === 'image'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo Mode</span>
                  </button>
                </div>
              </div>

              {/* DRAG AND DROP ZONE */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById('service-modal-file-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/60 scale-[1.01]'
                    : 'border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:border-emerald-500'
                }`}
              >
                <input
                  type="file"
                  id="service-modal-file-input"
                  accept="image/*,video/*"
                  multiple
                  onChange={e => handleFilesSelected(e.target.files)}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  {mediaUploadType === 'video' ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Drag & Drop construction site {mediaUploadType === 'video' ? 'videos (MP4, WebM, MOV)' : 'photos (PNG, JPG, WebP)'} here
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    or <span className="text-emerald-600 dark:text-emerald-400 font-extrabold underline">browse from your phone or computer (Multiple Files Supported)</span>
                  </p>
                </div>
              </div>

              {/* DIRECT URL & SITE METADATA FORM */}
              <form onSubmit={handleAddCustomUrl} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attach by URL & Site Metadata</span>
                  </h5>
                  <span className="text-[10px] text-slate-400">Supports Direct Video Links, YouTube, Google Drive & CDN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      {mediaUploadType === 'video' ? 'Video URL (MP4 / YouTube / Drive)' : 'Direct Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      placeholder={mediaUploadType === 'video' ? 'https://.../site_video.mp4 or https://youtube.com/watch?v=...' : 'https://images.unsplash.com/...'}
                      value={customMediaUrl}
                      onChange={e => setCustomMediaUrl(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Execution Stage</label>
                    <select
                      value={customStage}
                      onChange={e => setCustomStage(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Before Work">Before Work (Surface Damage / Cracks)</option>
                      <option value="In Progress">In Progress (Chemical Application)</option>
                      <option value="Water Test">Water Test (48-hr Ponding Verification)</option>
                      <option value="Completed">Completed (Final Delivery)</option>
                      <option value="Inspection">Inspection (Thermal / Moisture Scan)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Video / Photo Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 2-Coat Fastflex Membrane Live Walkthrough"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Site Location in Lucknow</label>
                    <input
                      type="text"
                      placeholder="e.g. Gomti Nagar Phase 2 Site, Lucknow"
                      value={customLocation}
                      onChange={e => setCustomLocation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!customMediaUrl.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {mediaUploadType === 'video' ? 'Video' : 'Photo'} to Service Portfolio</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SERVICE DETAILS META */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {service.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {service.description}
                </p>
              </div>

              {/* Service Highlights / Features */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Technical Process & Scope Highlights</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary Card & CTAs */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-800 pb-2">
                  Service Specifications
                </h3>

                {service.startingPrice && (
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Standard Costing</span>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{service.startingPrice}</p>
                  </div>
                )}

                {service.duration && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Project Turnaround</span>
                      <span className="font-bold">{service.duration}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <p>• On-site survey by Rajeshwar Shukla</p>
                  <p>• Premium chemicals (Dr. Fixit, Sika, Asian Paints)</p>
                  <p>• Verified site video walkthroughs included</p>
                  <p>• Lucknow-wide on-site applicator team</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  id="service-modal-quote-btn"
                  onClick={handleRequestQuote}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request Free Site Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="service-modal-whatsapp-btn"
                  onClick={handleWhatsAppConsult}
                  className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Instant WhatsApp Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
