import { useState } from 'react';
import { ImageOff, Copy, Check } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  showHotlinkInspect?: boolean;
  priority?: boolean;
  onHotlinkCopied?: () => void;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[16/9]',
  showHotlinkInspect = false,
  priority = false,
  onHotlinkCopied,
}: ResilientImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(src);
    setCopied(true);
    if (onHotlinkCopied) onHotlinkCopied();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${aspectRatioClass} ${className}`}>
      {/* Skeleton loading background */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 animate-pulse" />
      )}

      {/* Actual Hotlinked Image */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Styled Fallback Frame conforming to Zero-Broken-Image Policy */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800">
          <div className="p-3 mb-2 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-400">
            <ImageOff className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-neutral-300 max-w-[220px] truncate">{alt}</span>
          <span className="text-[11px] text-neutral-500 mt-1">Fallback geometric canvas</span>
        </div>
      )}

      {/* Optional Hotlink Inspector Overlay */}
      {showHotlinkInspect && (
        <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleCopy}
            title="Copy direct hotlink URL"
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-code bg-neutral-950/90 text-neutral-200 border border-neutral-700/70 rounded hover:bg-neutral-900 hover:text-white transition-colors backdrop-blur-sm shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span>Hotlink</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
