'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import DoctorSidebar from '../../../components/DoctorSidebar'
import DoctorTopbar from '../../../components/DoctorTopbar'
import Footer from '../../../components/Footer'
import { Brain, Send, MessageCircle, Search, Lightbulb, Activity, BookOpen, TrendingUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import doctorSystemPrompt from '../../../prompts/doctorSystemPrompt.json'

// API CONFIGURATION
const VIRTRA_API = process.env.NEXT_PUBLIC_VIRTRA_AI_API_KEY

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

type MedicalQuery = {
  id: string
  query: string
  response: string
  timestamp: Date
  category: string
}

export default function DoctorVirtraAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentQueries, setRecentQueries] = useState<MedicalQuery[]>([])
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  // Fetch doctor ID and chat history
  useEffect(() => {
    const fetchDoctorAndChats = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData?.user?.id || null

      if (uid) {
        // Get doctor ID
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', uid)
          .single()

        if (doctorData) {
          setDoctorId(doctorData.id)
          
          // Fetch doctor's chat history
          const { data: chats, error } = await supabase
            .from('doctor_chats')
            .select('prompt, response, category')
            .eq('doctor_id', doctorData.id)
            .order('created_at', { ascending: true })

          if (error) {
            console.error('Error fetching chat history:', error.message)
          } else if (chats) {
            const formattedMessages: Message[] = chats.flatMap(chat => [
              {
                id: `user-${Date.now()}-${Math.random()}`,
                content: chat.prompt,
                isUser: true,
                timestamp: new Date()
              },
              {
                id: `ai-${Date.now()}-${Math.random()}`,
                content: chat.response,
                isUser: false,
                timestamp: new Date()
              }
            ])
            setMessages(formattedMessages)
          }
        }
      }
    }

    fetchDoctorAndChats()
  }, [])

  const categories = [
    { id: 'general', name: 'General Medical', icon: Brain },
    { id: 'diagnosis', name: 'Diagnosis Help', icon: Search },
    { id: 'treatment', name: 'Treatment Plans', icon: Activity },
    { id: 'medication', name: 'Medication Info', icon: BookOpen },
    { id: 'research', name: 'Medical Research', icon: TrendingUp },
  ]

  const quickPrompts = [
    "Help me with differential diagnosis for chest pain",
    "What are the latest guidelines for managing hypertension?",
    "Explain the mechanism of action for beta-blockers",
    "Provide treatment recommendations for type 2 diabetes",
    "What are the current guidelines for pediatric fever management?",
    "Help me interpret this ECG reading",
    "What are the risk factors for cardiovascular disease?",
    "Explain the pharmacokinetics of common antibiotics",
    "Provide evidence-based treatment for depression",
    "What are the latest recommendations for COVID-19 management?",
    "Help me with medication interactions for polypharmacy",
    "Explain the diagnostic criteria for autoimmune diseases"
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !doctorId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VIRTRA_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            doctorSystemPrompt,
            {
              role: 'user',
              content: `Category: ${selectedCategory}\n\nQuery: ${inputMessage}`,
            },
          ],
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.choices?.[0]?.message?.content) {
        console.error('OpenRouter error:', json)
        throw new Error(json?.error?.message || 'No response received from Virtra.')
      }

      const response = json.choices[0].message.content
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])

      // Save to Supabase
      await supabase.from('doctor_chats').insert({
        doctor_id: doctorId,
        prompt: inputMessage,
        response,
        category: selectedCategory,
      })

      // Save to recent queries
      const newQuery: MedicalQuery = {
        id: Date.now().toString(),
        query: inputMessage,
        response: response,
        timestamp: new Date(),
        category: selectedCategory
      }
      setRecentQueries(prev => [newQuery, ...prev.slice(0, 4)])

    } catch (err) {
      console.error('Chat error:', err)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '⚠️ Sorry, Virtra could not respond. Please try again later.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    }

    setIsLoading(false)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <DoctorTopbar />

        <div className="flex">
          <DoctorSidebar />

          <main className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Virtra AI Assistant</h1>
                  <p className="text-gray-400">AI-powered medical assistance for healthcare professionals</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Chat Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Category Selection */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Select Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{category.name}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-96 flex flex-col">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Medical AI Assistant</h3>
                  </div>

                  {/* Messages */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Start a Medical Query</h3>
                        <p className="text-gray-400">Ask me anything about medical diagnosis, treatment, or research</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                              message.isUser
                                ? 'bg-blue-500/20 border border-blue-500/30 text-white'
                                : 'bg-white/10 border border-white/20 text-gray-300'
                            }`}
                          >
                            {message.isUser ? (
                              <p className="text-sm">{message.content}</p>
                            ) : (
                              <div className="text-sm">
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <p className="mb-2">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="text-gray-400 italic">{children}</em>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold text-white mb-1">{children}</h3>,
                                    code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs">{children}</code>,
                                    pre: ({ children }) => <pre className="bg-white/10 p-2 rounded text-xs overflow-x-auto">{children}</pre>,
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            )}
                            <p className="text-xs opacity-60 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask your medical question..."
                      className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading || !doctorId}
                      className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Prompts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-gray-300 hover:text-white transition-all duration-300"
                      >
                        <p className="text-sm">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* AI Features */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Diagnosis Support</p>
                        <p className="text-gray-400 text-xs">AI-powered symptom analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Treatment Plans</p>
                        <p className="text-gray-400 text-xs">Evidence-based recommendations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Medical Literature</p>
                        <p className="text-gray-400 text-xs">Latest research and guidelines</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Clinical Insights</p>
                        <p className="text-gray-400 text-xs">Expert medical knowledge</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Queries */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Queries</h3>
                  <div className="space-y-3">
                    {recentQueries.length === 0 ? (
                      <p className="text-gray-400 text-sm">No recent queries</p>
                    ) : (
                      recentQueries.map((query) => (
                        <div key={query.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-white text-sm font-medium mb-1">{query.query}</p>
                          <p className="text-gray-400 text-xs mb-2">{query.response.substring(0, 60)}...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-400 text-xs font-medium">{query.category}</span>
                            <span className="text-gray-500 text-xs">
                              {query.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Queries Today</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">This Week</span>
                      <span className="text-white font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Accuracy Rate</span>
                      <span className="text-green-400 font-semibold">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Response Time</span>
                      <span className="text-blue-400 font-semibold">2.3s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  )
}
