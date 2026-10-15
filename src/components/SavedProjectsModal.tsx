import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  ArrowUpRight,
  FolderHeart,
  Loader2,
  Plus,
  Sparkles,
  Database,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { ReactiveGlassBlock } from './ReactiveGlassBlock.tsx';
import { ScreenId } from '../types.ts';
import {
  getProjectsFromSupabase,
  deleteProjectFromSupabase,
  saveProjectToSupabase,
  SUPABASE_PROJECT_ID,
  SupabaseProjectRecord,
} from '../lib/supabase.ts';

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (html: string, screen: ScreenId) => void;
  onToast: (msg: string) => void;
  onOpenSupabaseConfig?: () => void;
}

export function SavedProjectsModal({
  isOpen,
  onClose,
  onLoadProject,
  onToast,
  onOpenSupabaseConfig,
}: SavedProjectsModalProps) {
  const { user, signInWithGoogle, signInAsGuest } = useAuth();
  const [projects, setProjects] = useState<SupabaseProjectRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isFromDatabase, setIsFromDatabase] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjectsFromSupabase(user?.id);
      setProjects(res.projects);
      setIsFromDatabase(res.fromDatabase);
    } catch (err) {
      console.error('Failed to load projects from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, user]);

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteProjectFromSupabase(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      onToast('Design removed from Supabase backend');
    } catch (err) {
      console.error('Failed to delete project:', err);
      onToast('Failed to delete design');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateSample = async () => {
    setLoading(true);
    const sampleHtml = `<div class="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 text-white">
  <span class="text-xs uppercase tracking-widest text-emerald-400 font-mono">Supabase Sync</span>
  <h2 class="text-3xl font-bold mt-2">Frosted Glass Monolith</h2>
  <p class="text-neutral-300 mt-2 text-sm leading-relaxed">Persisted automatically into project ${SUPABASE_PROJECT_ID}.</p>
</div>`;

    const res = await saveProjectToSupabase({
      title: `Supabase Design #${projects.length + 1}`,
      html_content: sampleHtml,
      device_type: 'desktop',
      glass_style: 'ultra',
      accent_color: '#34d399',
      user_id: user?.id || 'guest',
    });

    if (res.success) {
      onToast('Created new sample mockup in Supabase backend!');
      fetchProjects();
    } else {
      onToast('Error creating mockup in Supabase');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl">
        <ReactiveGlassBlock
          variant="ultra"
          className="rounded-3xl border border-white/25 shadow-2xl p-6 sm:p-8 relative max-h-[85vh] flex flex-col"
          glowColor="rgba(52, 211, 153, 0.35)"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <FolderHeart className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-white">Saved Designs</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Supabase: {SUPABASE_PROJECT_ID}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Synchronized with Supabase backend ({projects.length} layout{projects.length === 1 ? '' : 's'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenSupabaseConfig && (
                <button
                  onClick={onOpenSupabaseConfig}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Supabase Config & SQL"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Config & SQL</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User & Backend Info Banner */}
          <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-neutral-300 truncate">
                Backend: <strong className="text-emerald-300 font-mono-code">{SUPABASE_PROJECT_ID}.supabase.co</strong>
              </span>
            </div>
            {!user ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => signInAsGuest()}
                  className="text-[11px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
                >
                  Guest Mode
                </button>
                <button
                  onClick={() => signInWithGoogle()}
                  className="text-[11px] px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 font-medium transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-neutral-400 truncate">
                Active as <span className="text-white font-medium">{user.displayName || user.email}</span>
              </span>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto py-4 space-y-3 pr-1 flex-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="text-xs">Fetching designs from Supabase...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl border border-dashed border-white/15 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                  <Database className="w-6 h-6 text-emerald-400/60" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">No designs stored yet in Supabase</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    Use the &quot;Save to Cloud&quot; button in the HTML Importer or create a new template now to test Supabase persistence.
                  </p>
                </div>
                <button
                  onClick={handleCreateSample}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Sample Mockup in Supabase</span>
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    onLoadProject(project.html_content, 'html-importer');
                    onClose();
                  }}
                  className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="overflow-hidden space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors truncate">
                        {project.title}
                      </h4>
                      <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
                        {project.device_type || 'desktop'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-1 font-mono-code text-[11px]">
                      {project.html_content.replace(/<[^>]*>/g, ' ').slice(0, 80)}...
                    </p>
                    <div className="text-[10px] text-neutral-500">
                      {project.created_at ? new Date(project.created_at).toLocaleString() : 'Recent'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(project.id!, e)}
                      disabled={deletingId === project.id}
                      className="p-2 rounded-xl hover:bg-red-500/20 text-neutral-400 hover:text-red-300 transition-colors"
                      title="Delete design"
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-emerald-500 group-hover:text-neutral-950 text-neutral-300 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              onClick={handleCreateSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-200 hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Sample Design</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </ReactiveGlassBlock>
      </div>
    </div>
  );
}
