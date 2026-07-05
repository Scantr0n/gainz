import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { GOALS } from '../data/exercises'
import { ChevronLeft, Trash2, Download, Upload, Check } from 'lucide-react'
import PageContainer from '../components/PageContainer'

export default function Settings() {
  const { data, updateProfile, resetApp, importData } = useStore()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const [importStatus, setImportStatus] = useState(null) // { ok, message }
  const [exported, setExported] = useState(false)
  const fileInputRef = useRef(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gainz-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (!parsed || typeof parsed !== 'object' || typeof parsed.profile !== 'object' || typeof parsed.logs !== 'object') {
          throw new Error('shape')
        }
        importData(parsed)
        const sessions = Object.keys(parsed.logs || {}).length
        setImportStatus({ ok: true, message: `Backup restored — ${sessions} workout day${sessions === 1 ? '' : 's'}, ${(parsed.photos || []).length} photos.` })
      } catch {
        setImportStatus({ ok: false, message: "That file doesn't look like a Gainz backup." })
      }
      setTimeout(() => setImportStatus(null), 5000)
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
      return
    }
    resetApp()
  }

  return (
    <PageContainer>
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
              min="0"
              placeholder="e.g. 175"
              value={data.profile.bodyweight ?? ''}
              onChange={e => updateProfile({ bodyweight: Math.max(0, Number(e.target.value)) || null })}
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

        {/* Data backup */}
        <div className="bg-[#161616] rounded-2xl p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</div>
          <button
            onClick={handleExport}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#e8ff5a] text-black active:scale-98 transition-all"
          >
            {exported ? <Check size={15} /> : <Download size={15} />}
            {exported ? 'Backup downloaded' : 'Export backup'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/15 text-gray-300 active:bg-white/5"
          >
            <Upload size={15} />
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          {importStatus && (
            <div className={`text-xs rounded-xl px-3 py-2.5 ${importStatus.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {importStatus.message}
            </div>
          )}
          <p className="text-xs text-gray-600">Your data lives only in this browser. Export a backup before clearing browser data or switching devices. Importing replaces everything currently in the app.</p>
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
    </PageContainer>
  )
}
