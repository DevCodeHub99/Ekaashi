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
              {/* Useful Links & Information - Mobile: Two Columns, Desktop: Two Columns */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-16">
                {/* Useful Links */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 sm:p-6">
                  <h3 className="text-sm sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-6 text-gray-900">Useful Links</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link href="/shipping" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Delivery Information</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/international-shipping" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">International Shipping</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/payment" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Payment Options</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/track-order" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Track your Order</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/returns" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Returns</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/store-locator" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Find a Store</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Information */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-6">
                  <h3 className="text-sm sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-6 text-gray-900">Information</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link href="/blog" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Blog</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/offers" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Offers & Contest Details</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">About Ekaashi</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Privacy Policy</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-gray-700 hover:text-amber-600 transition-colors text-xs sm:text-base flex items-center cursor-pointer">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                        <span className="leading-tight">Terms & Conditions</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section - Single Row on Mobile */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-xl lg:text-2xl font-light mb-3 sm:mb-6 text-gray-900 text-center">Get In Touch</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-6">
                  {/* Phone */}
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                      <Phone className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Call Us</div>
                    <div className="text-gray-900 font-medium text-[9px] sm:text-base leading-tight">1800-266-0123</div>
                  </div>

                  {/* WhatsApp */}
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                      <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">WhatsApp</div>
                    <div className="text-gray-900 font-medium text-[9px] sm:text-base leading-tight">+91 8147349242</div>
                  </div>

                  {/* Email */}
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
                      <Mail className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Email Us</div>
                    <div className="text-gray-900 font-medium text-[9px] sm:text-sm leading-tight break-all">support@ekaashi.com</div>
                  </div>
                </div>
              </div>

              {/* Social Media & Payment Section - Simplified */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Social Media */}
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-medium mb-4 text-gray-900">Connect With Us</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <Link href="https://instagram.com/ekaashi" className="w-11 h-11 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                      </Link>
                      <Link href="https://facebook.com/ekaashi" className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer" aria-label="Facebook">
                        <Facebook className="h-5 w-5" />
                      </Link>
                      <Link href="https://twitter.com/ekaashi" className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer" aria-label="Twitter">
                        <Twitter className="h-5 w-5" />
                      </Link>
                      <Link href="https://youtube.com/ekaashi" className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer" aria-label="YouTube">
                        <Youtube className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="text-center md:text-right">
                    <h4 className="text-xl font-medium mb-4 text-gray-900">Secure Payments</h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                      <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                        <span className="text-blue-600 font-semibold text-xs">VISA</span>
                      </div>
                      <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                        <span className="text-red-600 font-semibold text-xs">Mastercard</span>
                      </div>
                      <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                        <span className="text-orange-600 font-semibold text-xs">UPI</span>
                      </div>
                      <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                        <span className="text-blue-600 font-semibold text-xs">PayPal</span>
                      </div>
                      <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                        <span className="text-blue-800 font-semibold text-xs">AMEX</span>
                      </div>
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

      {/* Chat Widget (Fixed Position) - Simplified */}
      <Link href="https://wa.me/918147349242" className="fixed bottom-6 right-6 z-50 group">
        <div className="bg-green-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat on WhatsApp
        </div>
      </Link>
    </footer>
  )
}