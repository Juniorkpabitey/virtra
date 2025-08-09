'use client'

type AIOptionCardProps = {
  label: string
  onClick?: () => void
}

export default function AIOptionCard({ label, onClick }: AIOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#e5e5e5] rounded-lg p-10 text-xl font-bold shadow hover:shadow-md transition "
    >
      {label}
    </button>
  )
}
