import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProjectsGallery } from './components/ProjectsGallery.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { CertificationsSection } from './components/CertificationsSection.tsx';
import { ContactForm } from './components/ContactForm.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { api } from './services/api.ts';
import { PortfolioData, DatabaseStatus } from './types/portfolio.ts';

// Initial fallback data for immediate zero-latency render while API loads
const INITIAL_DATA: PortfolioData = {
  profile: {
    name: 'Alazar.A',
    title: 'Full-Stack Developer & MERN Engineer',
    shortBio:
      'Dedicated Full-Stack Software Engineer specializing in modern MERN architecture, distributed cloud backends, and responsive React web experiences. Passionate about writing scalable TypeScript, high-throughput APIs, and intuitive user interfaces.',
    fullBio:
      'With over 4 years of engineering experience across high-growth startups and modern web solutions, I build end-to-end applications from MongoDB data modeling to interactive React client applications.',
    avatarUrl: '/src/assets/images/developer_hero_portrait_17915499636610.jpg',
    email: 'alazar1of1@gmail.com',
    phone: '0992837336',
    location: 'Tepi, Ethiopia',
    availableForWork: true,
    githubUrl: 'https://github.com/Alazar1of1',
    linkedinUrl: 'https://www.linkedin.com/in/alazar-agumas-643b11433/?isSelfProfile=true',
    twitterUrl: 'https://twitter.com',
    resumeUrl: '#contact',
    yearsOfExperience: 4,
    completedProjects: 28,
    happyClients: 19,
  },
  projects: [],
  experiences: [],
  skills: [],
  certifications: [],
};

function MainPortfolio() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [portfolioRes, statusRes] = await Promise.all([
        api.getPortfolio(),
        api.getDatabaseStatus(),
      ]);
      setData(portfolioRes);
      setDbStatus(statusRes);
    } catch (err) {
      console.warn('API sync warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060a08] dark:text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-200 transition-colors duration-200"
    >
      <Navbar profile={data.profile} />

      <main className="flex-1">
        <Hero profile={data.profile} />
        <ProjectsGallery projects={data.projects} />
        <ExperienceSection experiences={data.experiences} />
        <SkillsSection skills={data.skills} />
        <CertificationsSection certifications={data.certifications} />
        <ContactForm profile={data.profile} />
      </main>

      <Footer dbStatus={dbStatus} onOpenAdmin={() => setAdminOpen(true)} />

      {/* Admin Dashboard / CMS Overlay */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          onDataUpdated={loadData}
          currentData={data}
          dbStatus={dbStatus}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainPortfolio />
      </AuthProvider>
    </ThemeProvider>
  );
}
