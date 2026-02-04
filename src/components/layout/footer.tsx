import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, MessageCircle, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Main Footer Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Brand Logo */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-2">
                EKAASHI
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Premium Jewelry Collection
              </div>
            </div>

            {/* Mobile-First Layout */}
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {/* Useful Links & Information - Mobile: Single Column, Desktop: Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Useful Links */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                  <h3 className="text-xl sm:text-2xl font-light mb-6 text-gray-900">Useful Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/shipping" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Delivery Information
                      </Link>
                    </li>
                    <li>
                      <Link href="/international-shipping" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        International Shipping
                      </Link>
                    </li>
                    <li>
                      <Link href="/payment" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Payment Options
                      </Link>
                    </li>
                    <li>
                      <Link href="/track-order" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Track your Order
                      </Link>
                    </li>
                    <li>
                      <Link href="/returns" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Returns
                      </Link>
                    </li>
                    <li>
                      <Link href="/store-locator" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Find a Store
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Information */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl sm:text-2xl font-light mb-6 text-gray-900">Information</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/blog" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/offers" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Offers & Contest Details
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        About Ekaashi
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-gray-700 hover:text-amber-600 transition-colors text-base flex items-center cursor-pointer">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-xl sm:text-2xl font-light mb-6 text-gray-900">Contact Us</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Customer Service</div>
                        <div className="text-gray-900 font-medium">1800-266-0123</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-3 text-gray-900">Chat With Us</h4>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">WhatsApp</div>
                        <div className="text-gray-900 font-medium">+91 8147349242</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication Icons */}
                <div className="flex justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
                  <Link href="https://wa.me/918147349242" className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors cursor-pointer">
                    <MessageCircle className="h-6 w-6" />
                  </Link>
                  <Link href="mailto:support@ekaashi.com" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer">
                    <Mail className="h-6 w-6" />
                  </Link>
                  <Link href="/chat" className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white hover:bg-amber-700 transition-colors cursor-pointer">
                    <MessageCircle className="h-6 w-6" />
                  </Link>
                </div>
              </div>

              {/* App Download Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h4 className="text-lg sm:text-xl font-medium mb-6 text-gray-900 text-center">Download Our App</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Google Play Store */}
                  <Link href="#" className="flex items-center space-x-3 bg-black rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="text-2xl">📱</div>
                    <div>
                      <div className="text-xs text-gray-300">Download on the</div>
                      <div className="text-lg font-semibold text-white">Play Store</div>
                    </div>
                  </Link>

                  {/* Apple App Store */}
                  <Link href="#" className="flex items-center space-x-3 bg-black rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="text-2xl">🍎</div>
                    <div>
                      <div className="text-xs text-gray-300">Download on the</div>
                      <div className="text-lg font-semibold text-white">App Store</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Social Media & Payment Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Social Media */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
                  <h4 className="text-lg sm:text-xl font-medium mb-4 text-gray-900 text-center">Follow Us</h4>
                  <div className="flex justify-center space-x-4">
                    <Link href="https://instagram.com/ekaashi" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                      <Instagram className="h-6 w-6" />
                    </Link>
                    <Link href="https://twitter.com/ekaashi" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                      <Twitter className="h-6 w-6" />
                    </Link>
                    <Link href="https://facebook.com/ekaashi" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                      <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="https://youtube.com/ekaashi" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                      <Youtube className="h-6 w-6" />
                    </Link>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h4 className="text-lg sm:text-xl font-medium mb-4 text-gray-900 text-center">We Accept</h4>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-blue-600 font-bold text-sm">VISA</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-red-600 font-bold text-sm">MC</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-blue-600 font-bold text-sm">MAESTRO</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-blue-600 font-bold text-sm">PayPal</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-orange-600 font-bold text-sm">UPI</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                      <span className="text-blue-800 font-bold text-sm">AMEX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-center text-gray-600 text-sm">
                © 2024 Ekaashi Jewelry Limited. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget (Fixed Position) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm font-medium pr-2 hidden sm:block">
              How can I help you?
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}