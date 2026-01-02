'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-uh-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-uh-slate-500 mb-8">Last updated: January 2, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              By accessing or using The Unified Health platform ("Service"), you agree to be bound
              by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not
              use the Service.
            </p>
            <p className="text-uh-slate-600 leading-relaxed">
              These Terms apply to all users of the Service, including patients, healthcare providers,
              administrators, and any other users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              The Unified Health provides a comprehensive healthcare management platform that includes:
            </p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Electronic health records management</li>
              <li>Appointment scheduling and management</li>
              <li>Telemedicine and video consultations</li>
              <li>Prescription management and pharmacy integration</li>
              <li>Billing and insurance processing</li>
              <li>Secure messaging between patients and providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">3. User Accounts</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">4. Medical Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
              <p className="text-amber-800 leading-relaxed">
                <strong>Important:</strong> The Service is not a substitute for professional medical advice,
                diagnosis, or treatment. Always seek the advice of your physician or other qualified
                health provider with any questions you may have regarding a medical condition. Never
                disregard professional medical advice or delay in seeking it because of something you
                have read or accessed through this Service.
              </p>
            </div>
            <p className="text-uh-slate-600 leading-relaxed">
              In case of a medical emergency, call your local emergency services immediately.
              The Unified Health is not an emergency service provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">5. Privacy and Data Protection</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">
              Your use of the Service is also governed by our Privacy Policy. By using the Service,
              you consent to the collection and use of your information as described in our
              <Link href="/privacy" className="text-uh-teal hover:underline"> Privacy Policy</Link>.
            </p>
            <p className="text-uh-slate-600 leading-relaxed">
              We comply with HIPAA, GDPR, and other applicable healthcare privacy regulations
              to protect your personal health information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">6. Prohibited Uses</h2>
            <p className="text-uh-slate-600 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-uh-slate-600 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service to transmit viruses or malicious code</li>
              <li>Impersonate any person or entity</li>
              <li>Collect information about other users without consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">7. Intellectual Property</h2>
            <p className="text-uh-slate-600 leading-relaxed">
              The Service and its original content, features, and functionality are owned by
              The Unified Health and are protected by international copyright, trademark, patent,
              trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-uh-slate-600 leading-relaxed">
              To the maximum extent permitted by law, The Unified Health shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, or any loss
              of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">9. Changes to Terms</h2>
            <p className="text-uh-slate-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any
              material changes by posting the updated Terms on this page and updating the
              "Last updated" date. Your continued use of the Service after such changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-uh-slate-900 mb-4">10. Contact Information</h2>
            <div className="bg-uh-slate-50 rounded-xl p-6">
              <p className="text-uh-slate-700 mb-2">
                <strong>Email:</strong> legal@theunifiedhealth.com
              </p>
              <p className="text-uh-slate-700 mb-2">
                <strong>Phone:</strong> 1-800-UNIFIED (1-800-864-3433)
              </p>
              <p className="text-uh-slate-700">
                <strong>Address:</strong> The Unified Health, Legal Department, 123 Healthcare Blvd, Suite 500, San Francisco, CA 94105
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
              <Link href="/privacy" className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors">
                Privacy Policy
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
