"use client"

import { useState, useEffect } from "react"
import HospitalCard from "../components/HospitalCard"

interface HospitalSearchProps {
  onNavigate: (page: string) => void
}

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

export default function HospitalSearch({ onNavigate }: HospitalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [selectedDistance, setSelectedDistance] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const hospitals: Hospital[] = [
    {
      id: 1,
      name: "City General Hospital",
      location: "2.5 km away",
      rating: 4.8,
      reviews: 324,
      services: ["Emergency", "Cardiology", "Orthopedics", "Pediatrics"],
      beds: 450,
      doctors: 120,
      image: "/modern-hospital.png",
    },
    {
      id: 2,
      name: "St. Mary Medical Center",
      location: "3.2 km away",
      rating: 4.6,
      reviews: 287,
      services: ["Emergency", "Neurology", "Oncology", "Radiology"],
      beds: 380,
      doctors: 95,
      image: "/modern-medical-center.png",
    },
    {
      id: 3,
      name: "Prime Health Hospital",
      location: "4.1 km away",
      rating: 4.7,
      reviews: 412,
      services: ["Emergency", "Gastroenterology", "Urology", "ENT"],
      beds: 520,
      doctors: 150,
      image: "/modern-healthcare-facility.png",
    },
    {
      id: 4,
      name: "Wellness Clinic & Hospital",
      location: "5.0 km away",
      rating: 4.5,
      reviews: 198,
      services: ["General Practice", "Dermatology", "Psychiatry", "Physiotherapy"],
      beds: 200,
      doctors: 60,
      image: "/modern-clinic-waiting-area.png",
    },
  ]

  const services = ["all", "Emergency", "Cardiology", "Orthopedics", "Neurology", "Oncology"]
  const distances = ["all", "0-2 km", "2-5 km", "5-10 km", "10+ km"]

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.services.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesService = selectedService === "all" || hospital.services.includes(selectedService)
    return matchesSearch && matchesService
  })

  return (
    <div className="flex flex-col gap-8 w-full max-w-full overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50 px-5 md:px-10 py-12 font-['Inter',sans-serif]">
      {/* Header Section with Background */}
      <div className="relative -mx-5 md:-mx-10 -mt-12 mb-8 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 px-5 md:px-10 py-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-64 h-64 bg-sky-300/30 rounded-full blur-3xl -top-10 -right-10 animate-pulse"></div>
          <div className="absolute w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl -bottom-10 -left-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`text-center relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sky-700 text-sm font-semibold mb-4 shadow-md">
            🏥 Healthcare Near You
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Find Hospitals Near You
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
            Search and compare hospitals in your area with real-time availability
          </p>
        </div>
      </div>

      {/* Search Filters Card */}
      <div className={`bg-white p-8 rounded-3xl shadow-xl shadow-sky-100/50 border-2 border-sky-100/50 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔍</span>
          <h2 className="text-xl font-bold text-sky-900">Search Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <span>🏥</span> Search
            </label>
            <input
              type="text"
              className="p-4 border-2 border-slate-200 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:scale-[1.02] hover:border-sky-300 bg-slate-50 focus:bg-white placeholder-slate-400"
              placeholder="Search hospitals or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <span>🩺</span> Service Type
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="p-4 border-2 border-slate-200 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 hover:border-sky-300 cursor-pointer bg-slate-50 focus:bg-white"
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service === "all" ? "All Services" : service}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <span>📍</span> Distance
            </label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="p-4 border-2 border-slate-200 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 hover:border-sky-300 cursor-pointer bg-slate-50 focus:bg-white"
            >
              {distances.map((distance) => (
                <option key={distance} value={distance}>
                  {distance === "all" ? "All Distances" : distance}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600 font-medium">
            Found <span className="text-sky-600 font-bold">{filteredHospitals.length}</span> hospital{filteredHospitals.length !== 1 ? 's' : ''} matching your criteria
          </p>
          <button className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors flex items-center gap-1">
            Clear filters
            <span>✕</span>
          </button>
        </div>
      </div>

      {/* Results Section Header */}
      {filteredHospitals.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Available Hospitals</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold hover:border-sky-300 hover:text-sky-600 transition-all">
              Map View 🗺️
            </button>
            <button className="px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-all shadow-md">
              List View 📋
            </button>
          </div>
        </div>
      )}

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <HospitalCard hospital={hospital} onNavigate={onNavigate} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 px-5 text-slate-500 bg-white rounded-3xl shadow-lg border-2 border-slate-100">
            <div className="text-7xl mb-5 animate-bounce">🏥</div>
            <p className="text-xl font-bold text-slate-800 mb-2">No hospitals found</p>
            <p className="text-base mb-6">Try adjusting your search filters to see more results</p>
            <button 
              onClick={() => {
                setSearchTerm("")
                setSelectedService("all")
                setSelectedDistance("all")
              }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {filteredHospitals.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold mb-2">Emergency Services</h3>
            <p className="text-sm opacity-90">Find hospitals with 24/7 emergency care</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1">
            <div className="text-3xl mb-3">🩺</div>
            <h3 className="text-lg font-bold mb-2">Specialist Doctors</h3>
            <p className="text-sm opacity-90">Connect with expert specialists</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="text-lg font-bold mb-2">Lab Tests</h3>
            <p className="text-sm opacity-90">Book diagnostic tests online</p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}