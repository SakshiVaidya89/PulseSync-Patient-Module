"use client"
import { useState, useEffect } from "react"
import DoctorAvailability from "../components/DoctorAvailability"

interface AvailabilityProps {
  onNavigate: (page: string) => void
}

interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: string
  position: string
  rating: number
  experience: string
  email: string
  image: string
  nextAvailable: string
  slots: string[]
}

const API_BASE_URL = "http://localhost:5000/api"

export default function Availability({ onNavigate }: AvailabilityProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get("token")
    const storedToken = localStorage.getItem("token")

    const finalToken = urlToken || storedToken
    setToken(finalToken)

    // Store token in localStorage if it came from URL
    if (urlToken) {
      localStorage.setItem("token", urlToken)
    }

    setIsVisible(true)
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/auth/doctors/availability`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch doctors")
      }

      const data = await response.json()
      const doctorList = data.doctors || []

      setDoctors(doctorList)
    } catch (err) {
      console.error("[v0] Error fetching doctors:", err)
      setError(err instanceof Error ? err.message : "Failed to load doctors")
    } finally {
      setIsLoading(false)
    }
  }

  const specialties = ["all", ...Array.from(new Set(doctors.map((doc) => doc.specialty)))]

  const filteredDoctors = doctors.filter(
    (doctor) => selectedSpecialty === "all" || doctor.specialty === selectedSpecialty,
  )

  return (
    <div className="flex flex-col gap-8 w-full max-w-full overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50 px-5 md:px-10 py-12 font-['Inter',sans-serif]">
      {/* Header Section with Background */}
      <div className="relative -mx-5 md:-mx-10 -mt-12 mb-8 bg-gradient-to-br from-cyan-100 via-sky-50 to-blue-100 px-5 md:px-10 py-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl -top-10 -left-10 animate-float"></div>
          <div className="absolute w-80 h-80 bg-sky-300/20 rounded-full blur-3xl -bottom-10 -right-10 animate-float-delayed"></div>
        </div>

        <div
          className={`text-center relative z-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
        >
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-cyan-700 text-sm font-semibold mb-4 shadow-md">
            📅 Real-Time Availability
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-700 via-sky-600 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Check Doctor Availability
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
            View real-time availability and book your appointment with expert doctors
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Filters Card */}
      <div
        className={`bg-white p-8 rounded-3xl shadow-xl shadow-cyan-100/50 border-2 border-cyan-100/50 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔍</span>
          <h2 className="text-xl font-bold text-sky-900">Filter Doctors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <span>🩺</span> Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="p-4 border-2 border-slate-200 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-cyan-300 cursor-pointer bg-slate-50 focus:bg-white"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === "all" ? "All Specialties" : specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600 font-medium">
            Found <span className="text-cyan-600 font-bold">{filteredDoctors.length}</span> doctor
            {filteredDoctors.length !== 1 ? "s" : ""} available
          </p>
          <button
            onClick={() => {
              setSelectedSpecialty("all")
            }}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold transition-colors flex items-center gap-1"
          >
            Clear filters
            <span>✕</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading available doctors...</p>
        </div>
      )}

      {/* Results Section Header */}
      {!isLoading && filteredDoctors.length > 0 && (
        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <h2 className="text-2xl font-bold text-slate-800">Available Doctors</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold hover:border-cyan-300 hover:text-cyan-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              Sort by Rating ⭐
            </button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-semibold hover:bg-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Earliest Available ⚡
            </button>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {!isLoading && filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <DoctorAvailability doctor={doctor} onNavigate={onNavigate} />
            </div>
          ))
        ) : !isLoading ? (
          <div className="col-span-full text-center py-20 px-5 text-slate-500 bg-white rounded-3xl shadow-lg border-2 border-slate-100 animate-fade-in">
            <div className="text-7xl mb-5 transition-transform duration-500 hover:scale-110">👨‍⚕️</div>
            <p className="text-xl font-bold text-slate-800 mb-2">No doctors found</p>
            <p className="text-base mb-6">Try adjusting your filters to see more available doctors</p>
            <button
              onClick={() => {
                setSelectedSpecialty("all")
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Quick Info Cards */}
      {!isLoading && filteredDoctors.length > 0 && (
        <div
          className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="bg-gradient-to-br from-cyan-500 to-sky-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group">
            <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              🏥
            </div>
            <h3 className="text-lg font-bold mb-2">Expert Doctors</h3>
            <p className="text-sm opacity-90">Browse our qualified specialists</p>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group">
            <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              ⚡
            </div>
            <h3 className="text-lg font-bold mb-2">Instant Booking</h3>
            <p className="text-sm opacity-90">Get confirmed appointments immediately</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group">
            <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              💬
            </div>
            <h3 className="text-lg font-bold mb-2">Professional Care</h3>
            <p className="text-sm opacity-90">Experienced and certified professionals</p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
