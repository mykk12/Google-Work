import { ScreenId } from '../types';
import { LayoutTemplate, Image, FileText, Monitor, Code2 } from 'lucide-react';
import { ReactiveGlassBlock } from './ReactiveGlassBlock';

interface ScreenSwitcherBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export function ScreenSwitcherBar({ currentScreen, onNavigate }: ScreenSwitcherBarProps) {
  const screens: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'showcase', label: '1. Showcase', icon: <LayoutTemplate className="w-3.5 h-3.5" /> },
    { id: 'gallery', label: '2. Visual Gallery', icon: <Image className="w-3.5 h-3.5" /> },
    { id: 'case-study', label: '3. KRONOS Study', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'device-studio', label: '4. Device Studio', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'html-importer', label: '5. HTML Importer', icon: <Code2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
      {/* Reactive Glass Floating Dock with surroundings light reflection */}
      <ReactiveGlassBlock
        variant="ultra"
        className="rounded-2xl shadow-2xl p-1.5"
        glowColor="rgba(180, 220, 255, 0.45)"
      >
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono-code text-neutral-200 uppercase tracking-wider font-semibold border-r border-white/20 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,1)]" />
            <span>Screens</span>
          </div>
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'frosty-glass-tab-active'
                    : 'frosty-glass-tab'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}>
                  {s.icon}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </ReactiveGlassBlock>
    </div>
  );
}
