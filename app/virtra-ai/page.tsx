'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import AIOptionCard from '@/components/AIOptionCard'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'

//API CONFIGURATION
const VIRTRA_API = process.env.NEXT_PUBLIC_VIRTRA_AI_API_KEY

export default function VirtraAIPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ prompt: string; response: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // 1️⃣ Get user and fetch chat history
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

  // 2️⃣ Send prompt to API + save to Supabase
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
            {
              role: 'system',
              content: 'You are Virtra, a friendly AI health assistant. Answer clearly and helpfully.',
            },
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

      // 3️⃣ Add to UI and Supabase
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
      <Topbar />

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center justify-center space-y-8 px-4 py-6">
          <div className="flex flex-wrap justify-center gap-5 w-full max-w-5xl">
            <AIOptionCard label="Your Health Assistant" />
            <AIOptionCard label="Talk to Virtra" />
          </div>

          {/* Chat Display */}
          <div className="w-full max-w-5xl space-y-4 bg-white rounded-xl p-6 shadow-md min-h-[300px]">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">Ask Virtra all about your health.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="space-y-3">
                  {/* User prompt */}
                  <div className="flex justify-end">
                    <div className="bg-blue-100 px-4 py-2 rounded-lg text-right max-w-[80%]">
                      <p className="text-gray-800 font-semibold">You:</p>
                      <p className="text-gray-700">{msg.prompt}</p>
                    </div>
                  </div>

                  {/* Virtra response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-left max-w-[80%]">
                      <p className="text-blue-800 font-semibold">Virtra:</p>
                      <div className="prose prose-sm text-blue-900 mt-1">
                        <ReactMarkdown>{msg.response}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input box */}
          <div className="w-full max-w-5xl">
            <div className="flex items-center bg-gray-200 rounded-full px-4 py-3 shadow-md">
              <input
                type="text"
                placeholder="Ask Virtra"
                className="flex-1 bg-transparent outline-none text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="text-black hover:text-gray-700"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}


