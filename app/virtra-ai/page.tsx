'use client'

import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import AIOptionCard from '@/components/AIOptionCard'
import { ArrowRight} from 'lucide-react'
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
  //const [sidebarOpen, setSidebarOpen] = useState(false)
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
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      {/* Topbar with mobile menu button */}
       <Topbar/>

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        <Sidebar />
  



        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-5 w-full max-w-5xl">
            <AIOptionCard label="Talk to Virtra" />
          </div>

          {/* Chat Display */}
          <div
            ref={chatContainerRef}
            className="w-full max-w-5xl space-y-4 bg-white rounded-xl p-4 sm:p-6 shadow-md min-h-[300px] overflow-y-auto"
            style={{ maxHeight: '60vh' }}
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                Ask Virtra about your health — safely.
              </p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="space-y-3">
                  {/* User prompt */}
                  <div className="flex justify-end">
                    <div className="bg-blue-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-right max-w-[90%] sm:max-w-[80%]">
                      <p className="text-gray-800 font-semibold text-sm sm:text-base">You:</p>
                      <p className="text-gray-700 text-sm sm:text-base">{msg.prompt}</p>
                    </div>
                  </div>

                  {/* Virtra response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-left max-w-[90%] sm:max-w-[80%]">
                      <p className="text-blue-800 font-semibold text-sm sm:text-base">Virtra:</p>
                      <div className="prose prose-sm sm:prose-base text-blue-900 mt-1">
                        <ReactMarkdown>{msg.response}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input box */}
          <div className="w-full max-w-5xl sticky bottom-0 bg-[#f9f9f0] pb-2 sm:pb-4">
            <div className="flex items-center bg-gray-200 rounded-full px-3 sm:px-4 py-2 sm:py-3 shadow-md">
              <input
                type="text"
                placeholder="Ask Virtra"
                className="flex-1 bg-transparent outline-none text-sm sm:text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="text-black hover:text-gray-700 p-1 sm:p-2"
              >
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
