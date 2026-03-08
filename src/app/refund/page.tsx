import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Ekaashi',
  description: 'Learn about Ekaashi\'s refund and return policy for jewelry purchases.',
}

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund & Return Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated:</strong> March 8, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Eligibility</h2>
          <p className="text-gray-700 mb-4">
            We want you to be completely satisfied with your purchase. You may return most items within 30 days of delivery for a full refund or exchange.
          </p>
          <p className="text-gray-700 mb-4">
            To be eligible for a return:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Items must be unused and in the same condition as received</li>
            <li>Items must be in original packaging with all tags attached</li>
            <li>Proof of purchase (order number or receipt) is required</li>
            <li>Custom or personalized items cannot be returned unless defective</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Non-Returnable Items</h2>
          <p className="text-gray-700 mb-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Custom-made or personalized jewelry</li>
            <li>Pierced earrings (for hygiene reasons)</li>
            <li>Items marked as final sale</li>
            <li>Gift cards</li>
            <li>Items damaged due to misuse or negligence</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How to Initiate a Return</h2>
          <p className="text-gray-700 mb-4">
            To start a return:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>Contact our customer service team at support@ekaashi.com or call 1800-266-0123</li>
            <li>Provide your order number and reason for return</li>
            <li>We'll send you a return authorization and shipping label</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Ship the item back using the provided label</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Processing</h2>
          <p className="text-gray-700 mb-4">
            Once we receive your return:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>We'll inspect the item within 2-3 business days</li>
            <li>If approved, refunds are processed to your original payment method</li>
            <li>Refunds typically appear within 5-10 business days</li>
            <li>You'll receive an email confirmation once the refund is processed</li>
            <li>Original shipping costs are non-refundable unless the item is defective</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Exchanges</h2>
          <p className="text-gray-700 mb-4">
            We offer exchanges for different sizes, colors, or styles. To exchange an item:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Follow the return process above</li>
            <li>Indicate you'd like an exchange in your return request</li>
            <li>We'll ship the replacement item once we receive your return</li>
            <li>Exchanges are subject to availability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Damaged or Defective Items</h2>
          <p className="text-gray-700 mb-4">
            If you receive a damaged or defective item:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Contact us immediately with photos of the damage</li>
            <li>We'll arrange for a replacement or full refund</li>
            <li>Return shipping is free for damaged/defective items</li>
            <li>We may provide a prepaid return label</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Returns</h2>
          <p className="text-gray-700 mb-4">
            International customers are responsible for return shipping costs unless the item is defective. Customs duties and taxes are non-refundable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Late or Missing Refunds</h2>
          <p className="text-gray-700 mb-4">
            If you haven't received your refund:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Check your bank account again</li>
            <li>Contact your credit card company (processing may take time)</li>
            <li>Contact your bank</li>
            <li>If you've done all of this and still haven't received your refund, contact us at support@ekaashi.com</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For questions about returns or refunds, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> support@ekaashi.com</p>
            <p className="text-gray-700"><strong>Phone:</strong> 1800-266-0123</p>
            <p className="text-gray-700"><strong>WhatsApp:</strong> +91 8147349242</p>
            <p className="text-gray-700"><strong>Hours:</strong> Monday-Saturday, 9 AM - 6 PM IST</p>
          </div>
        </section>
      </div>
    </div>
  )
}
