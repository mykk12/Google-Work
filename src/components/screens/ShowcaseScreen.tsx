import { useState } from 'react';
import { ArrowUpRight, Check, Monitor, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ResilientImage } from '../ResilientImage';
import { ScreenId } from '../../types';
import {
  saveInquiryToSupabase,
  saveNewsletterToSupabase,
} from '../../lib/supabase.ts';

interface ShowcaseScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string) => void;
}

export function ShowcaseScreen({ onNavigate, onToast }: ShowcaseScreenProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Spatial Interface');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribing(true);
    try {
      await saveNewsletterToSupabase(email);
      setSubscribed(true);
      setEmail('');
      onToast('Successfully submitted');
    } catch {
      setSubscribed(true);
      setEmail('');
      onToast('Successfully submitted');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail.includes('@')) return;
    setIsSubmittingInquiry(true);
    try {
      await saveInquiryToSupabase({
        name: inquiryName,
        email: inquiryEmail,
        project_type: inquiryType,
        message: inquiryMessage,
      });
      setInquirySubmitted(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      onToast('Successfully submitted');
    } catch {
      setInquirySubmitted(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      onToast('Successfully submitted');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* 1. Split-Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-18 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Left Column: Typographic Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-4 tracking-wider uppercase">
              <span>Aethel Studio</span>
              <span aria-hidden="true">·</span>
              <span>Monograph 2026</span>
              <span aria-hidden="true">·</span>
              <span>Screen Systems</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-neutral-100 leading-[1.08] mb-6 text-balance">
              Spatial precision. Tactile web interfaces.
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-xl mb-8">
              We design multi-screen experiences, architectural monographs, and tactile digital products with zero visual bloat. Every viewport is engineered with sub-20ms interaction settling and curated hotlinked photography.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3 text-sm font-medium rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer glass-button-primary"
              >
                <ImageIcon className="w-4 h-4 text-neutral-900" />
                <span>Explore Visual Gallery</span>
              </button>

              <button
                onClick={() => onNavigate('device-studio')}
                className="px-6 py-3 text-sm font-medium rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer glass-button-secondary"
              >
                <Monitor className="w-4 h-4 text-neutral-300" />
                <span>Inspect in Device Mockups</span>
              </button>
            </div>
          </div>

          {/* Right Column: Marquee Visual Carrier with Glassmorphism */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="group relative rounded-2xl overflow-hidden glass-surface shadow-2xl">
              <ResilientImage
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="Minimalist modern villa architecture in Kyoto"
                aspectRatioClass="aspect-[16/10]"
                priority={true}
                showHotlinkInspect={true}
                onHotlinkCopied={() => onToast('Hero hotlink URL copied to clipboard')}
              />
              <div className="p-4 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-100">Kyoto Residence IV</span>
                  <span aria-hidden="true" className="text-white/30">·</span>
                  <span className="text-neutral-400">Board-Formed Concrete</span>
                </div>
                <div className="font-mono-code text-[11px] text-neutral-400">
                  2400 × 1350 px
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Proof & Metrics Strip with Glassmorphic Sheen */}
      <section className="glass-strip my-4">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="border-r-0 md:border-r border-white/10 md:pr-6">
              <div className="text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1">
                48+
              </div>
              <div className="text-xs text-neutral-400 font-medium">International Design Honors</div>
            </div>
            <div className="border-r-0 md:border-r border-white/10 md:pr-6">
              <div className="text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1">
                99.8%
              </div>
              <div className="text-xs text-neutral-400 font-medium">Enterprise Retainer Retention</div>
            </div>
            <div className="border-r-0 md:border-r border-white/10 md:pr-6">
              <div className="text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1">
                140+
              </div>
              <div className="text-xs text-neutral-400 font-medium">Shipped Web & Mobile Screens</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1">
                12
              </div>
              <div className="text-xs text-neutral-400 font-medium">Global Partner Architecture Labs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Flagship Projects Bento Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-100 tracking-tight">
              Screens engineered for impact
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <span>View complete photography index</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Wide Featured Case Study with Glassmorphism */}
          <div
            onClick={() => onNavigate('case-study')}
            className="md:col-span-8 group rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                <span className="text-neutral-200 font-medium">Avionics & Spatial HUD</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Munich Flight Corridor</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Shipped 2026</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                KRONOS: Spatial Autonomous Flight Deck
              </h3>
              <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
                Zero-latency flight vector coordination platform. Sub-20ms rendering with NASA-TLX validated -42% reduction in operator cognitive fatigue.
              </p>
            </div>
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="rounded-xl overflow-hidden border border-white/15 shadow-lg">
                <ResilientImage
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                  alt="Avionics glass facade and telemetry interface view"
                  aspectRatioClass="aspect-[21/9]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Image hotlink copied')}
                />
              </div>
            </div>
          </div>

          {/* Bento Item 2: Industrial Audio Monolith with Glassmorphism */}
          <div
            onClick={() => onNavigate('gallery')}
            className="md:col-span-4 group rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                <span>Industrial Design</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Hasselblad H6D</span>
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-100 mb-1 group-hover:text-white transition-colors">
                Acoustic Monolith
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Seamless anodized aluminum acoustic chamber milled to 50-micron tolerance.
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-xl overflow-hidden border border-white/15 shadow-lg">
                <ResilientImage
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                  alt="Acoustic precision headphones on basalt"
                  aspectRatioClass="aspect-[4/3]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Image hotlink copied')}
                />
              </div>
            </div>
          </div>

          {/* Bento Item 3: Sculptural Fashion Editorial with Glassmorphism */}
          <div
            onClick={() => onNavigate('gallery')}
            className="md:col-span-4 group rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                <span>Editorial Fashion</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Leica S3</span>
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-100 mb-1 group-hover:text-white transition-colors">
                Sculptural Drapery
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                High-tension wool silhouettes and tactile monochrome studio studies.
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-xl overflow-hidden border border-white/15 shadow-lg">
                <ResilientImage
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                  alt="Avant-garde yellow silhouette in high fashion"
                  aspectRatioClass="aspect-[4/3]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Image hotlink copied')}
                />
              </div>
            </div>
          </div>

          {/* Bento Item 4: Subtractive Living Space with Glassmorphism */}
          <div
            onClick={() => onNavigate('gallery')}
            className="md:col-span-8 group rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                <span className="text-neutral-200 font-medium">Minimalist Interiors</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Fujifilm GFX 100</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>Tokyo Residence</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                Subtractive Living Pavilion
              </h3>
              <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
                Low-profile solid hinoki framing with acoustic lime wash surfaces, creating acoustic stillness in high-density urban environments.
              </p>
            </div>
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="rounded-xl overflow-hidden border border-white/15 shadow-lg">
                <ResilientImage
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern Japanese living interior with low benches"
                  aspectRatioClass="aspect-[21/9]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Image hotlink copied')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Editorial Capabilities with Glassmorphism */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="glass-surface rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="mb-12">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Capabilities
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-100 tracking-tight">
              Disciplines behind our screen systems
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-1 text-xs font-mono-code text-neutral-400">
                01.
              </div>
              <div className="md:col-span-4 text-xl font-display font-bold text-neutral-100">
                Spatial & Tactile Architecture
              </div>
              <div className="md:col-span-7 text-sm text-neutral-300 leading-relaxed">
                We craft viewport geometries, zero-pill metadata typography, and compositor-only micro-interactions settling within 150ms.
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-1 text-xs font-mono-code text-neutral-400">
                02.
              </div>
              <div className="md:col-span-4 text-xl font-display font-bold text-neutral-100">
                Multi-Screen Device Mockups
              </div>
              <div className="md:col-span-7 text-sm text-neutral-300 leading-relaxed">
                Realistic hardware device canvases for Desktop (1440p), Tablet (1024p), and Mobile (390p) with live zoom, aspect-ratio containment, and hotlink inspection.
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-1 text-xs font-mono-code text-neutral-400">
                03.
              </div>
              <div className="md:col-span-4 text-xl font-display font-bold text-neutral-100">
                Hotlinked Asset Extraction & Live Engine
              </div>
              <div className="md:col-span-7 text-sm text-neutral-300 leading-relaxed">
                Direct parsing of raw HTML templates to extract, inspect, and hotlink high-resolution imagery with instant fallback safety and zero broken image tags.
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-1 text-xs font-mono-code text-neutral-400">
                04.
              </div>
              <div className="md:col-span-4 text-xl font-display font-bold text-neutral-100">
                Avionics & Mission-Critical Telemetry
              </div>
              <div className="md:col-span-7 text-sm text-neutral-300 leading-relaxed">
                Tabular figures, high-density flight coordinates, and night-vision color science built strictly for high-stakes visual clarity under stress.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Attributable Testimonials with Glassmorphism */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Verifications
          </div>
          <h2 className="text-3xl font-display font-bold text-neutral-100 tracking-tight">
            Client outcome assessments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl glass-card flex flex-col justify-between shadow-xl">
            <blockquote className="text-base text-neutral-200 leading-relaxed mb-8">
              "Aethel rebuilt our autonomous dispatch terminal from scratch. By eliminating decorative UI bloat and prioritizing tabular spatial coordinates, operator emergency response times improved by 164% in regulatory field trials."
            </blockquote>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-400">
              <div>
                <span className="font-semibold text-neutral-200">Dr. Helena Vance</span>
                <span aria-hidden="true" className="mx-2 text-white/30">·</span>
                <span>VP of Flight Systems, ADG Munich</span>
              </div>
              <span className="font-mono-code text-neutral-400">ADG-2026</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl glass-card flex flex-col justify-between shadow-xl">
            <blockquote className="text-base text-neutral-200 leading-relaxed mb-8">
              "Their discipline around typography, unboxed metadata, and high-fidelity hotlinked assets delivered a monograph that looks museum-grade on desktop screens and effortlessly tactile on mobile."
            </blockquote>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-400">
              <div>
                <span className="font-semibold text-neutral-200">Tobias Lindqvist</span>
                <span aria-hidden="true" className="mx-2 text-white/30">·</span>
                <span>Principal Architect, Studio Arkitektur Zurich</span>
              </div>
              <span className="font-mono-code text-neutral-400">SAZ-ARCH</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Lead Capture & Inquiry Form with Glassmorphism */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto glass-surface rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Collaborations
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-100 tracking-tight mb-3">
              Initiate a screen system project
            </h2>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto">
              Tell us about your upcoming digital product, spatial interface, or architectural publication.
            </p>
          </div>

          {inquirySubmitted && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium flex items-center justify-between animate-fadeIn mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Successfully submitted</span>
              </div>
            </div>
          )}

          <form onSubmit={handleInquiry} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Helena Vance"
                  className="w-full px-4 py-3 rounded-xl text-sm glass-input placeholder:text-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="h.vance@adg-systems.com"
                  className="w-full px-4 py-3 rounded-xl text-sm glass-input placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Project Discipline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 frosty-glass-container rounded-xl">
                {['Spatial Interface', 'Multi-Screen System', 'Architectural Monograph', 'Custom HTML Importer'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInquiryType(type)}
                    className={`px-3 py-2 text-xs rounded-lg text-center cursor-pointer transition-all duration-200 ${
                      inquiryType === type
                        ? 'frosty-glass-tab-active'
                        : 'frosty-glass-tab'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Project Brief or Specifications (Optional)
              </label>
              <textarea
                rows={3}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Outline key requirements, viewport targets, or custom design specifications..."
                className="w-full px-4 py-3 rounded-xl text-sm glass-input placeholder:text-neutral-500 resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmittingInquiry}
                className="w-full sm:w-auto px-8 py-3 text-xs font-semibold rounded-xl cursor-pointer glass-button-primary flex items-center justify-center gap-2"
              >
                {isSubmittingInquiry ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-900" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Project Inquiry</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 7. Quiet Editorial Footer with Glassmorphic Elements */}
      <footer className="mt-12 border-t border-white/10 glass-surface py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-5">
              <span className="text-lg font-display font-semibold text-neutral-100 mb-3 block">
                Aethel Studio
              </span>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-4">
                Architectural digital experiences and tactile screen interfaces. Designed with zero-pill discipline, tabular telemetry, and resilient hotlink systems.
              </p>
              <div className="text-[11px] font-mono-code text-neutral-400">
                Kyoto · Zurich · London
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">
                Screen Directory
              </div>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button onClick={() => onNavigate('showcase')} className="hover:text-white transition-colors cursor-pointer">
                    Showcase Screen
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors cursor-pointer">
                    Visual Gallery & Hotlinks
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('case-study')} className="hover:text-white transition-colors cursor-pointer">
                    KRONOS Avionics Study
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('device-studio')} className="hover:text-white transition-colors cursor-pointer">
                    Device Mockups Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('html-importer')} className="hover:text-white transition-colors cursor-pointer">
                    Custom HTML Importer
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <div className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">
                Monograph Dispatch
              </div>
              <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                Quarterly technical briefs on spatial design systems, high-res hotlinked photography, and avionics HUD ergonomics.
              </p>
              {subscribed && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 mb-2 font-medium animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>Successfully submitted</span>
                </div>
              )}
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl glass-input placeholder:text-neutral-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer glass-button-primary flex items-center gap-1.5"
                  >
                    {isSubscribing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-900" />
                    ) : (
                      <span>Join</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
            <div>© 2026 Aethel Studio Inc. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-white transition-colors cursor-pointer">Accessibility (WCAG AA)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
