import { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Copy, Check, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/screensData';
import { GalleryItem } from '../../types';
import { ResilientImage } from '../ResilientImage';
import { ReactiveGlassBlock } from '../ReactiveGlassBlock';

interface GalleryScreenProps {
  onToast: (msg: string) => void;
}

export function GalleryScreen({ onToast }: GalleryScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const categories = ['All', 'Architecture', 'Industrial Design', 'Minimalist Living', 'Editorial Fashion'];

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.exif.camera.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % filteredItems.length;
        setSelectedItem(filteredItems[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setSelectedItem(filteredItems[prevIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, filteredItems]);

  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    onToast('Direct hotlink URL copied');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleCopySnippet = (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const tag = `<img src="${item.hotlinkUrl}" alt="${item.title}" loading="lazy" />`;
    navigator.clipboard.writeText(tag);
    setCopiedSnippet(item.id);
    onToast('HTML <img> snippet copied');
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
            <span>Visual Index</span>
            <span aria-hidden="true">·</span>
            <span>Hotlink Registry</span>
            <span aria-hidden="true">·</span>
            <span>2026 Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-100 tracking-tight mb-3">
            Curated hotlinked imagery
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            High-resolution visual assets hotlinked across our architectural screen systems. Every image is verified for high-density displays, accompanied by full camera EXIF metrics and direct CDN endpoints.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800/80">
          {/* Functional Category Filter Segmented Buttons (Glassy Translucent Only) */}
          <ReactiveGlassBlock
            variant="translucent"
            className="rounded-xl p-1.5 shadow-lg"
            glowColor="rgba(255, 255, 255, 0.16)"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'frosty-glass-tab-active'
                        : 'frosty-glass-tab'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </ReactiveGlassBlock>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera, title, architect..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-md text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Feedback */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6 font-mono-code">
          <span>{filteredItems.length} curated assets matched</span>
          <span>Click any card to inspect full EXIF & hotlink</span>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden">
                    <ResilientImage
                      src={item.hotlinkUrl}
                      alt={item.title}
                      aspectRatioClass={item.aspectRatio === '16:9' ? 'aspect-[16/9]' : item.aspectRatio === '4:3' ? 'aspect-[4/3]' : item.aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[3/4]'}
                      showHotlinkInspect={false}
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleCopyUrl(item.hotlinkUrl, e)}
                        title="Copy direct image URL"
                        className="p-1.5 rounded bg-neutral-950/90 border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
                      >
                        {copiedUrl === item.hotlinkUrl ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.author}</span>
                    </div>

                    <h3 className="text-base font-display font-semibold text-neutral-100 group-hover:text-white transition-colors mb-1.5">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="px-5 py-3 bg-neutral-950/70 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
                  <span>{item.exif.camera}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopySnippet(item, e)}
                      className="text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="Copy <img> HTML tag"
                    >
                      {copiedSnippet === item.id ? (
                        <span className="text-emerald-400">Tag Copied</span>
                      ) : (
                        <span>&lt;img&gt;</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-neutral-600 mb-3" />
            <div className="text-sm font-semibold text-neutral-200 mb-1">No images matched your filter</div>
            <div className="text-xs text-neutral-500 mb-4">Try clearing the search query or selecting a different category.</div>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-neutral-950 bg-neutral-100 rounded-md hover:bg-white"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="font-medium text-neutral-200">{selectedItem.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-code">{selectedItem.dimensions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(selectedItem.hotlinkUrl)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 rounded text-neutral-200"
                  >
                    {copiedUrl === selectedItem.hotlinkUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={selectedItem.hotlinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-neutral-400 hover:text-white"
                    title="Open original file in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 text-neutral-400 hover:text-white ml-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Media Area */}
              <div className="relative bg-neutral-950 flex items-center justify-center overflow-hidden flex-1 min-h-[320px] max-h-[60vh]">
                <img
                  src={selectedItem.hotlinkUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] max-w-full object-contain"
                />

                {/* Arrow navigation */}
                <button
                  onClick={() => {
                    const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
                    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
                    setSelectedItem(filteredItems[prevIndex]);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
                    const nextIndex = (currentIndex + 1) % filteredItems.length;
                    setSelectedItem(filteredItems[nextIndex]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modal EXIF & Technical Metadata Drawer */}
              <div className="p-5 border-t border-neutral-800 bg-neutral-900/60">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Camera Sensor</div>
                    <div className="font-mono-code text-neutral-200">{selectedItem.exif.camera}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Optics & Focal</div>
                    <div className="font-mono-code text-neutral-200">{selectedItem.exif.focalLength} · {selectedItem.exif.aperture}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Exposure</div>
                    <div className="font-mono-code text-neutral-200">{selectedItem.exif.shutter} · ISO {selectedItem.exif.iso}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Attribution</div>
                    <div className="text-neutral-200">{selectedItem.author} <span className="text-neutral-500">{selectedItem.authorHandle}</span></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="text-neutral-400 text-xs">
                    {selectedItem.description}
                  </div>
                  <button
                    onClick={() => handleCopySnippet(selectedItem)}
                    className="self-start sm:self-auto font-mono-code text-[11px] px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-300 hover:text-white flex items-center gap-1.5"
                  >
                    {copiedSnippet === selectedItem.id ? (
                      <span className="text-emerald-400">Snippet Copied</span>
                    ) : (
                      <span>Copy HTML Snippet</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
