import { useState } from 'react';
import { ScreenId } from './types';
import { TopNavigation } from './components/TopNavigation';
import { ScreenSwitcherBar } from './components/ScreenSwitcherBar';
import { ShowcaseScreen } from './components/screens/ShowcaseScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { CaseStudyScreen } from './components/screens/CaseStudyScreen';
import { DeviceStudioScreen } from './components/screens/DeviceStudioScreen';
import { HtmlImporterScreen } from './components/screens/HtmlImporterScreen';
import { AmbientSurroundingsField } from './components/AmbientSurroundingsField';
import { SAMPLE_HTML_TEMPLATES } from './data/screensData';
import { Check } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('showcase');
  const [customHtml, setCustomHtml] = useState<string>(SAMPLE_HTML_TEMPLATES[0].code);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans pb-20 selection:bg-neutral-200 selection:text-neutral-900 relative">
      {/* Dynamic Surroundings Light Field */}
      <AmbientSurroundingsField currentScreen={currentScreen} />

      {/* Top Bar Navigation with Surroundings-Reactive Glass */}
      <TopNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onPrimaryAction={() => handleNavigate('device-studio')}
      />

      {/* Main Active Screen */}
      <main className="flex-1 relative z-10">
        {currentScreen === 'showcase' && (
          <ShowcaseScreen
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}
        {currentScreen === 'gallery' && (
          <GalleryScreen
            onToast={showToast}
          />
        )}
        {currentScreen === 'case-study' && (
          <CaseStudyScreen
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}
        {currentScreen === 'device-studio' && (
          <DeviceStudioScreen
            onNavigate={handleNavigate}
            onToast={showToast}
            customHtml={customHtml}
          />
        )}
        {currentScreen === 'html-importer' && (
          <HtmlImporterScreen
            customHtml={customHtml}
            onUpdateCustomHtml={(html) => setCustomHtml(html)}
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}
      </main>

      {/* Floating Bottom Screen Switcher Dock */}
      <ScreenSwitcherBar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900/95 text-neutral-100 border border-neutral-700/80 rounded-lg shadow-2xl text-xs font-medium backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
