"use client"

import { useState } from "react"

interface MedicineAnalysis {
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

interface MedicineAnalysisCardProps {
  medicine: MedicineAnalysis
  onRemove?: () => void
}

export default function MedicineAnalysisCard({ medicine, onRemove }: MedicineAnalysisCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("why")
  const [showAll, setShowAll] = useState(false)

  const sections = [
    { id: "why", label: "Why Prescribed", icon: "💊" },
    { id: "how", label: "How It Works", icon: "⚙️" },
    { id: "uses", label: "Uses", icon: "✓" },
    { id: "dosage", label: "Dosage", icon: "📊" },
    { id: "ingredients", label: "Ingredients", icon: "🧪" },
    { id: "alternatives", label: "Alternatives", icon: "🔄" },
    { id: "sideEffects", label: "Side Effects", icon: "⚠️" },
    { id: "interactions", label: "Interactions", icon: "🚫" },
    { id: "where", label: "Where to Buy", icon: "🏪" },
    { id: "storage", label: "Storage", icon: "📦" },
  ]

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  const renderContent = (section: string) => {
    switch (section) {
      case "why":
        return <p className="text-slate-700 text-sm leading-relaxed">{medicine.why_prescribed}</p>
      case "how":
        return <p className="text-slate-700 text-sm leading-relaxed">{medicine.how_it_works}</p>
      case "uses":
        return (
          <ul className="list-disc list-inside space-y-1">
            {medicine.uses.map((use, i) => (
              <li key={i} className="text-slate-700 text-sm">
                {use}
              </li>
            ))}
          </ul>
        )
      case "dosage":
        return <p className="text-slate-700 text-sm leading-relaxed">{medicine.dosage}</p>
      case "ingredients":
        return <p className="text-slate-700 text-sm leading-relaxed">{medicine.ingredients}</p>
      case "alternatives":
        return (
          <div className="space-y-2">
            {medicine.alternatives.map((alt, i) => (
              <div key={i} className="bg-sky-50 p-2 rounded-lg text-sm text-slate-700">
                {alt}
              </div>
            ))}
          </div>
        )
      case "sideEffects":
        return (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-2">Common</h4>
              <ul className="space-y-1">
                {medicine.side_effects.common.map((effect, i) => (
                  <li key={i} className="text-slate-700 text-sm flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">•</span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-2">Serious</h4>
              <ul className="space-y-1">
                {medicine.side_effects.serious.map((effect, i) => (
                  <li key={i} className="text-red-700 text-sm flex items-start gap-2">
                    <span className="text-red-500 text-xs mt-1">⚠</span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      case "interactions":
        return (
          <div className="space-y-2">
            {medicine.interactions.map((interaction, i) => (
              <div key={i} className="bg-red-50 p-2 rounded-lg text-sm text-slate-700 border-l-2 border-red-300">
                {interaction}
              </div>
            ))}
          </div>
        )
      case "where":
        return (
          <div className="space-y-2">
            {medicine.where_to_buy.map((place, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-green-500">✓</span>
                {place}
              </div>
            ))}
          </div>
        )
      case "storage":
        return <p className="text-slate-700 text-sm leading-relaxed">{medicine.storage_tips}</p>
      default:
        return null
    }
  }

  const visibleSections = showAll ? sections : sections.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-200">
        <h3 className="text-2xl font-bold text-sky-900">{medicine.medicineName}</h3>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 transition-colors text-xl hover:scale-110"
          title="Remove medicine"
        >
          ✕
        </button>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3 mb-6">
        {visibleSections.map((section) => (
          <div key={section.id} className="rounded-xl overflow-hidden border border-slate-200">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full px-4 py-3 flex items-center justify-between text-left font-semibold transition-colors ${
                expandedSection === section.id
                  ? "bg-sky-100 text-sky-900"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{section.icon}</span>
                <span>{section.label}</span>
              </div>
              <span className={`transition-transform text-lg ${expandedSection === section.id ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {expandedSection === section.id && (
              <div className="px-4 py-4 bg-white border-t border-slate-200 animate-in fade-in duration-200">
                {renderContent(section.id)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && sections.length > 5 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sky-600 font-semibold hover:bg-sky-50 rounded-lg transition-colors text-sm"
        >
          + Show {sections.length - 5} More Details
        </button>
      )}

      {showAll && sections.length > 5 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors text-sm"
        >
          Show Less
        </button>
      )}
    </div>
  )
}
