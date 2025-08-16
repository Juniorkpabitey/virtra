'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import AuthLayout from '@/components/AuthLayout'
import { ArrowRight, BookOpen, Dumbbell, TrendingUp, Apple, Sparkles, Users, Clock } from 'lucide-react'
import Link from 'next/link'

const healthSections = [
  {
    title: 'NUTRITION',
    subtitle: 'Healthy Eating Guide',
    description: 'Discover balanced meal plans, dietary tips, and nutritional insights to fuel your body properly.',
    image: '/images/nutrition.png',
    href: '/health-bits/nutrition',
    icon: Apple,
    stats: {
      articles: '50+',
      readTime: '5-10 min',
      readers: '2.5k'
    },
    features: ['Meal Planning', 'Dietary Tips', 'Nutrition Facts']
  },
  {
    title: 'WORKOUTS',
    subtitle: 'Fitness & Exercise',
    description: 'Get access to workout routines, exercise guides, and fitness tips for all levels.',
    image: '/images/workout.png',
    href: '/health-bits/workouts',
    icon: Dumbbell,
    stats: {
      articles: '75+',
      readTime: '8-15 min',
      readers: '3.2k'
    },
    features: ['Workout Plans', 'Exercise Guides', 'Fitness Tips']
  },
  {
    title: 'ARTICLES',
    subtitle: 'Health & Wellness',
    description: 'Read expert articles on health topics, medical insights, and wellness advice.',
    image: '/images/articles.png',
    href: '/health-bits/articles',
    icon: BookOpen,
    stats: {
      articles: '120+',
      readTime: '10-20 min',
      readers: '5.1k'
    },
    features: ['Expert Insights', 'Medical Topics', 'Wellness Advice']
  },
  {
    title: 'HEALTH TRENDS',
    subtitle: 'Latest Health News',
    description: 'Stay updated with the latest health trends, research findings, and medical breakthroughs.',
    image: '/images/trends.png',
    href: '/health-bits/trends',
    icon: TrendingUp,
    stats: {
      articles: '30+',
      readTime: '5-12 min',
      readers: '1.8k'
    },
    features: ['Latest Research', 'Health News', 'Medical Trends']
  },
]

export default function HealthBitsDashboard() {
  return (
    <AuthLayout>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Topbar />
          
          <div className="flex flex-1 flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6">
            <Sidebar />
            
            <main className="flex-1">
              <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="space-y-6 mb-12">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Health
                      </span>{' '}
                      Bits
                    </h1>
                    <p className="text-gray-300 text-lg">
                      Discover valuable health insights, tips, and knowledge to improve your wellness
                    </p>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-2xl font-bold text-white">275+</p>
                        <p className="text-gray-400 text-sm">Articles</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-2xl font-bold text-white">12.6k</p>
                        <p className="text-gray-400 text-sm">Readers</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-2xl font-bold text-white">5-20</p>
                        <p className="text-gray-400 text-sm">Min Read</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-2xl font-bold text-white">Daily</p>
                        <p className="text-gray-400 text-sm">Updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {healthSections.map((section) => {
                  const IconComponent = section.icon
                  return (
                    <Link key={section.title} href={section.href}>
                      <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                {section.title}
                              </h3>
                              <p className="text-gray-400 text-sm">{section.subtitle}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {section.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {section.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/20 transition-all duration-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{section.stats.articles}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{section.stats.readTime}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{section.stats.readers}</span>
                            </span>
                          </div>
                          <div className="text-green-400 text-sm font-medium">
                            Explore →
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    Ready to improve your health?
                  </h3>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Start exploring our comprehensive health resources. Whether you&apos;re looking for nutrition advice, 
                    workout routines, or the latest health trends, we&apos;ve got you covered.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {healthSections.slice(0, 2).map((section) => (
                      <Link key={section.title} href={section.href}>
                        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300">
                          Explore {section.title}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
    </AuthLayout>
  )
}
