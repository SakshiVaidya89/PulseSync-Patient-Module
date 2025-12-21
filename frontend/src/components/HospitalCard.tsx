"use client"

interface Hospital {
  id: number
  name: string
  location: string
  rating: number
  reviews: number
  services: string[]
  beds: number
  doctors: number
  image: string
}

interface HospitalCardProps {
  hospital: Hospital
  onNavigate: (page: string) => void
}

export default function HospitalCard({ hospital, onNavigate }: HospitalCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all flex flex-col hover:-translate-y-2 hover:shadow-xl">
      {/* Hospital Image */}
      <div className="w-full h-52 overflow-hidden bg-sky-50">
        <img 
          src={hospital.image || "/placeholder.svg"} 
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hospital Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-bold text-sky-900">{hospital.name}</h3>
        <p className="text-slate-500 text-sm">📍 {hospital.location}</p>

        {/* Hospital Rating */}
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-sky-500">⭐ {hospital.rating}</span>
          <span className="text-slate-400 text-sm">({hospital.reviews} reviews)</span>
        </div>

        {/* Hospital Info */}
        <div className="flex gap-5 py-3 border-t border-b border-slate-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold">Beds:</span>
            <span className="text-base font-bold text-sky-900">{hospital.beds}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold">Doctors:</span>
            <span className="text-base font-bold text-sky-900">{hospital.doctors}</span>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-sky-900 m-0">Services:</p>
          <div className="flex flex-wrap gap-2">
            {hospital.services.map((service, idx) => (
              <span 
                key={idx} 
                className="bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* View Button */}
        <button 
          className="px-3 py-3 bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-lg font-semibold cursor-pointer transition-all mt-2 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
          onClick={() => onNavigate("availability")}
        >
          View Doctors & Book
        </button>
      </div>
    </div>
  )
}