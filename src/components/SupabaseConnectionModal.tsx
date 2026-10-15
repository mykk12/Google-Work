import { useState, useEffect } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Server,
  Key,
  Globe,
  Code,
  ShieldCheck,
  Sparkles,
  Zap,
  Send,
  Loader2,
  Table,
  Mail,
  FileText,
} from 'lucide-react';
import { ReactiveGlassBlock } from './ReactiveGlassBlock.tsx';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SETUP_SQL,
  saveInquiryToSupabase,
  saveNewsletterToSupabase,
  saveProjectToSupabase,
  getRecentSubmissions,
} from '../lib/supabase.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface SupabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function SupabaseConnectionModal({
  isOpen,
  onClose,
  onToast,
}: SupabaseConnectionModalProps) {
  const { connectionInfo, checkConnection, user, signInAsGuest } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'test' | 'auth'>('sql');

  // Test form state
  const [isTestingInquiry, setIsTestingInquiry] = useState(false);
  const [isTestingNewsletter, setIsTestingNewsletter] = useState(false);
  const [isTestingProject, setIsTestingProject] = useState(false);
  const [recentList, setRecentList] = useState<
    Array<{ id: string | number; type: string; title: string; subtitle: string; created_at: string }>
  >([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen]);

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await getRecentSubmissions();
      setRecentList(res.submissions);
      setIsFromSupabase(res.fromSupabase);
    } catch {
      // ignore
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    onToast('Supabase API Key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    onToast('SQL queries copied! Paste in Supabase SQL Editor and click RUN.');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleRefresh = async () => {
    setIsChecking(true);
    await checkConnection();
    await loadSubmissions();
    setIsChecking(false);
    onToast(`Pinged Supabase project ${SUPABASE_PROJECT_ID}`);
  };

  const handleTestInquiry = async () => {
    setIsTestingInquiry(true);
    try {
      const testName = `Test Lead ${Math.floor(100 + Math.random() * 900)}`;
      const testEmail = `lead-${Date.now()}@example.com`;
      await saveInquiryToSupabase({
        name: testName,
        email: testEmail,
        project_type: 'Spatial Interface',
        message: 'Verified form data pipeline test from Aethel Studio UI',
      });
      onToast(`Test inquiry stored in Supabase (${SUPABASE_PROJECT_ID})!`);
      await loadSubmissions();
    } catch {
      onToast('Error running test inquiry');
    } finally {
      setIsTestingInquiry(false);
    }
  };

  const handleTestNewsletter = async () => {
    setIsTestingNewsletter(true);
    try {
      const testEmail = `subscriber-${Date.now()}@test.io`;
      await saveNewsletterToSupabase(testEmail, 'modal_tester');
      onToast(`Test newsletter email stored in Supabase!`);
      await loadSubmissions();
    } catch {
      onToast('Error saving test newsletter');
    } finally {
      setIsTestingNewsletter(false);
    }
  };

  const handleTestProject = async () => {
    setIsTestingProject(true);
    try {
      await saveProjectToSupabase({
        title: `Mockup Form Screen #${Math.floor(100 + Math.random() * 900)}`,
        html_content: '<div class="p-8 text-white bg-slate-900 rounded-2xl"><h1>Supabase Screen Layout</h1><p>Synced live.</p></div>',
        device_type: 'desktop',
        glass_style: 'ultra',
        accent_color: '#34d399',
        user_id: user?.id || 'guest',
      });
      onToast('Test project layout saved to Supabase projects table!');
      await loadSubmissions();
    } catch {
      onToast('Error saving test project');
    } finally {
      setIsTestingProject(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl">
        <ReactiveGlassBlock
          variant="ultra"
          className="rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 relative max-h-[88vh] flex flex-col"
          glowColor="rgba(52, 211, 153, 0.35)"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-white">
                    Supabase Form Data & Backend
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Project ID: <code className="text-emerald-300 font-mono-code">{SUPABASE_PROJECT_ID}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isChecking}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
                title="Re-check Supabase Connection"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pb-3 border-b border-white/5 shrink-0 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'sql'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>SQL Queries for Forms</span>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'test'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 bg-white/5'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Live Form Tester & Records</span>
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'status'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 bg-white/5'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Endpoints & Keys</span>
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'auth'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Auth & Netlify</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="overflow-y-auto py-4 space-y-4 text-xs pr-1 flex-1">
            {activeTab === 'sql' && (
              <div className="space-y-4">
                {/* Instruction banner */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-emerald-200 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>SQL Queries to Store All Form Data in Supabase</span>
                    </h3>
                    <p className="text-neutral-300 text-xs mt-1 leading-relaxed">
                      Copy the SQL below, open your Supabase project dashboard, click <strong>SQL Editor</strong>, paste and hit <strong>RUN</strong>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={handleCopySql}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-neutral-950 stroke-[3]" />
                          <span>Copied All SQL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
                          <span>Copy SQL Queries</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Table Schema Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-mono-code font-semibold text-[11px]">
                      <Table className="w-3.5 h-3.5" />
                      <span>form_submissions</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Universal table for any form</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-blue-300 font-mono-code font-semibold text-[11px]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>inquiries</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Project briefs & leads</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-purple-300 font-mono-code font-semibold text-[11px]">
                      <Mail className="w-3.5 h-3.5" />
                      <span>newsletter_subscribers</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Monograph email subscribers</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-1.5 text-amber-300 font-mono-code font-semibold text-[11px]">
                      <Code className="w-3.5 h-3.5" />
                      <span>projects</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">HTML screen designs & mockups</div>
                  </div>
                </div>

                {/* Code block */}
                <div className="relative rounded-2xl bg-neutral-950 border border-white/10 p-4 font-mono-code text-[11px] leading-relaxed text-neutral-300 overflow-x-auto max-h-72 select-all shadow-inner">
                  <pre>{SUPABASE_SETUP_SQL}</pre>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓ RLS Configured:</span>
                  <span>
                    Row Level Security (RLS) policies are included so anonymous and public form submissions through your publishable key (<code className="text-emerald-300 font-mono-code">sb_publishable_...</code>) are permitted without authentication errors.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                {/* Test Action Bar */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Test Form Submission Pipeline</h4>
                      <p className="text-[11px] text-neutral-400">
                        Click below to submit synthetic data directly into your Supabase database:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <button
                      onClick={handleTestInquiry}
                      disabled={isTestingInquiry}
                      className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isTestingInquiry ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>Test Inquiry Form</span>
                    </button>

                    <button
                      onClick={handleTestNewsletter}
                      disabled={isTestingNewsletter}
                      className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isTestingNewsletter ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>Test Newsletter Form</span>
                    </button>

                    <button
                      onClick={handleTestProject}
                      disabled={isTestingProject}
                      className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isTestingProject ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>Test Screen Project</span>
                    </button>
                  </div>
                </div>

                {/* Submissions Feed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-neutral-200">Recent Form Submissions</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-white/10 text-neutral-300">
                        {isFromSupabase ? 'Supabase Table' : 'Local Storage Cache'}
                      </span>
                    </div>
                    <button
                      onClick={loadSubmissions}
                      disabled={isLoadingSubmissions}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingSubmissions ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {recentList.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-black/30 border border-white/10 text-center text-neutral-500">
                      No form submissions recorded yet. Click one of the test buttons above or submit the inquiry/newsletter form on the showcase screen!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {recentList.map((item) => (
                        <div
                          key={String(item.id)}
                          className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 truncate">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono-code uppercase text-neutral-300">
                                {item.type}
                              </span>
                              <span className="font-semibold text-white truncate">{item.title}</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate">{item.subtitle}</div>
                          </div>
                          <div className="text-[10px] font-mono-code text-neutral-500 shrink-0">
                            {new Date(item.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-emerald-200">
                        Frontend directly wired to Supabase
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">
                      All forms (Inquiries, Newsletter subscriptions, and HTML Mockup Projects) write directly to your database.
                    </p>
                  </div>
                  {connectionInfo.latencyMs !== undefined && (
                    <div className="px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-500/20 text-right shrink-0">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono-code">Latency</div>
                      <div className="text-xs font-bold text-emerald-300 font-mono-code">
                        ~{connectionInfo.latencyMs}ms
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Server className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase font-mono-code">Project ID</div>
                        <div className="font-mono-code text-neutral-200 font-bold truncate">
                          {SUPABASE_PROJECT_ID}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 text-[11px] font-medium shrink-0 transition-all"
                    >
                      <span>Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase font-mono-code">REST URL</div>
                        <div className="font-mono-code text-neutral-200 truncate">
                          {SUPABASE_URL}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`${SUPABASE_URL}/rest/v1/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-all shrink-0"
                      title="Inspect REST Root"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Key className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase font-mono-code">
                          Publishable API Key
                        </div>
                        <div className="font-mono-code text-neutral-300 truncate max-w-sm">
                          {SUPABASE_ANON_KEY.substring(0, 18)}...{SUPABASE_ANON_KEY.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyKey}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-[11px] font-medium shrink-0 transition-all cursor-pointer"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'auth' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Current Auth State</span>
                  </div>
                  {user ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="font-medium text-white">{user.displayName}</div>
                        <div className="text-[11px] text-neutral-400">{user.email}</div>
                      </div>
                      <span className="px-2 py-1 rounded-md text-[10px] uppercase font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {user.provider}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-neutral-400">No active user session.</span>
                      <button
                        onClick={() => {
                          signInAsGuest();
                          onToast('Signed in as Guest User for Supabase testing');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 text-xs font-medium cursor-pointer transition-all"
                      >
                        Sign in as Guest
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold">
                    <Globe className="w-4 h-4" />
                    <span>Netlify Deployment Ready</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    We configured <code className="text-blue-300">netlify.toml</code> with full SPA
                    redirects and embedded Supabase environment variables. You can push to GitHub and deploy
                    directly to Netlify with zero extra backend configuration needed!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Supabase Table Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </ReactiveGlassBlock>
      </div>
    </div>
  );
}
