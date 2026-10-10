import React from 'react';
import { Briefcase, ExternalLink, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '../types/portfolio.ts';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 border-t border-slate-200 dark:border-emerald-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono mb-2 font-medium">
            Career Timeline & Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work Experience
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            A track record of engineering leadership, scalable systems design, and full-stack product deliveries.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative border-l border-slate-200 dark:border-emerald-950/80 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-12">
          {experiences.map((exp, index) => (
            <div key={exp._id || index} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#070b09] border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-500/50" />

              <div className="bg-white dark:bg-[#090e0b]/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-400/80 dark:hover:border-emerald-800/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-xs hover:shadow-md dark:shadow-none">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                      <span>{exp.role}</span>
                    </h3>
                    <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mt-0.5">
                      <span>{exp.company}</span>
                      {exp.link && (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 transition-colors"
                          title="Verify Experience & Organization"
                        >
                          <span>(Visit Organization)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/70" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/70" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-200 leading-relaxed mb-5">
                  {exp.description}
                </p>

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                      Key Contributions & Engineering Milestones:
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer Tech Stack and Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {exp.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-mono rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Organization Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
