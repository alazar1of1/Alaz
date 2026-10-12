import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  FileText,
  CheckCircle2,
  Terminal,
  Code2,
} from 'lucide-react';
import { PortfolioProfile } from '../types/portfolio.ts';

interface HeroProps {
  profile: PortfolioProfile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const [imgError, setImgError] = useState(false);

  const heroImageSrc = imgError
    ? '/src/assets/images/developer_hero_portrait_1791549963661.jpg'
    : profile.avatarUrl || 'https://res.cloudinary.com/pzoad4gu/image/upload/v1791791935/main-sample.png';

  return (
    <section id="about" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/70 via-emerald-50/30 to-transparent dark:from-emerald-500/15 dark:via-emerald-600/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status kicker */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 font-medium">
                <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{profile.title || 'MERN Stack & Full-Stack Engineer'}</span>
              </span>
              {profile.availableForWork && (
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-500/80"></span>
                  <span>Available for New Projects</span>
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
              Building resilient web architectures with MongoDB, Express, React & Node.js
            </h1>

            {/* Personal Introduction */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-200 leading-relaxed max-w-2xl">
              {profile.shortBio ||
                "Hi, I'm Alazar.A. I build full-stack web applications, distributed cloud backends, and responsive React experiences. I turn complex database schemas into fast, accessible, and elegant digital products."}
            </p>

            {/* Direct Contact Info Strip */}
            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 dark:text-slate-300">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-slate-900 dark:text-white font-medium">{profile.email}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600/80 dark:text-emerald-500/80 shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-700/20 dark:shadow-emerald-950/60 transition-all flex items-center gap-2 border border-emerald-500/30"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 text-sm font-semibold text-slate-800 hover:text-emerald-700 bg-white hover:bg-emerald-50/70 border border-slate-300 shadow-xs dark:bg-[#0e1611] dark:text-white dark:border-emerald-900/80 dark:hover:bg-emerald-950/50 rounded-lg transition-all"
              >
                Contact Me
              </a>

              <a
                href={profile.resumeUrl || '#contact'}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Resume / CV</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center gap-4 border-t border-slate-200 dark:border-emerald-950/60">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Connect</span>
              <div className="flex items-center gap-3">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/70 dark:text-slate-300 dark:hover:text-white dark:border-emerald-900/60 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/70 dark:text-slate-300 dark:hover:text-white dark:border-emerald-900/60 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    href={profile.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/70 dark:text-slate-300 dark:hover:text-white dark:border-emerald-900/60 transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Architectural Framing */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Outer Glow / Frame */}
              <div className="relative rounded-2xl p-2 bg-white dark:bg-gradient-to-b dark:from-emerald-900/40 dark:via-[#0d1611] dark:to-[#080d0a] border border-emerald-100 dark:border-emerald-900/70 shadow-xl shadow-slate-200/60 dark:shadow-2xl">
                <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-[#070b09]">
                  <img
                    src={heroImageSrc}
                    alt={profile.name || 'Alazar.A'}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  {/* Subtle contrast gradient scrim at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent dark:from-[#060a08]/90 pointer-events-none" />

                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 dark:bg-[#0a120e]/95 backdrop-blur-md border border-slate-200/80 dark:border-emerald-900/80 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">Full-Stack MERN</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-300">MongoDB · Express · React · Node</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-emerald-500/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-emerald-500/30 dark:border-emerald-900/50 rounded-bl-xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Full-Width Key Metrics Strip Below Hero Split */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-emerald-950/70 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              0{profile.yearsOfExperience || 4}+
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Years Industry Experience</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {profile.completedProjects || 28}+
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Shipped Projects & APIs</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {profile.happyClients || 19}+
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Clients & Organizations</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              99.9%
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Production Code Reliability</div>
          </div>
        </div>
      </div>
    </section>
  );
};
