import { useState, useMemo } from 'react';
import { Code, Check, Copy, ExternalLink, Play, Monitor, Sparkles, AlertCircle } from 'lucide-react';
import { ExtractedHotlink, ScreenId } from '../../types';
import { SAMPLE_HTML_TEMPLATES } from '../../data/screensData';

interface HtmlImporterScreenProps {
  customHtml: string;
  onUpdateCustomHtml: (html: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string) => void;
}

export function HtmlImporterScreen({
  customHtml,
  onUpdateCustomHtml,
  onNavigate,
  onToast,
}: HtmlImporterScreenProps) {
  const [inputCode, setInputCode] = useState(customHtml || SAMPLE_HTML_TEMPLATES[0].code);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Extract hotlinks from inputCode
  const extractedHotlinks: ExtractedHotlink[] = useMemo(() => {
    const list: ExtractedHotlink[] = [];
    // Match <img> tags
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(inputCode)) !== null) {
      const fullTag = match[0];
      const url = match[1];

      // Extract alt attribute if present
      const altMatch = /alt=["']([^"']*)["']/i.exec(fullTag);
      const alt = altMatch ? altMatch[1] : 'Hotlinked image';

      let domain = '';
      try {
        const parsed = new URL(url);
        domain = parsed.hostname;
      } catch {
        domain = 'relative / custom';
      }

      list.push({
        url,
        alt,
        domain,
        tagSnippet: fullTag,
        valid: url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'),
      });
    }
    return list;
  }, [inputCode]);

  const handleApply = () => {
    onUpdateCustomHtml(inputCode);
    onToast(`Extracted and synchronized ${extractedHotlinks.length} image hotlinks`);
  };

  const handleSendToDevice = () => {
    onUpdateCustomHtml(inputCode);
    onNavigate('device-studio');
    onToast('Transferred custom screen to Device Studio mockup!');
  };

  const handleCopyHotlink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    onToast('Hotlink copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleLoadTemplate = (templateIndex: number) => {
    const tmpl = SAMPLE_HTML_TEMPLATES[templateIndex];
    setInputCode(tmpl.code);
    onUpdateCustomHtml(tmpl.code);
    onToast(`Loaded preset: ${tmpl.name}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              <span>Hotlink Extraction Engine</span>
              <span aria-hidden="true">·</span>
              <span>Live Screen Renderer</span>
              <span aria-hidden="true">·</span>
              <span>Direct HTML Parser</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-neutral-100 tracking-tight">
              Hotlink images from HTML
            </h1>
            <p className="text-sm text-neutral-400 max-w-2xl mt-1 leading-relaxed">
              Paste or edit any raw HTML code. Our engine automatically parses all image hotlinks, validates CDN endpoints, previews the rendered screen in real-time, and transfers the layout directly into interactive device mockups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-medium text-neutral-950 bg-neutral-100 rounded-md hover:bg-white active:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Compile & Render</span>
            </button>
            <button
              onClick={handleSendToDevice}
              className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-850 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5 text-neutral-400" />
              <span>Send to Device Mockup</span>
            </button>
          </div>
        </div>

        {/* Preset Templates Selector with Frosty Glass Look */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs frosty-glass-container p-2 rounded-xl">
          <span className="text-neutral-400 font-medium px-2 text-[11px] font-mono-code uppercase">Preset Screens:</span>
          {SAMPLE_HTML_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.name}
              onClick={() => handleLoadTemplate(idx)}
              className="frosty-glass-tab px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition-all duration-200"
            >
              <Sparkles className="w-3 h-3 text-neutral-300" />
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>

        {/* Split Workbench: Editor vs Live Screen Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Left Column: Code Editor */}
          <div className="lg:col-span-6 flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-xl">
            <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-semibold text-neutral-200">Raw HTML Input</span>
              </div>
              <span className="font-mono-code text-[11px] text-neutral-500">
                {extractedHotlinks.length} image tags detected
              </span>
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste HTML with <img src='...' /> here..."
              className="w-full h-[420px] p-4 bg-neutral-950 font-mono-code text-xs text-neutral-200 focus:outline-none resize-none leading-relaxed selection:bg-neutral-800"
              spellCheck={false}
            />
            <div className="p-3 bg-neutral-950/80 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
              <span>You can hotlink any image URL directly inside &lt;img&gt; or background styles</span>
              <button
                onClick={() => setInputCode('')}
                className="text-neutral-500 hover:text-neutral-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column: Live Rendered Screen Sandbox */}
          <div className="lg:col-span-6 flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-xl">
            <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-neutral-200">Live Rendered Screen</span>
              </div>
              <span className="font-mono-code text-[11px] text-neutral-500">
                Sandbox Preview Container
              </span>
            </div>

            <div className="h-[420px] overflow-y-auto p-6 bg-neutral-950 text-neutral-100">
              {inputCode ? (
                <div
                  className="space-y-4"
                  dangerouslySetInnerHTML={{ __html: inputCode }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 text-xs">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  <span>No HTML entered. Paste code on the left or load a preset.</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-neutral-950/80 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Styled with responsive container math</span>
              <button
                onClick={handleSendToDevice}
                className="text-neutral-300 hover:text-white flex items-center gap-1"
              >
                <span>View inside iPhone / MacBook</span>
                <Monitor className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Extracted Hotlink Registry Table */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-display font-semibold text-neutral-100">
                Extracted Hotlink Index ({extractedHotlinks.length})
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every external image found in the HTML snippet above with live thumbnail and verification.
              </p>
            </div>
          </div>

          {extractedHotlinks.length > 0 ? (
            <div className="divide-y divide-neutral-800/80 text-xs">
              {extractedHotlinks.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                      <img
                        src={item.url}
                        alt={item.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-neutral-200 truncate">{item.alt}</div>
                      <div className="font-mono-code text-[11px] text-neutral-500 truncate max-w-lg">
                        {item.url}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Host: {item.domain}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyHotlink(item.url)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-300 hover:text-white"
                    >
                      {copiedUrl === item.url ? (
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
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-neutral-400 hover:text-white"
                      title="Open source image"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-neutral-500">
              No &lt;img src="..."&gt; tags found in the code yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
