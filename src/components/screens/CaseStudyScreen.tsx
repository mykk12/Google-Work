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
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('showcase')}
            className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
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

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-3xl">
            {study.subtitle}
          </p>
        </div>

        {/* Hero Visual Container */}
        <div className="rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 mb-12 shadow-2xl">
          <ResilientImage
            src={study.heroImage}
            alt={study.title}
            aspectRatioClass="aspect-[16/9]"
            priority={true}
            showHotlinkInspect={true}
            onHotlinkCopied={() => onToast('Case study hero hotlink copied')}
          />
          <div className="p-4 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <div>Client: <span className="text-neutral-200 font-medium">{study.client}</span></div>
            <div className="font-mono-code text-[11px] text-neutral-500">Munich Aerial Test Facility</div>
          </div>
        </div>

        {/* Quantified Impact Metrics Grid */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Quantified Performance Metrics
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {study.metrics.map((m, idx) => (
              <div key={idx} className="p-5 rounded-lg border border-neutral-800/80 bg-neutral-900/40">
                <div className="text-xs text-neutral-400 mb-1">{m.label}</div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono-code tabular-nums mb-1.5">
                  {m.value}
                </div>
                <div className="text-[11px] text-neutral-500 leading-snug">{m.context}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Columns: Challenge vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 pb-16 border-b border-neutral-800/80">
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              The Architecture Challenge
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {study.challenge}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              The Engineered Solution
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {study.solution}
            </p>
          </div>
        </div>

        {/* Interactive Flight Vector HUD Demonstration */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-6 sm:p-8 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800/80">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
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

          {/* Telemetry Display HUD Canvas */}
          <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-6 font-mono-code text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-neutral-400 mb-6 pb-6 border-b border-neutral-900">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block mb-1">Vector Mode</span>
                <span className="text-neutral-200 uppercase font-semibold">{activeVectorMode}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block mb-1">Barometric Altitude</span>
                <span className="text-neutral-200 tabular-nums">{altitude} ft MSL</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block mb-1">Indicated Groundspeed</span>
                <span className="text-neutral-200 tabular-nums">{velocity} kts</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block mb-1">Compositor Latency</span>
                <span className="text-emerald-400 tabular-nums">18.2 ms</span>
              </div>
            </div>

            {/* Visual Artificial Horizon and Vector Traces */}
            <div className="relative h-36 bg-neutral-900/60 rounded border border-neutral-800/80 overflow-hidden flex items-center justify-center">
              {/* Pitch lines */}
              <div className="absolute inset-x-8 h-px bg-neutral-800" />
              <div className="absolute inset-x-16 -translate-y-4 h-px bg-neutral-800/60" />
              <div className="absolute inset-x-16 translate-y-4 h-px bg-neutral-800/60" />

              {/* Dynamic Flight Director Wings */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-0.5 bg-neutral-200" />
                <div className="w-2.5 h-2.5 rounded-full border border-neutral-200 bg-neutral-950" />
                <div className="w-12 h-0.5 bg-neutral-200" />
              </div>

              {/* Status readout inside HUD */}
              <div className="absolute top-2.5 left-3 text-[10px] text-neutral-500">
                TRAJECTORY_CONE: VALIDATED (99.98% CONFIDENCE)
              </div>
              <div className="absolute bottom-2.5 right-3 text-[10px] text-neutral-500">
                BEARING: 042° · PITCH: {activeVectorMode === 'approach' ? '-3.5°' : '+1.2°'}
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Core Engineering Deliverables
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {study.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-md border border-neutral-800/80 bg-neutral-900/30 flex items-center gap-3 text-xs text-neutral-300 font-medium"
              >
                <span className="font-mono-code text-neutral-500 text-[11px]">0{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery of Project Images */}
        <div className="mb-16">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Deployment & Hardware Photography
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {study.galleryImages.map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                <ResilientImage
                  src={img.url}
                  alt={img.caption}
                  aspectRatioClass="aspect-[4/3]"
                  showHotlinkInspect={true}
                  onHotlinkCopied={() => onToast('Hardware hotlink copied')}
                />
                <div className="p-3 bg-neutral-950 border-t border-neutral-800/80">
                  <div className="text-[10px] text-neutral-500 font-mono-code uppercase mb-0.5">{img.tag}</div>
                  <div className="text-xs text-neutral-300 line-clamp-1">{img.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps / CTA */}
        <div className="p-8 rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-display font-semibold text-neutral-100 mb-1">
              Preview this interface inside hardware frames
            </h4>
            <p className="text-xs text-neutral-400 max-w-md">
              Inspect how the KRONOS layout and hotlinked imagery scale across MacBook Pro, iPad Air, and iPhone 16 Pro screens.
            </p>
          </div>
          <button
            onClick={() => onNavigate('device-studio')}
            className="px-5 py-2.5 text-xs font-medium text-neutral-950 bg-neutral-100 rounded-md hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Monitor className="w-4 h-4" />
            <span>Open in Device Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
