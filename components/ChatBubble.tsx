'use client'

type Props = {
  message: string
  role: 'user' | 'assistant'
}

export default function ChatBubble({ message, role }: Props) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isUser ? 'bg-blue-200 text-black' : 'bg-gray-300 text-black'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
