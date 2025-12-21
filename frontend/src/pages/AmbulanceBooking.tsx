"use client"

import { useState } from "react"

interface AmbulanceBooking {
  id: number
  patientName: string
  pickupLocation: string
  destination: string
  status: "pending" | "confirmed" | "on-way" | "arrived" | "completed" | "cancelled"
  bookingTime: string
  estimatedTime: string
  ambulanceType: "standard" | "advanced" | "icu"
  driverName: string
  contactNumber: string
}

interface AmbulanceTrackingProps {
  onNavigate: (page: string) => void
}

export default function AmbulanceBooking({ onNavigate }: AmbulanceTrackingProps) {
  const [bookings, setBookings] = useState<AmbulanceBooking[]>([
    {
      id: 1,
      patientName: "Rajesh Kumar",
      pickupLocation: "Home, Sector 12, Noida",
      destination: "Apollo Hospital, Delhi",
      status: "on-way",
      bookingTime: "10:30 AM",
      estimatedTime: "15 mins",
      ambulanceType: "advanced",
      driverName: "Amit Sharma",
      contactNumber: "+91 98765 43210",
    },
    {
      id: 2,
      patientName: "Priya Singh",
      pickupLocation: "Office, Connaught Place, Delhi",
      destination: "Max Hospital, Saket",
      status: "completed",
      bookingTime: "09:00 AM",
      estimatedTime: "Completed",
      ambulanceType: "standard",
      driverName: "Vikram Patel",
      contactNumber: "+91 98765 43211",
    },
  ])

  const [activeTab, setActiveTab] = useState<"new-booking" | "active" | "history">("active")
  const [formData, setFormData] = useState<{
    patientName: string
    pickupLocation: string
    destination: string
    ambulanceType: "standard" | "advanced" | "icu"
    contactNumber: string
  }>({
    patientName: "",
    pickupLocation: "",
    destination: "",
    ambulanceType: "standard",
    contactNumber: "",
  })

  const handleBookAmbulance = () => {
    if (formData.patientName && formData.pickupLocation && formData.destination && formData.contactNumber) {
      const newBooking: AmbulanceBooking = {
        id: bookings.length + 1,
        ...formData,
        status: "pending",
        bookingTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        estimatedTime: "10-15 mins",
        driverName: "TBD",
        contactNumber: formData.contactNumber,
      }
      setBookings([newBooking, ...bookings])
      setFormData({
        patientName: "",
        pickupLocation: "",
        destination: "",
        ambulanceType: "standard",
        contactNumber: "",
      })
      setActiveTab("active")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "on-way":
        return "bg-purple-100 text-purple-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳"
      case "confirmed":
        return "✓"
      case "on-way":
        return "🚑"
      case "arrived":
        return "📍"
      case "completed":
        return "✅"
      case "cancelled":
        return "✕"
      default:
        return "•"
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-sky-50 via-white to-cyan-50 w-full min-h-screen pb-20 font-['Inter',sans-serif]">
      {/* Header */}
      <section className="px-5 md:px-10 py-12 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-b-3xl">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => onNavigate("home")}
            className="mb-6 px-4 py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            🚑 Ambulance Services
          </h1>
          <p className="text-xl opacity-90">Book and track ambulance services 24/7 with real-time tracking</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-5 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-8 border-b-2 border-sky-100">
            <button
              onClick={() => setActiveTab("new-booking")}
              className={`pb-4 px-6 font-bold transition-all duration-300 ${
                activeTab === "new-booking"
                  ? "border-b-4 border-sky-500 text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Book Ambulance
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-4 px-6 font-bold transition-all duration-300 ${
                activeTab === "active"
                  ? "border-b-4 border-sky-500 text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Active Bookings
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-6 font-bold transition-all duration-300 ${
                activeTab === "history"
                  ? "border-b-4 border-sky-500 text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              History
            </button>
          </div>

          {/* New Booking Tab */}
          {activeTab === "new-booking" && (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg shadow-sky-100/50 border-2 border-sky-100">
              <h2 className="text-3xl font-bold text-sky-900 mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Book an Ambulance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-sky-200 bg-white rounded-xl text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Contact Number *</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-sky-200 bg-white rounded-xl text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Pickup Location *</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-sky-200 bg-white rounded-xl text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                    placeholder="Your current location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Destination *</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-sky-200 bg-white rounded-xl text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                    placeholder="Hospital or destination"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Ambulance Type *</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["standard", "advanced", "icu"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setFormData({ ...formData, ambulanceType: type as "standard" | "advanced" | "icu" })
                        }
                        className={`py-4 px-4 rounded-xl font-bold transition-all duration-300 border-2 ${
                          formData.ambulanceType === type
                            ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-500"
                            : "border-sky-200 text-slate-700 hover:border-sky-400 bg-white"
                        }`}
                      >
                        {type === "standard" && "🚑 Standard"}
                        {type === "advanced" && "🏥 Advanced"}
                        {type === "icu" && "🔬 ICU"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookAmbulance}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-2xl text-lg font-bold cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-sky-200/50 active:scale-95 hover:-translate-y-1"
              >
                Book Ambulance Now
              </button>
            </div>
          )}

          {/* Active Bookings Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {bookings.filter((b) => ["pending", "confirmed", "on-way", "arrived"].includes(b.status)).length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-lg text-center border-2 border-sky-100">
                  <div className="text-6xl mb-4">🚑</div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">No Active Bookings</h3>
                  <p className="text-slate-600">Book an ambulance to see it here</p>
                </div>
              ) : (
                bookings
                  .filter((b) => ["pending", "confirmed", "on-way", "arrived"].includes(b.status))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white p-6 md:p-8 rounded-2xl shadow-lg shadow-sky-100/50 border-2 border-sky-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-600 font-semibold mb-1">Patient Name</p>
                          <p className="text-2xl font-bold text-slate-800">{booking.patientName}</p>
                        </div>
                        <div className="flex items-end">
                          <div
                            className={`px-4 py-3 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(booking.status)}`}
                          >
                            <span>{getStatusIcon(booking.status)}</span>
                            <span>{booking.status.toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-semibold mb-1">Pickup Location</p>
                          <p className="text-slate-800">📍 {booking.pickupLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-semibold mb-1">Destination</p>
                          <p className="text-slate-800">🏥 {booking.destination}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-semibold mb-1">Estimated Time</p>
                          <p className="text-slate-800 font-bold">⏱️ {booking.estimatedTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-semibold mb-1">Ambulance Type</p>
                          <p className="text-slate-800">
                            {booking.ambulanceType === "standard" && "🚑 Standard"}
                            {booking.ambulanceType === "advanced" && "🏥 Advanced"}
                            {booking.ambulanceType === "icu" && "🔬 ICU"}
                          </p>
                        </div>
                        <div className="md:col-span-2 bg-sky-50 p-4 rounded-xl border-2 border-sky-100">
                          <p className="text-sm text-slate-600 font-semibold mb-2">Driver Information</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Driver Name</p>
                              <p className="font-bold text-slate-800">{booking.driverName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Contact</p>
                              <p className="font-bold text-slate-800">{booking.contactNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {bookings.filter((b) => ["completed", "cancelled"].includes(b.status)).length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-lg text-center border-2 border-sky-100">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">No History</h3>
                  <p className="text-slate-600">Your completed bookings will appear here</p>
                </div>
              ) : (
                bookings
                  .filter((b) => ["completed", "cancelled"].includes(b.status))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white p-4 md:p-6 rounded-2xl shadow-lg shadow-sky-100/50 border-2 border-sky-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-start md:items-center">
                        <div>
                          <p className="text-lg font-bold text-slate-800">{booking.patientName}</p>
                          <p className="text-sm text-slate-600">
                            {booking.pickupLocation} → {booking.destination}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">Booked: {booking.bookingTime}</p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(booking.status)}`}
                        >
                          <span>{getStatusIcon(booking.status)}</span>
                          <span>{booking.status.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
