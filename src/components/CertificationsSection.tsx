import React from 'react';
import { Award, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';
import { CertificationItem } from '../types/portfolio.ts';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  return (
    <section id="certifications" className="py-20 border-t border-slate-200 dark:border-emerald-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono mb-2 font-medium">
            Verified Credentials & Accreditations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Certifications & Licenses
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Globally recognized technical credentials verifying cloud infrastructure, database modeling, and full-stack software development.
          </p>
        </div>

        {/* Certifications Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="group bg-white dark:bg-[#090e0b]/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-400/80 dark:hover:border-emerald-800/80 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="space-y-4">
                {/* Header with badge emblem */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-black border border-slate-200 dark:border-emerald-950 shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={cert.badgeUrl || '/src/assets/images/certificate_badge_cloud_1791549994768.jpg'}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Title & Issuer */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {cert.title}
                  </h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cert.issuer}</div>
                </div>

                {/* Metadata */}
                <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Issued</span>
                    <span className="text-slate-700 dark:text-slate-300">{cert.issueDate}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">Credential ID</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">{cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verifiable Link button */}
              {cert.link && (
                <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white border border-emerald-200 dark:border-emerald-900/60 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Verify Credential Authenticity</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
