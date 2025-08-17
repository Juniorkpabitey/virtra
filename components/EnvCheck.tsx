'use client'

export default function EnvCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Environment Check</h3>
      <div className="space-y-1">
        <div>SUPABASE_URL: {supabaseUrl ? '✅ Set' : '❌ Missing'}</div>
        <div>SUPABASE_KEY: {supabaseKey ? '✅ Set' : '❌ Missing'}</div>
        {supabaseUrl && <div className="text-gray-400 truncate">URL: {supabaseUrl}</div>}
        {supabaseKey && <div className="text-gray-400 truncate">Key: {supabaseKey.substring(0, 20)}...</div>}
      </div>
    </div>
  )
}





