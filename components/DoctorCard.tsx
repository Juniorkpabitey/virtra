'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

type DoctorCardProps = {
  id: string // doctor ID for routing
  name: string
  speciality: string
  image: string
  rating?: number
}

export default function DoctorCard({ id, name, speciality, image, rating = 4.5 }: DoctorCardProps) {
  const router = useRouter()

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(rating) ? '★' : i < rating ? '⯨' : '☆'
  )

  const handleClick = () => {
    router.push(`/appointment/${id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-[340px] bg-white rounded-lg shadow-md overflow-hidden mx-auto cursor-pointer hover:shadow-lg transition"
    >
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
        <p className="text-sm text-gray-500">{speciality}</p>
        <div className="mt-2 text-yellow-500 text-sm">
          {stars.map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
