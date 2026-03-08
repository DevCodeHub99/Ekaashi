import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Ekaashi',
  description: 'Read the terms and conditions for using Ekaashi jewelry store.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> March 8, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using Ekaashi's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Services</h2>
          <p className="text-gray-700 mb-4">
            You agree to use our services only for lawful purposes and in accordance with these terms. You must not:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use our services in any way that violates applicable laws</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt our services</li>
            <li>Use automated systems to access our website</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
          <p className="text-gray-700 mb-4">
            To make purchases, you may need to create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and complete information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payments</h2>
          <p className="text-gray-700 mb-4">
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before orders are processed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Pricing</h2>
          <p className="text-gray-700 mb-4">
            All prices are in USD and are subject to change without notice. We strive to provide accurate pricing information, but errors may occur. If we discover an error in pricing, we will notify you and give you the option to cancel your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
          <p className="text-gray-700 mb-4">
            Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery to the carrier.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Refunds</h2>
          <p className="text-gray-700 mb-4">
            Please refer to our Refund Policy for detailed information about returns and refunds.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content on our website, including text, graphics, logos, images, and software, is the property of Ekaashi and protected by copyright and trademark laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law, Ekaashi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For questions about these terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> legal@ekaashi.com</p>
            <p className="text-gray-700"><strong>Address:</strong> Ekaashi Jewelry Store, [Your Address]</p>
            <p className="text-gray-700"><strong>Phone:</strong> [Your Phone Number]</p>
          </div>
        </section>
      </div>
    </div>
  )
}
