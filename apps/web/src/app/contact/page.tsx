'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-uh-bg-bright">
      {/* Header */}
      <header className="border-b border-uh-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <BrandLogo variant="dark" size="md" href="/" />
          <Link
            href="/login"
            className="text-sm font-medium text-uh-teal hover:text-uh-teal-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-uh-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-uh-slate-600 max-w-2xl mx-auto">
            Have questions about The Unified Health? We're here to help.
            Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-uh-teal/5 to-uh-cyan/5 rounded-2xl p-6 border border-uh-teal/10">
              <h2 className="text-lg font-semibold text-uh-slate-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-uh-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-uh-slate-900">Email</p>
                    <a href="mailto:support@theunifiedhealth.com" className="text-uh-teal hover:underline">
                      support@theunifiedhealth.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-uh-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-uh-slate-900">Phone</p>
                    <a href="tel:+18008643433" className="text-uh-slate-600">
                      1-800-UNIFIED (1-800-864-3433)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-uh-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-uh-slate-900">Address</p>
                    <p className="text-uh-slate-600">
                      123 Healthcare Blvd<br />
                      Suite 500<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-uh-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-uh-slate-900">Support Hours</p>
                    <p className="text-uh-slate-600">
                      24/7 for urgent issues<br />
                      Mon-Fri 9AM-6PM PT for general inquiries
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-uh-slate-50 rounded-2xl p-6">
              <h3 className="font-semibold text-uh-slate-900 mb-3">For Healthcare Providers</h3>
              <p className="text-sm text-uh-slate-600 mb-4">
                Interested in partnering with The Unified Health? Contact our provider relations team.
              </p>
              <a
                href="mailto:providers@theunifiedhealth.com"
                className="text-sm font-medium text-uh-teal hover:underline"
              >
                providers@theunifiedhealth.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-uh-slate-200 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-uh-teal/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-uh-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-uh-slate-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="text-uh-teal hover:underline font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-uh-slate-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-uh-slate-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-uh-slate-300 rounded-xl focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-uh-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-uh-slate-300 rounded-xl focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-uh-slate-700 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        required
                        value={formState.subject}
                        onChange={(e) => setFormState(s => ({ ...s, subject: e.target.value }))}
                        className="w-full px-4 py-3 border border-uh-slate-300 rounded-xl focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-colors"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-uh-slate-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formState.message}
                        onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="w-full px-4 py-3 border border-uh-slate-300 rounded-xl focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-colors resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-3 px-6 bg-gradient-to-r from-uh-teal to-uh-cyan text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all",
                        isSubmitting && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-uh-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-uh-slate-500">
              &copy; 2026 The Unified Health. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
