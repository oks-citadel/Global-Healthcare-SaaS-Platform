'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-uh-bg-bright">
      {/* Header */}
      <header className="border-b border-uh-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-uh-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-uh-slate-500 mb-8">Last updated: January 2, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">1. Introduction</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              The Unified Health ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our healthcare platform and services.
            </p>
            <p className="text-uh-slate-600 leading-relaxed">
              We comply with the Health Insurance Portability and Accountability Act (HIPAA),
              the General Data Protection Regulation (GDPR), and other applicable privacy laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-uh-slate-800 mb-3">Personal Health Information (PHI)</h3>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2 mb-4">
              <li>Medical history and health records</li>
              <li>Prescription information</li>
              <li>Lab results and diagnostic data</li>
              <li>Treatment plans and clinical notes</li>
              <li>Insurance and billing information</li>
            </ul>

            <h3 className="text-lg font-medium text-uh-slate-800 mb-3">Account Information</h3>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Name, email address, and contact details</li>
              <li>Date of birth and demographic information</li>
              <li>Login credentials (securely encrypted)</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Provide healthcare services and coordinate care</li>
              <li>Process appointments and telemedicine consultations</li>
              <li>Send appointment reminders and health notifications</li>
              <li>Process payments and insurance claims</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">4. Data Security</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>256-bit AES encryption for data at rest and in transit</li>
              <li>Multi-factor authentication for account access</li>
              <li>Regular security audits and penetration testing</li>
              <li>SOC 2 Type II certified infrastructure</li>
              <li>Automatic session timeouts and secure logout</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">5. Your Rights</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Access and receive a copy of your health records</li>
              <li>Request corrections to your information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Restrict certain uses of your information</li>
              <li>Data portability (receive your data in a standard format)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">6. Contact Us</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              For privacy-related inquiries or to exercise your rights, contact our Privacy Officer:
            </p>
            <div className="bg-uh-slate-50 rounded-xl p-6">
              <p className="text-uh-slate-700 mb-2">
                <strong>Email:</strong> privacy@theunifiedhealth.com
              </p>
              <p className="text-uh-slate-700 mb-2">
                <strong>Phone:</strong> 1-800-UNIFIED (1-800-864-3433)
              </p>
              <p className="text-uh-slate-700">
                <strong>Address:</strong> The Unified Health, Privacy Office, 123 Healthcare Blvd, Suite 500, San Francisco, CA 94105
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-uh-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-uh-slate-500">
              &copy; 2026 The Unified Health. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
