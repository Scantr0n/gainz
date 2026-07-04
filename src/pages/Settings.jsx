import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { GOALS } from '../data/exercises'
import { ChevronLeft, Trash2 } from 'lucide-react'

export default function Settings() {
  const { data, updateProfile, resetApp } = useStore()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
      return
    }
    resetApp()
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-4 pt-14 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-400 active:text-white">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 text-sm">Profile and app options</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Profile */}
        <div className="bg-[#161616] rounded-2xl p-4 space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile</div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your name</label>
            <input
              type="text"
              placeholder="e.g. Jack"
              value={data.profile.name}
              onChange={e => updateProfile({ name: e.target.value })}
              className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#e8ff5a]/50 text-base"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Bodyweight (lbs)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 175"
              value={data.profile.bodyweight ?? ''}
              onChange={e => updateProfile({ bodyweight: Number(e.target.value) || null })}
              className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#e8ff5a]/50 text-base"
            />
            <p className="text-xs text-gray-600 mt-2">Used to calculate your strength tiers.</p>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-[#161616] rounded-2xl p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Goal</div>
          <div className="space-y-2">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => updateProfile({ goal: g.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  data.profile.goal === g.id ? 'border-[#e8ff5a] bg-[#e8ff5a]/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="text-xl">{g.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{g.label}</div>
                  <div className="text-xs text-gray-500">{g.description}</div>
                </div>
                {data.profile.goal === g.id && (
                  <div className="w-4 h-4 rounded-full bg-[#e8ff5a] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600">Your workout split is managed on the Plan tab.</p>
        </div>

        {/* Danger zone */}
        <div className="bg-[#161616] rounded-2xl p-4 space-y-3 border border-red-500/15">
          <div className="text-xs font-semibold text-red-400/80 uppercase tracking-wide">Danger Zone</div>
          <button
            onClick={handleReset}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              confirmReset ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-400 border border-red-500/25'
            }`}
          >
            <Trash2 size={15} />
            {confirmReset ? 'Tap again to erase everything' : 'Reset all data'}
          </button>
          <p className="text-xs text-gray-600">Erases your profile, logs, and photos, and restarts onboarding. This cannot be undone.</p>
        </div>

        {/* About */}
        <div className="text-center text-xs text-gray-600 pt-2 pb-4">
          Gainz · Track. Progress. Dominate.
        </div>
      </div>
    </div>
  )
}
