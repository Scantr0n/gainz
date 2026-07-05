import { useState } from 'react'
import { Flame, ChevronDown, ChevronUp } from 'lucide-react'
import { computeWarmupSets } from '../utils/warmup'

export default function WarmupCalculator({ workingWeight }) {
  const [open, setOpen] = useState(false)
  const sets = computeWarmupSets(workingWeight)
  if (sets.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-xs text-orange-400 flex items-center gap-1 pl-1 active:text-orange-300"
      >
        <Flame size={11} /> Warm-up sets
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {open && (
        <div className="mt-2 bg-white/5 rounded-xl p-3 space-y-1.5">
          {sets.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Warm-up {i + 1}</span>
              <span className="text-white font-medium">{s.weight} lbs × {s.reps}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm border-t border-white/10 pt-1.5 mt-1.5">
            <span className="text-[#e8ff5a]">Working set</span>
            <span className="text-[#e8ff5a] font-semibold">{workingWeight} lbs</span>
          </div>
        </div>
      )}
    </div>
  )
}
