"use client"
import { useState, useEffect } from "react"
import AppointmentCard from "../components/AppointmentCard"

const API_BASE_URL = "http://localhost:5000/api"

interface AppointmentBookingProps {
  onNavigate: (page: string) => void
}

interface Appointment {
  id: string
  doctor_id: string
  hospital_id: string
  appointment_date: string
  appointment_time: string
  reason: string
  notes: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

interface MappedAppointment {
  id: string
  doctorName: string
  specialty: string
  hospital: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  reason: string
  notes: string
}

export default function AppointmentBooking({ onNavigate }: AppointmentBookingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/appointments/patient/appointments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }

      const data = await response.json()
      const allAppointments = [...data.upcoming, ...data.past]

      setAppointments(allAppointments)
      setUpcomingCount(data.total_upcoming || 0)
      setCompletedCount(data.total_completed || 0)
    } catch (err) {
      console.error("[v0] Error fetching appointments:", err)
      setError(err instanceof Error ? err.message : "Failed to load appointments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setError("Authentication token not found. Please login again.")
        return
      }

      const reason = prompt("Please provide a reason for cancellation:")
      if (!reason) return

      const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      // Refresh appointments after cancellation
      fetchAppointments()
    } catch (err) {
      console.error("[v0] Error cancelling appointment:", err)
      setError(err instanceof Error ? err.message : "Failed to cancel appointment")
    }
  }

  const handleReschedule = (id: number) => {
    alert("Reschedule functionality - Select new date and time")
  }

  const upcomingAppointments = appointments.filter((apt) => apt.status !== "completed" && apt.status !== "cancelled")
  const pastAppointments = appointments.filter((apt) => apt.status === "completed" || apt.status === "cancelled")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-full overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50 px-5 md:px-10 py-12 font-['Inter',sans-serif]">
      {/* Header Section with Background */}
      <div className="relative -mx-5 md:-mx-10 -mt-12 mb-8 bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 px-5 md:px-10 py-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-64 h-64 bg-blue-300/30 rounded-full blur-3xl -top-10 -right-10 animate-float"></div>
          <div className="absolute w-80 h-80 bg-sky-300/20 rounded-full blur-3xl -bottom-10 -left-10 animate-float-delayed"></div>
        </div>

        <div
          className={`text-center relative z-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
        >
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-700 text-sm font-semibold mb-4 shadow-md">
            📋 Your Healthcare Schedule
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-700 bg-clip-text text-transparent mb-4 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Appointments
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
            Manage your scheduled appointments and view your medical history
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-sky-100/50 border-2 border-sky-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-900">{upcomingCount}</p>
              <p className="text-sm text-slate-600 font-medium">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-cyan-100/50 border-2 border-cyan-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-900">{completedCount}</p>
              <p className="text-sm text-slate-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100/50 border-2 border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
              <p className="text-sm text-slate-600 font-medium">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div
        className={`flex flex-col gap-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
              📅
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Upcoming Appointments</h2>
          </div>
          {upcomingAppointments.length > 0 && (
            <button
              onClick={() => onNavigate("availability")}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              + Book New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment, index) => {
              // Map backend format to component format
              const mappedApt = {
                id: appointment.id,
                doctorName: appointment.doctor_id,
                specialty: "Specialist",
                hospital: appointment.hospital_id,
                date: appointment.appointment_date,
                time: appointment.appointment_time,
                status: appointment.status as "confirmed" | "pending" | "completed" | "cancelled",
                reason: appointment.reason,
                notes: appointment.notes,
              }
              return (
                <div
                  key={appointment.id}
                  className="transition-all duration-500"
                  style={{
                    animation: `slideUp 0.6s ease-out forwards`,
                    animationDelay: `${300 + index * 100}ms`,
                    opacity: 0,
                  }}
                >
                  <AppointmentCard
                    appointment={mappedApt}
                    onCancel={() => handleCancel(mappedApt.id)}
                    onReschedule={() => handleReschedule(Number.parseInt(mappedApt.id))}
                  />
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-20 px-5 bg-white rounded-3xl shadow-lg border-2 border-slate-100">
              <div className="text-7xl mb-5 transition-transform duration-500 hover:scale-110">📅</div>
              <p className="text-xl font-bold text-slate-800 mb-2">No upcoming appointments</p>
              <p className="text-base text-slate-600 mb-6">Book an appointment with our expert doctors</p>
              <button
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
                onClick={() => onNavigate("availability")}
              >
                Book an Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Past Appointments Section */}
      <div
        className={`flex flex-col gap-6 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center text-white text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Past Appointments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment, index) => {
              // Map backend format to component format
              const mappedApt = {
                id: appointment.id,
                doctorName: appointment.doctor_id,
                specialty: "Specialist",
                hospital: appointment.hospital_id,
                date: appointment.appointment_date,
                time: appointment.appointment_time,
                status: appointment.status as "confirmed" | "pending" | "completed" | "cancelled",
                reason: appointment.reason,
                notes: appointment.notes,
              }
              return (
                <div
                  key={appointment.id}
                  className="transition-all duration-500"
                  style={{
                    animation: `slideUp 0.6s ease-out forwards`,
                    animationDelay: `${400 + index * 100}ms`,
                    opacity: 0,
                  }}
                >
                  <AppointmentCard appointment={mappedApt} isPast={true} />
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16 px-5 bg-white rounded-2xl shadow-md border border-slate-200 text-slate-500">
              <div className="text-5xl mb-3 opacity-50">📜</div>
              <p className="text-lg font-medium">No past appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className={`mt-4 grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div
          onClick={() => onNavigate("availability")}
          className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
        >
          <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            🩺
          </div>
          <h3 className="text-lg font-bold mb-2">Find Doctors</h3>
          <p className="text-sm opacity-90">Browse available doctors and specialists</p>
        </div>

        <div
          onClick={() => onNavigate("search")}
          className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
        >
          <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            🏥
          </div>
          <h3 className="text-lg font-bold mb-2">Find Hospitals</h3>
          <p className="text-sm opacity-90">Locate nearby hospitals and clinics</p>
        </div>

        <div
          onClick={() => onNavigate("history")}
          className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
        >
          <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
           
          </div>
          <h3 className="text-lg font-bold mb-2">Medical History</h3>
          <p className="text-sm opacity-90">View your complete medical records</p>
        </div>
      </div>

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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
