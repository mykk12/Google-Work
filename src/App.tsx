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
import { SavedProjectsModal } from './components/SavedProjectsModal';
import { SupabaseConnectionModal } from './components/SupabaseConnectionModal';
import { SAMPLE_HTML_TEMPLATES } from './data/screensData';
import { Check } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('showcase');
  const [customHtml, setCustomHtml] = useState<string>(SAMPLE_HTML_TEMPLATES[0].code);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

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

      {/* Top Bar Navigation with Surroundings-Reactive Glass & Supabase Status */}
      <TopNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onPrimaryAction={() => handleNavigate('device-studio')}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        onToast={showToast}
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

      {/* Supabase Saved Designs Modal */}
      <SavedProjectsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onLoadProject={(html, screen) => {
          setCustomHtml(html);
          handleNavigate(screen);
        }}
        onToast={showToast}
        onOpenSupabaseConfig={() => {
          setIsSavedModalOpen(false);
          setIsSupabaseModalOpen(true);
        }}
      />

      {/* Supabase Connection Details & SQL Setup Modal */}
      <SupabaseConnectionModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onToast={showToast}
      />

      {/* Toast Feedback Notification with Glassmorphism */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-surface border border-white/25 shadow-2xl text-xs font-medium backdrop-blur-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-neutral-100 font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
