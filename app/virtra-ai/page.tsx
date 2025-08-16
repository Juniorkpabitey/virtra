'use client'

import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
//import AIOptionCard from '@/components/AIOptionCard'
import {Send, Bot, User, Sparkles, MessageCircle, Brain } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'
import systemPrompt from '@/prompts/systemPrompt.json'

// API CONFIGURATION
const VIRTRA_API = process.env.NEXT_PUBLIC_VIRTRA_AI_API_KEY

export default function VirtraAIPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ prompt: string; response: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
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

  // Fetch user & chat history
  useEffect(() => {
    const fetchUserAndChats = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData?.user?.id || null
      setUserId(uid)

      if (uid) {
        const { data: chats, error } = await supabase
          .from('chats')
          .select('prompt, response')
          .eq('user_id', uid)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching chat history:', error.message)
        } else if (chats) {
          setMessages(chats)
        }
      }
    }

    fetchUserAndChats()
  }, [])

  // Send message to API + save to Supabase
  const handleSend = async () => {
    if (!input.trim() || !userId) return
    setLoading(true)

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
            systemPrompt,
            {
              role: 'user',
              content: input,
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
      const newEntry = { prompt: input, response }

      setMessages((prev) => [...prev, newEntry])

      await supabase.from('chats').insert({
        user_id: userId,
        prompt: input,
        response,
      })

      setInput('')
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        { prompt: input, response: '⚠️ Sorry, Virtra could not respond. Try again later.' },
      ])
    }

    setLoading(false)
  }

  return (
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

          {/* Main content */}
          <main className="flex-1 flex flex-col space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      VIRTRA
                    </span>{' '}
                    AI Assistant
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Your intelligent healthcare companion
                  </p>
                </div>
              </div>

              {/* AI Options */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI-Powered Health Assistant</h3>
                      <p className="text-gray-400 text-sm">Ask questions about your health safely</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Virtra AI Chat</h3>
                    <p className="text-gray-400 text-sm">
                      {loading ? 'Virtra is thinking...' : 'Ready to help with your health questions'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-[70vh]"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">Start a conversation</h3>
                        <p className="text-gray-400 max-w-md">
                          Ask Virtra about your health concerns, symptoms, or general wellness questions. 
                          Your conversations are private and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] lg:max-w-[70%]">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-br-md p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-white/80" />
                              <span className="text-white/80 text-sm font-medium">You</span>
                            </div>
                            <p className="text-white text-sm lg:text-base">{msg.prompt}</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%] lg:max-w-[70%]">
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">Virtra AI</span>
                            </div>
                                                         <div className="prose prose-sm lg:prose-base prose-invert max-w-none text-gray-200">
                               <ReactMarkdown>
                                 {msg.response}
                               </ReactMarkdown>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] lg:max-w-[70%]">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md p-4 border border-white/10">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">Virtra AI</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask Virtra about your health..."
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 pr-12"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "What are the symptoms of diabetes?",
                    "How to improve sleep quality?",
                    "Benefits of regular exercise",
                    "Healthy diet tips"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
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
