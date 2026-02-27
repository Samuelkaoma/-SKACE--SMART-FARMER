'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Users, Target, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-10 h-10" />
            <h1 className="text-4xl font-bold">SmartFarmer SKACE</h1>
          </div>
          <p className="text-xl text-emerald-100 mb-4">Intelligent Agriculture for Modern Farmers</p>
          <p className="text-emerald-100">Created by Samuel Kaoma</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <Card className="mb-8 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-emerald-800 space-y-4">
            <p>
              SmartFarmer SKACE is dedicated to empowering Zambian farmers with intelligent tools and data-driven insights to increase productivity, sustainability, and profitability.
            </p>
            <p>
              We believe that every farmer deserves access to cutting-edge agricultural technology, regardless of their experience level or resources. Our platform combines AI recommendations, real-time monitoring, market intelligence, and gamification to make farming smarter and more rewarding.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-emerald-700">
              Get personalized recommendations based on your crops, weather, market conditions, and farm data. Our intelligent system learns from your farm to provide increasingly accurate suggestions.
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-emerald-700">
              Track crop health, livestock vitality, storage inventory, and weather patterns in real-time. Stay informed and respond quickly to issues before they impact your yield.
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-emerald-700">
              Access current market prices, demand trends, and seasonal insights. Make informed decisions about what to plant and when to sell for maximum returns.
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">Gamification</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-emerald-700">
              Earn achievements, climb tiers, and compete on leaderboards. Make farming engaging and rewarding while improving your agricultural practices.
            </CardContent>
          </Card>
        </div>

        {/* Creator Section */}
        <Card className="mb-12 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              About Samuel Kaoma
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <p className="mb-4">
              Samuel Kaoma is the creator and visionary behind SmartFarmer SKACE. With a passion for agricultural innovation and a commitment to empowering Zambian farmers, Samuel developed this platform to bring modern technology to rural and urban farming communities.
            </p>
            <p>
              Through SmartFarmer SKACE, Samuel aims to create a new generation of tech-enabled farmers who can maximize their yields, optimize their resources, and contribute to food security in Zambia and across Africa.
            </p>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="mb-12 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900">Platform Features</CardTitle>
            <CardDescription>Everything you need for modern farming</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                'Crop Management & Health Tracking',
                'Livestock Monitoring & Care',
                'Storage Inventory Management',
                'Farm Activity Logging',
                'AI-Powered Recommendations',
                'Weather Forecasting',
                'Market Price Tracking',
                'Disease & Pest Detection',
                'Yield Prediction',
                'Efficiency Analytics',
                'Achievement System',
                'Farmer Tier Progression',
                'Real-Time Alerts',
                'Mobile Responsive Design',
                'Secure Authentication',
                'Data Privacy & Security',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-emerald-800">
                  <span className="text-emerald-600 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="mb-8 text-emerald-100">Join thousands of smart farmers using SmartFarmer SKACE to grow better.</p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-emerald-200 text-center text-emerald-700">
          <p className="mb-4">
            <strong>SmartFarmer SKACE</strong> - Intelligent Agriculture for Zambia
          </p>
          <p className="text-sm mb-4">Created by Samuel Kaoma</p>
          <p className="text-xs text-gray-600">
            © 2024 SmartFarmer SKACE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
