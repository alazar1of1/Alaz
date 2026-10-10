import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LogOut,
  X,
  MessageSquare,
  FolderGit2,
  Briefcase,
  Wrench,
  Award,
  User,
  Database,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  ExternalLink,
  Mail,
  RefreshCw,
  Sparkles,
  Link,
  Save,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  PortfolioData,
  PortfolioProfile,
  ProjectItem,
  ExperienceItem,
  SkillItem,
  CertificationItem,
  ContactMessage,
  DatabaseStatus,
} from '../types/portfolio.ts';

interface AdminDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
  currentData: PortfolioData;
  dbStatus: DatabaseStatus | null;
}

type TabType =
  | 'overview'
  | 'messages'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'profile'
  | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onDataUpdated,
  currentData,
  dbStatus: initialDbStatus,
}) => {
  const { isAdmin, token, login, logout } = useAuth();

  // Login form state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Database status state
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(initialDbStatus);
  const [atlasUriInput, setAtlasUriInput] = useState('');
  const [atlasConnecting, setAtlasConnecting] = useState(false);
  const [atlasFeedback, setAtlasFeedback] = useState<{ success?: boolean; text?: string } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<PortfolioProfile>(currentData.profile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Modal forms for adding/editing items
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<ExperienceItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Load messages when tab is active
  useEffect(() => {
    if (isAdmin && token) {
      loadMessages();
      loadDbStatus();
    }
  }, [isAdmin, token]);

  const loadMessages = async () => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const msgs = await api.getMessages(token);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadDbStatus = async () => {
    try {
      const status = await api.getDatabaseStatus();
      setDbStatus(status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const success = await login(loginPassword);
      if (!success) {
        setLoginError('Invalid password. Please try again.');
      }
    } catch {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // --- Atlas Connection Handler ---
  const handleConnectAtlas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !atlasUriInput.trim()) return;
    setAtlasConnecting(true);
    setAtlasFeedback(null);
    try {
      const res = await api.connectAtlas(token, atlasUriInput.trim());
      setAtlasFeedback({ success: true, text: res.message || 'Connected to MongoDB Atlas!' });
      loadDbStatus();
      onDataUpdated();
    } catch (err: any) {
      setAtlasFeedback({ success: false, text: err.message || 'Failed to connect to MongoDB Atlas.' });
    } finally {
      setAtlasConnecting(false);
    }
  };

  // --- Messages Actions ---
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    if (!token) return;
    try {
      const updated = await api.markMessageRead(token, id, !currentRead);
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!token || !window.confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(token, id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Profile Save ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    try {
      await api.updateProfile(token, profileForm);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Project Save / Delete ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;
    setIsSavingItem(true);
    try {
      const techs = Array.isArray(editingProject.technologies)
        ? editingProject.technologies
        : typeof (editingProject as any).technologies === 'string'
        ? ((editingProject as any).technologies as string).split(',').map((t: string) => t.trim())
        : ['MERN', 'React', 'Node.js'];

      const payload = {
        title: editingProject.title || 'Untitled Project',
        slug: editingProject.slug || 'project-' + Date.now(),
        category: editingProject.category || 'MERN Stack',
        description: editingProject.description || '',
        longDescription: editingProject.longDescription || editingProject.description || '',
        imageUrl: editingProject.imageUrl || '/src/assets/images/project_ecommerce_platform_1791549974827.jpg',
        technologies: techs,
        demoUrl: editingProject.demoUrl || '',
        githubUrl: editingProject.githubUrl || '',
        featured: !!editingProject.featured,
        completionDate: editingProject.completionDate || '2026',
        metrics: editingProject.metrics || '',
        order: editingProject.order || currentData.projects.length + 1,
      };

      if (editingProject._id) {
        await api.updateProject(token, editingProject._id, payload);
      } else {
        await api.createProject(token, payload);
      }

      setEditingProject(null);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!token || !window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(token, id);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Experience Save / Delete ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingExperience) return;
    setIsSavingItem(true);
    try {
      const achievements = Array.isArray(editingExperience.achievements)
        ? editingExperience.achievements
        : typeof (editingExperience as any).achievements === 'string'
        ? ((editingExperience as any).achievements as string).split('\n').filter((a: string) => a.trim().length > 0)
        : [];

      const techs = Array.isArray(editingExperience.technologies)
        ? editingExperience.technologies
        : typeof (editingExperience as any).technologies === 'string'
        ? ((editingExperience as any).technologies as string).split(',').map((t: string) => t.trim())
        : [];

      const payload = {
        role: editingExperience.role || 'Full-Stack Developer',
        company: editingExperience.company || 'Tech Company',
        period: editingExperience.period || '2024 - Present',
        location: editingExperience.location || 'Remote',
        description: editingExperience.description || '',
        achievements,
        link: editingExperience.link || '',
        technologies: techs,
        order: editingExperience.order || currentData.experiences.length + 1,
      };

      if (editingExperience._id) {
        await api.updateExperience(token, editingExperience._id, payload);
      } else {
        await api.createExperience(token, payload);
      }

      setEditingExperience(null);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!token || !window.confirm('Delete this experience record?')) return;
    try {
      await api.deleteExperience(token, id);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Skill Save / Delete ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingSkill) return;
    setIsSavingItem(true);
    try {
      const payload = {
        name: editingSkill.name || 'Skill Name',
        category: (editingSkill.category as any) || 'Frontend',
        proficiency: Number(editingSkill.proficiency) || 90,
        yearsOfExp: editingSkill.yearsOfExp || '3+ yrs',
        link: editingSkill.link || '',
        order: editingSkill.order || currentData.skills.length + 1,
      };

      if (editingSkill._id) {
        await api.updateSkill(token, editingSkill._id, payload);
      } else {
        await api.createSkill(token, payload);
      }

      setEditingSkill(null);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!token || !window.confirm('Delete this skill?')) return;
    try {
      await api.deleteSkill(token, id);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Certification Save / Delete ---
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingCert) return;
    setIsSavingItem(true);
    try {
      const payload = {
        title: editingCert.title || 'Certification Title',
        issuer: editingCert.issuer || 'Issuing Authority',
        issueDate: editingCert.issueDate || '2024',
        credentialId: editingCert.credentialId || '',
        link: editingCert.link || '',
        badgeUrl: editingCert.badgeUrl || '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
        order: editingCert.order || currentData.certifications.length + 1,
      };

      if (editingCert._id) {
        await api.updateCertification(token, editingCert._id, payload);
      } else {
        await api.createCertification(token, payload);
      }

      setEditingCert(null);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!token || !window.confirm('Delete this certification?')) return;
    try {
      await api.deleteCertification(token, id);
      onDataUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // --- If NOT Logged In, Render Admin Login Screen ---
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-white dark:bg-[#0a0f0d] border border-slate-200 dark:border-emerald-900/60 rounded-2xl p-8 shadow-2xl text-slate-900 dark:text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Secure administrative access to edit projects, experiences, skills, certifications, and messages.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-black/70 border border-slate-300 dark:border-emerald-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 dark:shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Unread messages count
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b09] flex flex-col overflow-hidden text-slate-100">
      {/* Top Bar Contract */}
      <header className="h-16 border-b border-emerald-950/80 bg-[#0a0f0d] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Portfolio CMS & Control Center</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MERN Stack
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-900/60">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dbStatus?.connected ? 'Atlas: Connected' : 'MERN Store: Ready'}</span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-[#0e1611] hover:bg-emerald-950/50 border border-emerald-900/60 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Return to Public View"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close CMS</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar Tabs + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-56 md:w-64 border-r border-emerald-950/80 bg-[#070b09] flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'messages'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'projects'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects ({currentData.projects.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'experience'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Experience ({currentData.experiences.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'skills'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4" />
                <span>Skills ({currentData.skills.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'certifications'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>Certifications ({currentData.certifications.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Hero & Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeTab === 'database'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>MongoDB Atlas Setup</span>
              </div>
            </button>
          </div>

          <div className="p-4 border-t border-emerald-950/80 text-[11px] text-slate-400">
            Real-time CMS · Changes reflect instantly on the public website.
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#050806]">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage all portfolio content, monitor incoming messages, and configure MongoDB Atlas.
                </p>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-[#090e0b]/80 border border-emerald-950/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Inbound Messages</span>
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                    {messages.length}
                  </div>
                  <div className="text-[11px] text-amber-400 mt-1">
                    {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#090e0b]/80 border border-emerald-950/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Projects Published</span>
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                    {currentData.projects.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {currentData.projects.filter((p) => p.featured).length} featured
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#090e0b]/80 border border-emerald-950/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Skills Documented</span>
                    <Wrench className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                    {currentData.skills.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Across 5 tech domains</div>
                </div>

                <div className="p-5 rounded-xl bg-[#090e0b]/80 border border-emerald-950/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Verified Certifications</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                    {currentData.certifications.length}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% credential verified</div>
                </div>
              </div>

              {/* Atlas Integration Status Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a0f0d] to-emerald-950/30 border border-emerald-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Database Storage Status</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 max-w-xl">
                    {dbStatus?.message}
                  </p>
                  {dbStatus?.atlasUriMasked && (
                    <p className="text-[11px] font-mono text-emerald-300 mt-1">
                      Atlas Cluster: {dbStatus.atlasUriMasked}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('database')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shrink-0"
                >
                  Configure MongoDB Atlas
                </button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Quick Management Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        slug: '',
                        category: 'MERN Stack',
                        description: '',
                        longDescription: '',
                        imageUrl: '/src/assets/images/project_ecommerce_platform_1791549974827.jpg',
                        technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
                        demoUrl: 'https://',
                        githubUrl: 'https://github.com',
                        featured: true,
                        completionDate: '2026',
                        metrics: '',
                      });
                      setActiveTab('projects');
                    }}
                    className="p-4 rounded-xl bg-[#090e0b]/80 hover:bg-[#0c140f] border border-emerald-950/80 text-left transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Add New Project</div>
                      <div className="text-[11px] text-slate-400">Post case study to gallery</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingExperience({
                        role: '',
                        company: '',
                        period: '2025 - Present',
                        location: 'Remote',
                        description: '',
                        achievements: [],
                        link: 'https://',
                        technologies: ['React', 'Node.js'],
                      });
                      setActiveTab('experience');
                    }}
                    className="p-4 rounded-xl bg-[#090e0b]/80 hover:bg-[#0c140f] border border-emerald-950/80 text-left transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Add Career Experience</div>
                      <div className="text-[11px] text-slate-400">Add role & company link</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingCert({
                        title: '',
                        issuer: '',
                        issueDate: '2026',
                        credentialId: '',
                        link: 'https://',
                        badgeUrl: '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
                      });
                      setActiveTab('certifications');
                    }}
                    className="p-4 rounded-xl bg-[#090e0b]/80 hover:bg-[#0c140f] border border-emerald-950/80 text-left transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Add Certification</div>
                      <div className="text-[11px] text-slate-400">Include verification link</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Contact Inquiries ({messages.length})</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Messages submitted through the public contact form stored in the database.
                  </p>
                </div>
                <button
                  onClick={loadMessages}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingMessages ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No contact submissions yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Messages sent from the portfolio contact form will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-5 rounded-xl border transition-all ${
                        msg.read
                          ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                          : 'bg-slate-900/80 border-indigo-500/40 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {!msg.read && (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          <span className="text-xs text-slate-400">({msg.email})</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-indigo-300 mb-1">
                        Subject: {msg.subject}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        {msg.message}
                      </p>

                      <div className="pt-3 flex items-center justify-between gap-4 mt-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMessageRead(msg._id, msg.read)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                          >
                            {msg.read ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Projects Manager</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, and organize projects showcased in the responsive portfolio gallery.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingProject({
                      title: '',
                      slug: '',
                      category: 'MERN Stack',
                      description: '',
                      longDescription: '',
                      imageUrl: '/src/assets/images/project_ecommerce_platform_1791549974827.jpg',
                      technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
                      demoUrl: 'https://',
                      githubUrl: 'https://github.com',
                      featured: true,
                      completionDate: '2026',
                      metrics: '',
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {currentData.projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                        <img
                          src={proj.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                          {proj.category}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{proj.title}</h4>
                      </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Experience Details</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage career milestones and direct organization/project verification links.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingExperience({
                      role: '',
                      company: '',
                      period: '2024 - Present',
                      location: 'Remote',
                      description: '',
                      achievements: [],
                      link: 'https://',
                      technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Experience list */}
              <div className="space-y-3">
                {currentData.experiences.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{exp.role}</h4>
                          <span className="text-xs font-semibold text-indigo-400">@ {exp.company}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {exp.period} · {exp.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingExperience(exp)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp._id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                    {exp.link && (
                      <div className="text-xs font-mono text-indigo-400 flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        <span className="text-slate-500">Verified Link:</span>
                        <a href={exp.link} target="_blank" rel="noreferrer" className="hover:underline">
                          {exp.link}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Skills & Documentation Links</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage technical capabilities, proficiency percentages, and documentation references.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingSkill({
                      name: '',
                      category: 'Frontend',
                      proficiency: 90,
                      yearsOfExp: '3+ yrs',
                      link: 'https://',
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentData.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400">{skill.category}</span>
                        <span className="text-xs font-mono tabular-nums text-slate-300">{skill.proficiency}%</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{skill.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Experience: {skill.yearsOfExp}</p>
                    </div>

                    {skill.link && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <Link className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{skill.link}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingSkill(skill)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill._id)}
                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Certifications & Credential Links</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add certificates with issuer, credential ID, badge imagery, and verification links.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingCert({
                      title: '',
                      issuer: '',
                      issueDate: '2025',
                      credentialId: '',
                      link: 'https://',
                      badgeUrl: '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>

              {/* Certifications list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.certifications.map((cert) => (
                  <div
                    key={cert._id}
                    className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800 p-1 flex items-center justify-center">
                        <img
                          src={cert.badgeUrl}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                        <div className="text-xs text-emerald-400 mt-0.5">{cert.issuer} · {cert.issueDate}</div>
                        {cert.credentialId && (
                          <div className="text-[11px] font-mono text-slate-400 mt-1">
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>

                    {cert.link && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate pt-1">
                        <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">Verify: {cert.link}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert._id)}
                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE & HERO SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Hero & Profile Settings</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the hero portrait image URL, personal intro, contact details, and social links.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Profile updated successfully! Live page has been synchronized.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Headline / Role Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hero Section Image URL (Your Custom Photo / Portrait)
                  </label>
                  <input
                    type="text"
                    value={profileForm.avatarUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    placeholder="https://your-domain.com/my-photo.jpg or /src/assets/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    You can paste any custom portrait URL, or use the generated developer portrait.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Brief Personal Introduction (Hero)</label>
                  <textarea
                    rows={3}
                    value={profileForm.shortBio}
                    onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Resume / CV Link</label>
                    <input
                      type="text"
                      value={profileForm.resumeUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Years of Exp</label>
                    <input
                      type="number"
                      value={profileForm.yearsOfExperience}
                      onChange={(e) => setProfileForm({ ...profileForm, yearsOfExperience: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Projects Shipped</label>
                    <input
                      type="number"
                      value={profileForm.completedProjects}
                      onChange={(e) => setProfileForm({ ...profileForm, completedProjects: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Happy Clients</label>
                    <input
                      type="number"
                      value={profileForm.happyClients}
                      onChange={(e) => setProfileForm({ ...profileForm, happyClients: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: DATABASE / MONGODB ATLAS */}
          {activeTab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white">MongoDB Atlas Setup</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your live MongoDB Atlas cloud database cluster or monitor the current persistent MERN store.
                </p>
              </div>

              {/* Status Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {dbStatus?.connected
                          ? 'Connected to MongoDB Atlas'
                          : 'Persistent Store Active (Atlas Ready)'}
                      </h4>
                      <p className="text-xs text-slate-400">{dbStatus?.message}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300">
                    Mode: {dbStatus?.mode}
                  </span>
                </div>

                {dbStatus?.atlasUriMasked && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    Active Connection: {dbStatus.atlasUriMasked}
                  </div>
                )}
              </div>

              {/* Connection Form */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">Connect / Switch MongoDB Atlas Cluster</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your standard MongoDB Atlas URI connection string (from Atlas dashboard &gt; Database &gt; Connect &gt; Drivers). The server will ping the cluster, verify connectivity, and seamlessly sync your portfolio documents!
                </p>

                {atlasFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      atlasFeedback.success
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/10 border border-red-500/20 text-red-300'
                    }`}
                  >
                    {atlasFeedback.success ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>{atlasFeedback.text}</span>
                  </div>
                )}

                <form onSubmit={handleConnectAtlas} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      MongoDB Atlas Connection String
                    </label>
                    <input
                      type="text"
                      value={atlasUriInput}
                      onChange={(e) => setAtlasUriInput(e.target.value)}
                      placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={atlasConnecting || !atlasUriInput.trim()}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {atlasConnecting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Test & Connect MongoDB Atlas</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EDIT/ADD PROJECT */}
      {editingProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border border-slate-700 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingProject._id ? 'Edit Project' : 'Create New Project'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editingProject.category || 'MERN Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="React & Frontend">React & Frontend</option>
                    <option value="Node & APIs">Node & APIs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Summary</label>
                <input
                  type="text"
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Case Study</label>
                <textarea
                  rows={4}
                  value={editingProject.longDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Key Result / Metrics</label>
                  <input
                    type="text"
                    value={editingProject.metrics || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                    placeholder="e.g. +350% throughput, 12k users"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Live Application URL</label>
                  <input
                    type="text"
                    value={editingProject.demoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingProject.technologies)
                      ? editingProject.technologies.join(', ')
                      : (editingProject.technologies as any) || ''
                  }
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={!!editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300">
                  Feature this project prominently on the homepage
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isSavingItem ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD EXPERIENCE */}
      {editingExperience && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0e1017] border border-slate-700 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => setEditingExperience(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingExperience._id ? 'Edit Experience' : 'Add Experience Record'}
            </h3>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role / Position Title</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.role || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.company || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Period (e.g. 2024 - Present)</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.period || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExperience.location || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Organization / Verifiable Link (include link for experience)
                </label>
                <input
                  type="text"
                  value={editingExperience.link || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, link: e.target.value })}
                  placeholder="https://company.com or https://project.dev"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={editingExperience.description || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Achievements (one per line)
                </label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(editingExperience.achievements)
                      ? editingExperience.achievements.join('\n')
                      : (editingExperience.achievements as any) || ''
                  }
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      achievements: e.target.value.split('\n').filter((x) => x.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingExperience(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isSavingItem ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD SKILL */}
      {editingSkill && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0e1017] border border-slate-700 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => setEditingSkill(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingSkill._id ? 'Edit Skill' : 'Add Technical Skill'}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. MongoDB Atlas, React, Node.js"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={editingSkill.category || 'Frontend'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Proficiency % (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingSkill.proficiency || 90}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Experience Years</label>
                  <input
                    type="text"
                    value={editingSkill.yearsOfExp || '3+ yrs'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, yearsOfExp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Documentation / Verification Link (include link for skills)
                </label>
                <input
                  type="text"
                  value={editingSkill.link || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, link: e.target.value })}
                  placeholder="https://react.dev or official documentation URL"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isSavingItem ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD CERTIFICATION */}
      {editingCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0e1017] border border-slate-700 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => setEditingCert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingCert._id ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Certification Title</label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="e.g. MongoDB Certified Developer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g. MongoDB University / AWS"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Issue Date / Year</label>
                  <input
                    type="text"
                    value={editingCert.issueDate || '2025'}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Credential ID (Optional)</label>
                <input
                  type="text"
                  value={editingCert.credentialId || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                  placeholder="e.g. MDB-DEV-892401"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Credential Verification Link (include link for certifications)
                </label>
                <input
                  type="text"
                  value={editingCert.link || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, link: e.target.value })}
                  placeholder="https://learn.mongodb.com/c/verify..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Badge Image URL</label>
                <input
                  type="text"
                  value={editingCert.badgeUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, badgeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isSavingItem ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
