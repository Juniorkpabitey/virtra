'use client'

import Image from 'next/image'

type HealthCardProps = {
  title: string
  image: string
}

export default function HealthCard({ title, image }: HealthCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
      <div className="relative w-full h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="py-5 text-center font-extrabold text-xl tracking-wide text-gray-800">
        {title}
      </div>
    </div>
  )
}
