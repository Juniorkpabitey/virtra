'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react'

type DoctorCardProps = {
  id: string // doctor ID for routing
  name: string
  speciality: string
  image: string
  rating?: number
}

export default function DoctorCard({ id, name, speciality, image, rating = 4.5 }: DoctorCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/appointment/${id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{rating}</span>
        </div>

        {/* Speciality Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {speciality}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Doctor Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            Dr. {name}
          </h3>
          <p className="text-gray-300 text-sm">{speciality}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>15+ years</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Online</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : i < rating
                  ? 'text-yellow-400 fill-current opacity-60'
                  : 'text-gray-600'
              }`}
            />
          ))}
          <span className="text-gray-400 text-sm ml-2">({rating})</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <span className="text-green-400 font-semibold">Available</span>
            <span className="text-gray-400 ml-1">Today</span>
          </div>
          <button className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
