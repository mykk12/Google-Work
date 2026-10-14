import { ScreenId } from '../types';
import { ReactiveGlassBlock } from './ReactiveGlassBlock';

interface TopNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onPrimaryAction: () => void;
}

export function TopNavigation({
  currentScreen,
  onNavigate,
  onPrimaryAction,
}: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-3 pb-2 transition-all">
      {/* Target Element: div#root > div > header > div with reactive reflection */}
      <ReactiveGlassBlock
        variant="ultra"
        className="max-w-7xl mx-auto rounded-2xl shadow-2xl"
        glowColor="rgba(195, 225, 255, 0.4)"
      >
        <div className="flex items-center justify-between gap-6 px-6 py-3">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('showcase')}
            className="text-lg font-display font-bold tracking-tight text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <span>Aethel Studio</span>
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links with Frosty Glass tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 frosty-glass-container rounded-xl text-xs font-medium">
            <button
              onClick={() => onNavigate('showcase')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                currentScreen === 'showcase'
                  ? 'frosty-glass-tab-active'
                  : 'frosty-glass-tab'
              }`}
            >
              Showcase
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                currentScreen === 'gallery'
                  ? 'frosty-glass-tab-active'
                  : 'frosty-glass-tab'
              }`}
            >
              Visual Gallery
            </button>
            <button
              onClick={() => onNavigate('case-study')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                currentScreen === 'case-study'
                  ? 'frosty-glass-tab-active'
                  : 'frosty-glass-tab'
              }`}
            >
              Case Study
            </button>
            <button
              onClick={() => onNavigate('device-studio')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                currentScreen === 'device-studio'
                  ? 'frosty-glass-tab-active'
                  : 'frosty-glass-tab'
              }`}
            >
              Device Studio
            </button>
            <button
              onClick={() => onNavigate('html-importer')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 ${
                currentScreen === 'html-importer'
                  ? 'frosty-glass-tab-active'
                  : 'frosty-glass-tab'
              }`}
            >
              HTML Importer
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onPrimaryAction}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white/95 hover:bg-white active:bg-neutral-200 transition-all rounded-xl whitespace-nowrap shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)]"
            >
              Launch Studio
            </button>
          </div>
        </div>
      </ReactiveGlassBlock>
    </header>
  );
}
