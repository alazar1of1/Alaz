import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react';
import { PortfolioProfile } from '../types/portfolio.ts';
import { api } from '../services/api.ts';

interface ContactFormProps {
  profile: PortfolioProfile;
}

export const ContactForm: React.FC<ContactFormProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    try {
      setStatus('sending');
      setErrorMessage('');
      await api.submitContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-200 dark:border-emerald-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono mb-2 font-medium">
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Let's Build Something Exceptional Together
              </h2>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you have an upcoming project, need architectural consulting for high-throughput MERN systems, or are looking to hire a senior engineer—drop me a line.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#090e0b]/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-400/80 dark:hover:border-emerald-800/80 transition-all duration-200 group shadow-xs hover:shadow-md dark:shadow-none"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Direct Email</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 truncate">
                    {profile.email}
                  </div>
                </div>
              </a>

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#090e0b]/80 hover:bg-emerald-50/20 dark:hover:bg-[#0c140f] border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-400/80 dark:hover:border-emerald-800/80 transition-all duration-200 group shadow-xs hover:shadow-md dark:shadow-none"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Phone & WhatsApp</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 truncate">
                      {profile.phone}
                    </div>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#090e0b]/80 border border-slate-200/90 dark:border-emerald-950/80 shadow-xs dark:shadow-none">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Location</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.location}</div>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0a0f0d] border border-slate-200 dark:border-emerald-950/80 text-xs text-slate-600 dark:text-slate-300 shadow-xs dark:shadow-none">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Fast Response Guarantee:</span> I typically reply within 24 business hours. Messages are dispatched immediately into my real-time inbox.
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#090e0b]/90 border border-slate-200/90 dark:border-emerald-950/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 dark:shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send a Message</h3>
              </div>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400/90">
                      Thank you for reaching out. Your inquiry has been saved to the database, and I will be in touch shortly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-3 text-xs underline font-medium hover:text-emerald-900 dark:hover:text-white cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-sm block">Submission Notice</span>
                    {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-black/70 border border-slate-300 dark:border-emerald-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/90 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-black/70 border border-slate-300 dark:border-emerald-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/90 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject or Inquiry Type
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. MERN Stack Project Consultation / Full-Time Role"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-black/70 border border-slate-300 dark:border-emerald-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/90 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project scope, goals, or timeline..."
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-black/70 border border-slate-300 dark:border-emerald-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/90 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto px-7 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 dark:shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Dispatching Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inbound Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
