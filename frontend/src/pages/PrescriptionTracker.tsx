"use client"

import { useState, useEffect } from "react"
import MedicineAnalysisCard from "../components/MedicalAnalysisCard"

interface MedicineAnalysis {
  id: string
  medicineName: string
  why_prescribed: string
  how_it_works: string
  alternatives: string[]
  ingredients: string
  uses: string[]
  dosage: string
  side_effects: {
    common: string[]
    serious: string[]
  }
  interactions: string[]
  where_to_buy: string[]
  storage_tips: string
}

interface PrescriptionTrackerProps {
  onNavigate: (page: string) => void
}

export default function PrescriptionTracker({ onNavigate }: PrescriptionTrackerProps) {
  const [medicineInput, setMedicineInput] = useState("")
  const [medicines, setMedicines] = useState<MedicineAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [analyzingMedicine, setAnalyzingMedicine] = useState<string | null>(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const userId = localStorage.getItem("user_id")

      if (!token || !userId) {
        setError("Not authenticated. Please log in again.")
        return
      }

      const response = await fetch(`http://localhost:5000/api/prescriptions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch prescriptions")

      const data = await response.json()
      setMedicines(data.prescriptions || [])
    } catch (err) {
      console.error("[v0] Error fetching prescriptions:", err)
      setError("Failed to load prescriptions")
    }
  }

  const analyzeMedicine = async () => {
    if (!medicineInput.trim()) {
      setError("Please enter a medicine name")
      return
    }

    setAnalyzingMedicine(medicineInput)
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("auth_token")
      const userId = localStorage.getItem("user_id")

      if (!token || !userId) {
        setError("Not authenticated. Please log in again.")
        setLoading(false)
        return
      }

      const response = await fetch(`http://localhost:5000/api/prescriptions/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicine_name: medicineInput,
          user_id: userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze medicine")
      }

      const data = await response.json()
      const newMedicine: MedicineAnalysis = {
        id: Date.now().toString(),
        medicineName: data.medicine_name || medicineInput,
        why_prescribed: data.why_prescribed || "Not available",
        how_it_works: data.how_it_works || "Not available",
        alternatives: data.alternatives || [],
        ingredients: data.ingredients || "Not available",
        uses: data.uses || [],
        dosage: data.dosage || "Not available",
        side_effects: {
          common: data.side_effects?.common || [],
          serious: data.side_effects?.serious || [],
        },
        interactions: data.interactions || [],
        where_to_buy: data.where_to_buy || [],
        storage_tips: data.storage_tips || "Not available",
      }

      setMedicines([newMedicine, ...medicines])
      setMedicineInput("")
      setSuccessMessage(`"${medicineInput}" has been analyzed. Scroll down to see details!`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      console.error("[v0] Error analyzing medicine:", err)
      setError(err.message || "Failed to analyze medicine. Please try again.")
    } finally {
      setLoading(false)
      setAnalyzingMedicine(null)
    }
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      analyzeMedicine()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-3">Prescription Analyzer</h1>
          <p className="text-slate-600 text-lg">
            Add your medicines to get AI-powered insights about what you're taking
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-sky-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={medicineInput}
              onChange={(e) => setMedicineInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter medicine name (e.g., Aspirin, Amoxicillin)..."
              className="flex-1 px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-slate-700 placeholder-slate-400 transition-colors"
              disabled={loading}
            />
            <button
              onClick={analyzeMedicine}
              disabled={loading || !medicineInput.trim()}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all text-lg flex items-center justify-center gap-2 whitespace-nowrap ${
                loading || !medicineInput.trim()
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-start gap-3 animate-in fade-in">
              <span className="text-xl">✓</span>
              <p>{successMessage}</p>
            </div>
          )}

          {analyzingMedicine && loading && (
            <div className="mt-4 p-4 bg-sky-50 border-l-4 border-sky-500 rounded-lg text-sky-700 flex items-start gap-3">
              <span className="text-xl">💊</span>
              <p>Analyzing "{analyzingMedicine}"... This may take a moment.</p>
            </div>
          )}
        </div>

        {/* Medicines List */}
        {medicines.length > 0 ? (
          <div className="space-y-6">
            <div className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
              {medicines.length} {medicines.length === 1 ? "Medicine" : "Medicines"} Added
            </div>
            {medicines.map((medicine) => (
              <MedicineAnalysisCard
                key={medicine.id}
                medicine={medicine}
                onRemove={() => removeMedicine(medicine.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-md">
            <div className="text-6xl mb-4">💊</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Medicines Yet</h3>
            <p className="text-slate-500 mb-4">Start by entering a medicine name to get detailed insights</p>
            <p className="text-sm text-slate-400">
              Our AI will provide information about why it's prescribed, alternatives, side effects, and more
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
