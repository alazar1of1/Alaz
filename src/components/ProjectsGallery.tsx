import React, { useState } from 'react';
import { ExternalLink, Github, Layers, X, Calendar, Database, Sparkles } from 'lucide-react';
import { ProjectItem } from '../types/portfolio.ts';

interface ProjectsGalleryProps {
  projects: ProjectItem[];
}

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="projects" className="py-20 border-t border-slate-200 dark:border-emerald-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono mb-2 font-medium">
              Portfolio & Engineering Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Projects & Systems
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-xl">
              Scalable web architectures, enterprise dashboards, and real-time APIs built with the MERN stack.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0a0f0d] border border-slate-200 dark:border-emerald-950/80 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-950/40'
                }`}
              >
                {cat === 'all' ? 'All Works' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project._id}
              className="group flex flex-col bg-white dark:bg-[#090e0b]/80 rounded-2xl border border-slate-200/90 dark:border-emerald-950/80 overflow-hidden hover:border-emerald-400/80 dark:hover:border-emerald-800/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] transition-all duration-300 shadow-xs hover:shadow-lg dark:hover:shadow-none"
            >
              {/* Media Container */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-black cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.imageUrl || '/src/assets/images/project_ecommerce_platform_1791549974827.jpg'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#090e0b] via-transparent to-transparent pointer-events-none" />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-900/90 text-xs font-medium text-white border border-emerald-600 shadow-md">
                    Click for Case Study
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.completionDate || '2026'}</span>
                    {project.featured && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-600 dark:text-amber-300 font-medium">Featured</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies List */}
                <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/70 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-300">
                    {project.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors font-medium">
                          {tech}
                        </span>
                        {idx < project.technologies.length - 1 && (
                          <span className="text-slate-300 dark:text-emerald-800">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Deep Dive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors p-1"
                          title="View Source Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors p-1"
                          title="Visit Live Application"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#0a0f0d]/60 rounded-2xl border border-slate-200 dark:border-emerald-950">
            <Layers className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No projects found in this category</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch to another category or reset filters.</p>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white dark:bg-[#090e0b] border border-slate-200 dark:border-emerald-900/80 rounded-2xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Media */}
            <div className="relative aspect-video w-full bg-slate-900">
              <img
                src={selectedProject.imageUrl || '/src/assets/images/project_ecommerce_platform_1791549974827.jpg'}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 dark:from-[#090e0b] via-transparent to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 text-xs text-slate-200 mb-1">
                  <span className="text-emerald-400 font-bold">{selectedProject.category}</span>
                  <span>·</span>
                  <span>{selectedProject.completionDate || '2026'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Metrics highlight */}
              {selectedProject.metrics && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Key Result: {selectedProject.metrics}</span>
                </div>
              )}

              {/* Deep Dive Prose */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Overview & Architecture</h4>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Technologies & Modules</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-emerald-950/70 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>Open Live Application</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#0e1611] dark:hover:bg-emerald-950/50 border border-slate-300 dark:border-emerald-900/80 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View GitHub Repo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
