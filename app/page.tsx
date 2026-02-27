import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Leaf,
  Sprout,
  BarChart3,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Smartphone,
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Sprout,
      title: 'Crop Management',
      description: 'Track planting, growth, health, and harvest with AI-powered insights',
    },
    {
      icon: Users,
      title: 'Livestock Tracking',
      description: 'Monitor animal health, weight, and production metrics in real-time',
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Real-time commodity prices and revenue optimization strategies',
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Smart alerts for disease prevention, optimal watering, and harvesting',
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Your farm data is encrypted and protected with enterprise security',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Manage your farm on the go with fully responsive design',
    },
  ]

  const benefits = [
    'Increase crop yield by up to 30%',
    'Reduce disease and pest damage',
    'Optimize resource usage',
    'Maximize market selling opportunities',
    'Track livestock health efficiently',
    'Make data-driven farming decisions',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-700 transition">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-emerald-900">SmartFarmer SKACE</h1>
              <p className="text-xs text-emerald-700">By Samuel Kaoma</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-emerald-700 hover:bg-emerald-50">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              🌾 The Future of Zambian Farming
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-emerald-900 leading-tight">
              Smart Farming for{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Every Farmer
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empower your farming with AI-driven insights, real-time monitoring, and data-driven decision making. 
              Designed for Zambian farmers, by farmers.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-emerald-200">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-emerald-900">Powerful Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern, efficient farm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-emerald-200 hover:shadow-lg transition">
                  <CardContent className="pt-8">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-emerald-900">
                Why SmartFarmer SKACE?
              </h3>
              <p className="text-gray-600 mt-4">
                Built from the ground up for Zambian farming conditions and challenges. 
                Our AI understands local weather patterns, crop varieties, and market dynamics.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/sign-up">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto">
                Begin Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100">
                  <Sprout className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">5 Active Crops</p>
                    <p className="text-xs text-gray-500">Across 12 hectares</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100">
                  <Users className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">45 Livestock</p>
                    <p className="text-xs text-gray-500">All in excellent health</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">ZMW 18,500</p>
                    <p className="text-xs text-gray-500">Earned this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-white">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-emerald-50 text-lg">
              Join Zambian farmers already using SmartFarmer SKACE to increase yields and profitability
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-emerald-100 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">SmartFarmer SKACE</h4>
              <p className="text-sm text-gray-600">
                Intelligent farming platform by Samuel Kaoma for Zambian farmers
              </p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#features" className="hover:text-emerald-600">Crop Management</Link></li>
                <li><Link href="#features" className="hover:text-emerald-600">Market Intelligence</Link></li>
                <li><Link href="#features" className="hover:text-emerald-600">AI Recommendations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-emerald-600">Privacy</Link></li>
                <li><Link href="#" className="hover:text-emerald-600">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">Contact</h4>
              <p className="text-sm text-gray-600">
                Created by Samuel Kaoma<br/>
                For Zambian Agriculture
              </p>
            </div>
          </div>

          <div className="border-t border-emerald-100 pt-8 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 SmartFarmer SKACE. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-900">Built for African Farmers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
