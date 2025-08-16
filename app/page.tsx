import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowRight, Shield, Brain, Users, Clock, Star, CheckCircle, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <Navbar />

                 {/* Hero Section */}
         <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
           <div className="max-w-7xl mx-auto w-full">
             <div className="grid lg:grid-cols-2 gap-12 items-center justify-items-center">
               {/* Hero Content */}
               <div className="space-y-8 text-center">
                 <div className="space-y-6">
                   <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-blue-300">
                     <Sparkles className="w-4 h-4 mr-2" />
                     AI-Powered Healthcare
                   </div>
                   <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                     <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                       Your Health,
                     </span>
                     <br />
                     <span className="text-white">Our Priority</span>
                   </h1>
                                       <p className="text-lg text-gray-300 leading-relaxed max-w-lg mx-auto">
                      Experience the future of healthcare with AI-powered diagnostics, 
                      specialist consultations, and personalized health insights.
                    </p>
                  </div>
                 
                                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-blue-500/20">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="border-2 border-white/20 text-white px-6 py-3 rounded-xl font-semibold text-base hover:border-blue-400 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm">
                      Watch Demo
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center space-x-8 pt-4">
                   <div className="flex items-center space-x-2">
                     <div className="flex -space-x-2">
                       {[1, 2, 3, 4].map((i) => (
                         <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-black"></div>
                       ))}
                     </div>
                     <span className="text-xs text-gray-400">10,000+ users</span>
                   </div>
                   <div className="flex items-center space-x-1">
                     {[1, 2, 3, 4, 5].map((i) => (
                       <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                     ))}
                     <span className="text-xs text-gray-400 ml-1">4.9/5</span>
                   </div>
                 </div>
              </div>

                             {/* Hero Image */}
               <div className="relative">
                 {/* Main card container */}
                 <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl w-fit">
                   {/* Image container with enhanced styling */}
                   <div className="relative group">
                     <Image
                       src="/doctor.jpg"
                       width={400}
                       height={400}
                       alt="AI Healthcare Platform"
                       className="rounded-2xl w-full h-auto max-w-sm shadow-lg group-hover:scale-105 transition-transform duration-500"
                     />
                   </div>
                   
                   {/* Status indicators */}
                   <div className="absolute top-4 left-4 flex space-x-2">
                     <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                     <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                     <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                   </div>
                   
                   {/* Floating info cards */}
                   <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                       <span className="text-xs text-white font-medium">AI Active</span>
                     </div>
                   </div>
                   
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                       <span className="text-xs text-white font-medium">Real-time</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-white">
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">VIRTRA</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Advanced AI technology meets compassionate healthcare for a better tomorrow
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Diagnostics",
                  description: "Advanced machine learning algorithms provide accurate health assessments and early disease detection.",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: Users,
                  title: "Expert Specialists",
                  description: "Connect with board-certified healthcare professionals for personalized consultations.",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description: "Get healthcare support anytime, anywhere with our round-the-clock AI assistance.",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Your health data is protected with enterprise-grade security and HIPAA compliance.",
                  color: "from-red-500 to-red-600"
                },
                {
                  icon: CheckCircle,
                  title: "Instant Results",
                  description: "Receive comprehensive health reports and recommendations in real-time.",
                  color: "from-orange-500 to-orange-600"
                },
                {
                  icon: Star,
                  title: "Personalized Care",
                  description: "Tailored health plans and recommendations based on your unique medical profile.",
                  color: "from-teal-500 to-teal-600"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "95%", label: "Accuracy Rate" },
                { number: "24/7", label: "Support Available" },
                { number: "500+", label: "Specialists" }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Healthcare Experience</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust VIRTRA for their health and wellness needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20">
                Start Your Free Trial
              </Link>
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
