import React, { useState } from 'react';
import { ExternalLink, Database, Server, Layout, Cloud, Wrench } from 'lucide-react';
import { SkillItem } from '../types/portfolio.ts';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Tools'];

  const filteredSkills =
    selectedCategory === 'all'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'frontend':
        return <Layout className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'backend':
        return <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'cloud & devops':
        return <Cloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-slate-200 dark:border-emerald-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono mb-2 font-medium">
              Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skills & Expertise
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-xl">
              Production-tested proficiencies with direct documentation and verification references.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0a0f0d] border border-slate-200 dark:border-emerald-950/80 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-950/40'
                }`}
              >
                {cat === 'all' ? 'All Skills' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="group bg-white dark:bg-[#090e0b]/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-400/80 dark:hover:border-emerald-800/80 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div>
                {/* Header with icon and category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400/80 font-medium">{skill.category}</div>
                </div>

                {/* Skill Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {skill.name}
                </h3>

                {/* Experience length and proficiency */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300 mt-2">
                  <span>{skill.yearsOfExp || '3+ yrs'}</span>
                  <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">{skill.proficiency}%</span>
                </div>

                {/* Proficiency Bar */}
                <div className="w-full bg-slate-100 dark:bg-[#050806] h-1.5 rounded-full overflow-hidden mt-2 border border-slate-200/70 dark:border-emerald-950">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(10, skill.proficiency))}%` }}
                  />
                </div>
              </div>

              {/* Direct Link to Documentation / Proof */}
              {skill.link && (
                <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Official Reference</span>
                  <a
                    href={skill.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    title={`View ${skill.name} documentation / reference`}
                  >
                    <span>View Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
