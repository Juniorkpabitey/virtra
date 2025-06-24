'use client'

import Image from 'next/image'

type DoctorCardProps = {
  name: string
  title: string
  image: string
  rating?: number
}

export default function DoctorCard({ name, title, image, rating = 4.5 }: DoctorCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(rating) ? '★' : i < rating ? '⯨' : '☆'
  )

  return (
    <div className="w-full max-w-[340px] bg-white rounded-lg shadow-md overflow-hidden mx-auto">
      {/* Image */}
      <div className="w-full h-[220px] relative">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Info */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="mt-2 text-yellow-500 text-sm">
          {stars.map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
