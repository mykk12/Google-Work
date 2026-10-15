import { useState } from 'react';
import { Laptop, Tablet, Smartphone, Grid3X3, ZoomIn, ZoomOut, RotateCcw, Link2, Copy, Check, ExternalLink } from 'lucide-react';
import { DeviceType, ScreenId } from '../../types';
import { GALLERY_ITEMS } from '../../data/screensData';
import { ResilientImage } from '../ResilientImage';
import { ReactiveGlassBlock } from '../ReactiveGlassBlock';

interface DeviceStudioScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string) => void;
  customHtml?: string;
}

export function DeviceStudioScreen({ onNavigate, onToast, customHtml }: DeviceStudioScreenProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [activeScreenPreview, setActiveScreenPreview] = useState<'showcase' | 'gallery' | 'case-study' | 'custom'>('showcase');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [tabletOrientation, setTabletOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyHotlink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    onToast('Hotlink URL copied');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Content to render inside device iframe / viewport
  const renderInnerScreenContent = (isMobileView = false) => {
    if (activeScreenPreview === 'custom' && customHtml) {
      return (
        <div
          className="p-6 bg-neutral-950 text-neutral-100 min-h-full"
          dangerouslySetInnerHTML={{ __html: customHtml }}
        />
      );
    }

    if (activeScreenPreview === 'gallery') {
      return (
        <div className="p-6 bg-neutral-950 text-neutral-100 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-[10px] text-neutral-400 font-mono-code uppercase">Curated Archive</span>
            <h2 className="text-xl font-bold font-display text-neutral-100">Visual Registry</h2>
          </div>
          <div className={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            {GALLERY_ITEMS.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                <ResilientImage
                  src={item.hotlinkUrl}
                  alt={item.title}
                  aspectRatioClass="aspect-[4/3]"
                />
                <div className="p-3 text-xs">
                  <div className="font-semibold text-neutral-200">{item.title}</div>
                  <div className="text-[11px] text-neutral-500 font-mono-code">{item.dimensions}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeScreenPreview === 'case-study') {
      return (
        <div className="p-6 bg-neutral-950 text-neutral-100 space-y-6">
          <div>
            <span className="text-[10px] text-neutral-400 font-mono-code uppercase">Avionics Study</span>
            <h2 className="text-2xl font-bold font-display text-neutral-100">KRONOS Spatial Flight Deck</h2>
            <p className="text-xs text-neutral-400 mt-1">Zero-latency urban air mobility telemetry.</p>
          </div>
          <div className="rounded-lg overflow-hidden border border-neutral-800">
            <ResilientImage
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="Flight deck preview"
              aspectRatioClass="aspect-[16/9]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-500 block">Latency</span>
              <span className="font-bold text-neutral-100 font-mono-code">18ms</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-500 block">Operator Speed</span>
              <span className="font-bold text-neutral-100 font-mono-code">+164%</span>
            </div>
          </div>
        </div>
      );
    }

    // Default: Showcase screen mini view
    return (
      <div className="bg-neutral-950 text-neutral-100 min-h-full">
        {/* Mini Navbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80 bg-neutral-950/90 text-xs">
          <span className="font-display font-bold text-neutral-100">Aethel Studio</span>
          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <span>Showcase</span>
            <span>Gallery</span>
            <span>Avionics</span>
          </div>
        </div>

        {/* Mini Hero */}
        <div className="p-6 sm:p-8">
          <div className="max-w-md mb-6">
            <div className="text-[10px] text-neutral-400 uppercase font-mono-code mb-2">Monograph 2026</div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 leading-tight mb-3">
              Spatial precision. Tactile interfaces.
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              High-retention spatial products and architectural monographs with zero UI bloat.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-950 rounded">
                Explore Work
              </span>
            </div>
          </div>

          {/* Marquee Image */}
          <div className="rounded-lg overflow-hidden border border-neutral-800/80 mb-6">
            <ResilientImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Architectural pavilion"
              aspectRatioClass="aspect-[16/9]"
            />
          </div>

          {/* Mini Proof Strip */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-center text-[10px]">
            <div>
              <div className="font-bold text-neutral-100 font-mono-code text-xs">48+</div>
              <div className="text-neutral-500">Awards</div>
            </div>
            <div>
              <div className="font-bold text-neutral-100 font-mono-code text-xs">99.8%</div>
              <div className="text-neutral-500">Retention</div>
            </div>
            <div>
              <div className="font-bold text-neutral-100 font-mono-code text-xs">140+</div>
              <div className="text-neutral-500">Screens</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              <span>Hardware Mockups</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Screen Studio</span>
              <span aria-hidden="true">·</span>
              <span>Responsive Test</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-neutral-100 tracking-tight">
              Screens that look like this
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Inspect your website screens scaled accurately inside realistic MacBook Pro, iPad, and iPhone hardware mockups.
            </p>
          </div>

          {/* Device Selector Controls with Reactive Glass Look */}
          <div className="flex flex-wrap items-center gap-3">
            <ReactiveGlassBlock variant="standard" className="rounded-xl p-1.5" glowColor="rgba(224, 231, 255, 0.4)">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    device === 'desktop'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>MacBook Pro</span>
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    device === 'tablet'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>iPad Pro</span>
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    device === 'mobile'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iPhone 16 Pro</span>
                </button>
                <button
                  onClick={() => setDevice('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    device === 'all'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Studio View</span>
                </button>
              </div>
            </ReactiveGlassBlock>

            {/* Zoom Controls with Reactive Glass Look */}
            <ReactiveGlassBlock variant="standard" className="rounded-xl p-1.5" glowColor="rgba(255, 255, 255, 0.3)">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono-code text-[11px] text-neutral-200 font-medium">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(120, z + 10))}
                  className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </ReactiveGlassBlock>
          </div>
        </div>

        {/* Screen Content Selector Bar with Reactive Surroundings Reflection */}
        <ReactiveGlassBlock variant="ultra" className="mb-8 p-2.5 rounded-xl shadow-xl" glowColor="rgba(190, 215, 255, 0.35)">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-300 font-medium px-2 text-[11px] uppercase tracking-wider font-mono-code">Active Screen:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveScreenPreview('showcase')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    activeScreenPreview === 'showcase'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  Showcase Screen
                </button>
                <button
                  onClick={() => setActiveScreenPreview('gallery')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    activeScreenPreview === 'gallery'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  Visual Gallery
                </button>
                <button
                  onClick={() => setActiveScreenPreview('case-study')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    activeScreenPreview === 'case-study'
                      ? 'frosty-glass-tab-active'
                      : 'frosty-glass-tab'
                  }`}
                >
                  KRONOS Study
                </button>
                {customHtml && (
                  <button
                    onClick={() => setActiveScreenPreview('custom')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      activeScreenPreview === 'custom'
                        ? 'frosty-glass-tab-active'
                        : 'frosty-glass-tab'
                    }`}
                  >
                    Custom HTML Screen
                  </button>
                )}
              </div>
            </div>

          <div className="hidden sm:flex items-center gap-3 text-neutral-500 font-mono-code text-[11px]">
            <span>Viewport: {device === 'desktop' ? '1440 × 900' : device === 'tablet' ? (tabletOrientation === 'landscape' ? '1024 × 768' : '768 × 1024') : device === 'mobile' ? '393 × 852' : 'Synchronized Multi-Screen'}</span>
          </div>
        </div>
      </ReactiveGlassBlock>

        {/* Hardware Mockup Stage with Glassmorphism */}
        <div
          className="relative min-h-[640px] rounded-3xl glass-surface border border-white/20 p-8 sm:p-12 flex items-center justify-center overflow-auto shadow-2xl"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* DESKTOP: MacBook Pro 16" */}
          {(device === 'desktop' || device === 'all') && (
            <div className={`transition-all duration-300 ${device === 'all' ? 'w-full max-w-2xl' : 'w-full max-w-4xl'}`}>
              <div className="text-[11px] font-mono-code text-neutral-400 mb-2.5 flex items-center justify-between">
                <span>MacBook Pro 16" (Space Gray)</span>
                <span>Retina XDR · 120Hz ProMotion</span>
              </div>
              {/* Laptop Shell */}
              <div className="rounded-2xl border-[10px] border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden ring-1 ring-neutral-700/50">
                {/* Display Bezel Top & Camera Notch */}
                <div className="h-7 bg-neutral-900/90 border-b border-neutral-800 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-6 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] font-mono-code text-neutral-400">
                    https://aethel.studio
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" title="FaceTime HD Camera" />
                </div>
                {/* Scrollable Screen Content */}
                <div className="h-[480px] overflow-y-auto bg-neutral-950 text-neutral-100">
                  {renderInnerScreenContent(false)}
                </div>
              </div>
              {/* Laptop Base Stand Hint */}
              <div className="h-3.5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 mx-auto w-[105%] rounded-b-xl shadow-lg -mt-0.5 flex items-center justify-center">
                <div className="w-24 h-1 bg-neutral-600 rounded-full" />
              </div>
            </div>
          )}

          {/* TABLET: iPad Pro 11" */}
          {device === 'tablet' && (
            <div className="w-full max-w-2xl transition-all duration-300">
              <div className="text-[11px] font-mono-code text-neutral-400 mb-2.5 flex items-center justify-between">
                <span>iPad Pro 11" (Liquid Retina)</span>
                <button
                  onClick={() => setTabletOrientation((o) => (o === 'landscape' ? 'portrait' : 'landscape'))}
                  className="hover:text-white underline cursor-pointer"
                >
                  Orientation: {tabletOrientation}
                </button>
              </div>
              <div
                className={`rounded-[32px] border-[14px] border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden ring-1 ring-neutral-700/60 mx-auto ${
                  tabletOrientation === 'landscape' ? 'max-w-2xl' : 'max-w-md'
                }`}
              >
                {/* Tablet Status Bar */}
                <div className="h-6 bg-neutral-950 px-5 flex items-center justify-between text-[10px] font-mono-code text-neutral-500">
                  <span>9:41</span>
                  <div className="w-2 h-2 rounded-full bg-neutral-800" />
                  <span>100%</span>
                </div>
                {/* Scrollable Content */}
                <div className={`${tabletOrientation === 'landscape' ? 'h-[440px]' : 'h-[560px]'} overflow-y-auto bg-neutral-950`}>
                  {renderInnerScreenContent(false)}
                </div>
                {/* Home Indicator Bar */}
                <div className="h-4 bg-neutral-950 flex items-center justify-center">
                  <div className="w-28 h-1 bg-neutral-600 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* MOBILE: iPhone 16 Pro */}
          {(device === 'mobile' || device === 'all') && (
            <div className={`transition-all duration-300 ${device === 'all' ? 'w-full max-w-xs' : 'w-full max-w-sm'}`}>
              <div className="text-[11px] font-mono-code text-neutral-400 mb-2.5 flex items-center justify-between">
                <span>iPhone 16 Pro (Titanium)</span>
                <span>Super Retina XDR</span>
              </div>
              <div className="rounded-[44px] border-[10px] border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden ring-1 ring-neutral-700/60 mx-auto">
                {/* Dynamic Island Header */}
                <div className="h-10 bg-neutral-950 px-6 flex items-center justify-between text-[10px] font-mono-code text-neutral-500">
                  <span className="font-semibold text-neutral-300">9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-24 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-between px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-800" />
                  </div>
                  <span>5G 98%</span>
                </div>
                {/* Scrollable Content */}
                <div className="h-[520px] overflow-y-auto bg-neutral-950 text-neutral-100">
                  {renderInnerScreenContent(true)}
                </div>
                {/* Home Bar */}
                <div className="h-5 bg-neutral-950 flex items-center justify-center">
                  <div className="w-32 h-1 bg-neutral-500 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hotlink Inspector Panel with Glass Surface */}
        <div className="mt-12 rounded-3xl glass-surface p-6 sm:p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-100">
                Active Hotlinks on Active Screen
              </h3>
            </div>
            <span className="text-xs font-mono-code text-neutral-400">
              Verified CDN Endpoints · Zero Broken Image Policy
            </span>
          </div>

          <div className="divide-y divide-white/10 text-xs">
            {GALLERY_ITEMS.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-white/15">
                    <img src={item.hotlinkUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-200">{item.title}</div>
                    <div className="font-mono-code text-[11px] text-neutral-400 truncate max-w-md">
                      {item.hotlinkUrl}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono-code text-[11px] text-neutral-400">{item.dimensions}</span>
                  <button
                    onClick={() => handleCopyHotlink(item.hotlinkUrl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button-secondary text-neutral-200 hover:text-white"
                  >
                    {copiedUrl === item.hotlinkUrl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={item.hotlinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg glass-badge"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
