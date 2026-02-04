import { Metadata } from 'next'
import { Heart, Award, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Jewelry Store',
  description: 'Learn about our passion for creating exquisite handcrafted jewelry. Discover our story, values, and commitment to quality.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Crafting beautiful jewelry with passion, precision, and love for over a decade. 
          Each piece tells a story of elegance and timeless beauty.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Handcrafted with Love</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded with a passion for creating exceptional jewelry, our store has been serving 
            customers with beautiful, handcrafted pieces that celebrate life's special moments. 
            Every earring and necklace in our collection is carefully designed and crafted with 
            attention to detail.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe that jewelry is more than just an accessory – it's a way to express 
            your personality, commemorate special occasions, and create lasting memories. 
            That's why we're committed to using only the finest materials and traditional 
            craftsmanship techniques.
          </p>
        </div>
        <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg p-8 flex items-center justify-center">
          <div className="text-8xl">💎</div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion</h3>
            <p className="text-gray-600">
              Every piece is created with genuine love and passion for the craft of jewelry making.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600">
              We use only premium materials and maintain the highest standards of craftsmanship.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600">
              Building lasting relationships with our customers and supporting local artisans.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              Blending traditional techniques with modern designs to create unique pieces.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-rose-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Piece?</h2>
        <p className="text-gray-600 mb-6">
          Explore our collection of handcrafted earrings and necklaces, each designed to make you shine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/products"
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Shop Collection
          </a>
          <a
            href="/contact"
            className="border border-rose-600 text-rose-600 px-6 py-3 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}