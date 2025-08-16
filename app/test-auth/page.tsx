'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TestAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<{ data?: unknown; error?: unknown; type: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      setResult({ data, error, type: 'connection' })
    } catch (err) {
      setResult({ error: err, type: 'connection' })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setResult({ data, error, type: 'login' })
    } catch (err) {
      setResult({ error: err, type: 'login' })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      setResult({ data, error, type: 'signup' })
    } catch (err) {
      setResult({ error: err, type: 'signup' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Supabase Auth Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Test Connection
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <div className="space-x-4">
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={testSignup}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
            >
              Test Signup
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">Result ({result.type}):</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
