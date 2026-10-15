import { useState, useMemo } from 'react';
import { Code, Check, Copy, ExternalLink, Play, Monitor, Sparkles, AlertCircle, Cloud, Loader2 } from 'lucide-react';
import { ExtractedHotlink, ScreenId } from '../../types';
import { SAMPLE_HTML_TEMPLATES } from '../../data/screensData';
import { useAuth } from '../../context/AuthContext.tsx';
import { saveProjectToSupabase } from '../../lib/supabase.ts';

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
  const { user, getToken, signInWithGoogle } = useAuth();
  const [inputCode, setInputCode] = useState(customHtml || SAMPLE_HTML_TEMPLATES[0].code);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveToCloud = async () => {
    if (!inputCode.trim()) {
      onToast('No HTML content to save');
      return;
    }

    setIsSaving(true);
    try {
      const titleMatch = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/i.exec(inputCode);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Frosted Glass Layout';

      const res = await saveProjectToSupabase({
        title: title || 'Custom Glass Screen',
        html_content: inputCode,
        device_type: 'desktop',
        glass_style: 'ultra',
        accent_color: '#34d399',
        user_id: user?.id || 'anonymous',
      });

      if (res.success) {
        onToast('Successfully submitted');
      } else {
        onToast(`Error saving: ${res.error || 'Failed to save'}`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      onToast('Error saving design');
    } finally {
      setIsSaving(false);
    }
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/15 border border-white/20 text-blue-300 hover:text-blue-200 transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cloud className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer glass-button-primary"
            >
              <Play className="w-3.5 h-3.5 text-neutral-900" />
              <span>Compile & Render</span>
            </button>
            <button
              onClick={handleSendToDevice}
              className="px-5 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 cursor-pointer glass-button-secondary"
            >
              <Monitor className="w-3.5 h-3.5 text-neutral-300" />
              <span>Send to Device Mockup</span>
            </button>
          </div>
        </div>

        {/* Preset Templates Selector with Frosty Glass Look */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs frosty-glass-container p-2 rounded-2xl">
          <span className="text-neutral-400 font-medium px-2 text-[11px] font-mono-code uppercase">Preset Screens:</span>
          {SAMPLE_HTML_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.name}
              onClick={() => handleLoadTemplate(idx)}
              className="frosty-glass-tab px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs transition-all duration-200"
            >
              <Sparkles className="w-3 h-3 text-neutral-300" />
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>

        {/* Split Workbench: Editor vs Live Screen Preview with Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Left Column: Code Editor */}
          <div className="lg:col-span-6 flex flex-col rounded-3xl glass-surface border border-white/20 overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-white/[0.04] backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-semibold text-neutral-100">Raw HTML Input</span>
              </div>
              <span className="font-mono-code text-[11px] text-neutral-400">
                {extractedHotlinks.length} image tags detected
              </span>
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste HTML with <img src='...' /> here..."
              className="w-full h-[420px] p-5 bg-transparent font-mono-code text-xs text-neutral-200 focus:outline-none resize-none leading-relaxed selection:bg-neutral-800"
              spellCheck={false}
            />
            <div className="p-3.5 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>You can hotlink any image URL directly inside &lt;img&gt; or background styles</span>
              <button
                onClick={() => setInputCode('')}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column: Live Rendered Screen Sandbox */}
          <div className="lg:col-span-6 flex flex-col rounded-3xl glass-surface border border-white/20 overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-white/[0.04] backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="font-semibold text-neutral-100">Live Rendered Screen</span>
              </div>
              <span className="font-mono-code text-[11px] text-neutral-400">
                Sandbox Preview Container
              </span>
            </div>

            <div className="h-[420px] overflow-y-auto p-6 bg-neutral-950/60 text-neutral-100">
              {inputCode ? (
                <div
                  className="space-y-4"
                  dangerouslySetInnerHTML={{ __html: inputCode }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 text-xs">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  <span>No HTML entered. Paste code on the left or load a preset.</span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Styled with responsive container math</span>
              <button
                onClick={handleSendToDevice}
                className="text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>View inside iPhone / MacBook</span>
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Extracted Hotlink Registry Table with Glass Surface */}
        <div className="rounded-3xl glass-surface border border-white/20 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
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
            <div className="divide-y divide-white/10 text-xs">
              {extractedHotlinks.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-white/15 overflow-hidden shrink-0">
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
                      <div className="font-mono-code text-[11px] text-neutral-400 truncate max-w-lg">
                        {item.url}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Host: {item.domain}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyHotlink(item.url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button-secondary text-neutral-200 hover:text-white"
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
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg glass-badge"
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
