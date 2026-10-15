import { useState } from 'react';
import { ArrowLeft, Monitor, Play, RefreshCw, Layers } from 'lucide-react';
import { FEATURED_CASE_STUDY } from '../../data/screensData';
import { ResilientImage } from '../ResilientImage';
import { ScreenId } from '../../types';

interface CaseStudyScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string) => void;
}

export function CaseStudyScreen({ onNavigate, onToast }: CaseStudyScreenProps) {
  const study = FEATURED_CASE_STUDY;
  const [activeVectorMode, setActiveVectorMode] = useState<'cruise' | 'approach' | 'divert'>('cruise');
  const [altitude, setAltitude] = useState(1450);
  const [velocity, setVelocity] = useState(184);

  const toggleMode = (mode: 'cruise' | 'approach' | 'divert') => {
    setActiveVectorMode(mode);
    if (mode === 'cruise') {
      setAltitude(1450);
      setVelocity(184);
      onToast('Flight Mode: Autonomous Corridor Cruise (Optimal Vector)');
    } else if (mode === 'approach') {
      setAltitude(620);
      setVelocity(92);
      onToast('Flight Mode: Terminal Vertiport Approach (Deceleration Cone)');
    } else {
      setAltitude(980);
      setVelocity(210);
      onToast('Flight Mode: Emergency Trajectory Divert (Clearance Zone)');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Link with Glassmorphism */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('showcase')}
            className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-xl glass-button-secondary cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Showcase</span>
          </button>
        </div>

        {/* Case Study Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-3 uppercase tracking-wider">
            <span>Case Study</span>
            <span aria-hidden="true">·</span>
            <span>{study.discipline}</span>
            <span aria-hidden="true">·</span>
            <span>{study.year}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold text-neutral-100 tracking-tight mb-4 text-balance">
            {study.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl">
            {study.subtitle}
          </p>
        </div>

        {/* Hero Visual Container with Glassmorphism */}
        <div className="rounded-3xl overflow-hidden glass-surface mb-12 shadow-2xl border border-white/20">
          <ResilientImage
            src={study.heroImage}
            alt={study.title}
            aspectRatioClass="aspect-[16/9]"
            priority={true}
            showHotlinkInspect={true}
            onHotlinkCopied={() => onToast('Case study hero hotlink copied')}
          />
          <div className="p-4 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
            <div>Client: <span className="text-neutral-100 font-medium">{study.client}</span></div>
            <div className="font-mono-code text-[11px] text-neutral-400">Munich Aerial Test Facility</div>
          </div>
        </div>

        {/* Quantified Impact Metrics Grid with Glassmorphic Cards */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Quantified Performance Metrics
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {study.metrics.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card shadow-xl">
                <div className="text-xs text-neutral-400 mb-1.5">{m.label}</div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1.5">
                  {m.value}
                </div>
                <div className="text-[11px] text-neutral-300 leading-snug">{m.context}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Columns: Challenge vs Solution with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="glass-surface rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
              The Architecture Challenge
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {study.challenge}
            </p>
          </div>
          <div className="glass-surface rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
              The Engineered Solution
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {study.solution}
            </p>
          </div>
        </div>

        {/* Interactive Flight Vector HUD Demonstration with Glassmorphism */}
        <div className="rounded-3xl glass-surface p-6 sm:p-8 mb-16 border border-white/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-300" />
                <span>Interactive Telemetry Simulation</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-neutral-100">
                Live Flight Vector Coordinates Engine
              </h3>
            </div>

            {/* Vector Mode Selector Tabs with Frosty Glass Look */}
            <div className="flex items-center gap-1.5 p-1.5 frosty-glass-container rounded-xl">
              <button
                onClick={() => toggleMode('cruise')}
                className={`px-3.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all duration-200 ${
                  activeVectorMode === 'cruise'
                    ? 'frosty-glass-tab-active'
                    : 'frosty-glass-tab'
                }`}
              >
                Corridor Cruise
              </button>
              <button
                onClick={() => toggleMode('approach')}
                className={`px-3.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all duration-200 ${
                  activeVectorMode === 'approach'
                    ? 'frosty-glass-tab-active'
                    : 'frosty-glass-tab'
                }`}
              >
                Terminal Approach
              </button>
              <button
                onClick={() => toggleMode('divert')}
                className={`px-3.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all duration-200 ${
                  activeVectorMode === 'divert'
                    ? 'frosty-glass-tab-active'
                    : 'frosty-glass-tab'
                }`}
              >
                Emergency Divert
              </button>
            </div>
          </div>

          {/* Telemetry Display HUD Canvas with Glass Panels */}
          <div className="rounded-2xl bg-white/[0.02] backdrop-blur-lg border border-white/10 p-6 font-mono-code text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-neutral-400 mb-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block mb-1">Vector Mode</span>
                <span className="text-neutral-100 uppercase font-semibold">{activeVectorMode}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block mb-1">Barometric Altitude</span>
                <span className="text-neutral-100 tabular-nums">{altitude} ft MSL</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block mb-1">Indicated Groundspeed</span>
                <span className="text-neutral-100 tabular-nums">{velocity} kts</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block mb-1">Compositor Latency</span>
                <span className="text-emerald-400 tabular-nums">18.2 ms</span>
              </div>
            </div>

            {/* Visual Artificial Horizon and Vector Traces */}
            <div className="relative h-36 bg-white/[0.02] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Pitch lines */}
              <div className="absolute inset-x-8 h-px bg-white/15" />
              <div className="absolute inset-x-16 -translate-y-4 h-px bg-white/10" />
              <div className="absolute inset-x-16 translate-y-4 h-px bg-white/10" />

              {/* Dynamic Flight Director Wings */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full border border-white/80 bg-white/20 backdrop-blur-sm" />
                <div className="w-12 h-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              </div>

              {/* Status readout inside HUD */}
              <div className="absolute top-2.5 left-3 text-[10px] text-neutral-400">
                TRAJECTORY_CONE: VALIDATED (99.98% CONFIDENCE)
              </div>
              <div className="absolute bottom-2.5 right-3 text-[10px] text-neutral-400">
                BEARING: 042° · PITCH: {activeVectorMode === 'approach' ? '-3.5°' : '+1.2°'}
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Checklist with Glass Cards */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Core Engineering Deliverables
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {study.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass-card flex items-center gap-3 text-xs text-neutral-200 font-medium"
              >
                <span className="font-mono-code text-neutral-400 text-[11px]">0{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery of Project Images with Glassmorphism */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Deployment & Hardware Photography
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {study.galleryImages.map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden glass-card shadow-xl">
                <ResilientImage
                  src={img.url}
                  alt={img.caption}
                  aspectRatioClass="aspect-[4/3]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Hardware hotlink copied')}
                />
                <div className="p-4 bg-white/[0.03] backdrop-blur-md border-t border-white/10">
                  <div className="text-[10px] text-neutral-400 font-mono-code uppercase mb-0.5">{img.tag}</div>
                  <div className="text-xs text-neutral-200 line-clamp-1">{img.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps / CTA with Glass Surface */}
        <div className="p-8 sm:p-10 rounded-3xl glass-surface border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-display font-semibold text-neutral-100 mb-1">
              Preview this interface inside hardware frames
            </h4>
            <p className="text-xs text-neutral-300 max-w-md">
              Inspect how the KRONOS layout and hotlinked imagery scale across MacBook Pro, iPad Air, and iPhone 16 Pro screens.
            </p>
          </div>
          <button
            onClick={() => onNavigate('device-studio')}
            className="px-6 py-3 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-2 whitespace-nowrap self-start sm:self-auto glass-button-primary"
          >
            <Monitor className="w-4 h-4 text-neutral-900" />
            <span>Open in Device Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
