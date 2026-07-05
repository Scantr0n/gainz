import { useState, useEffect } from 'react'
import { X, Plus, Minus, Timer } from 'lucide-react'

export default function RestTimer({ endAt, totalSeconds, onSkip, onAdjust }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!endAt) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [endAt])

  const remaining = endAt ? Math.max(0, Math.ceil((endAt - now) / 1000)) : 0
  const done = !!endAt && remaining <= 0

  useEffect(() => {
    if (!done) return
    if (navigator.vibrate) navigator.vibrate([120, 80, 120])
    const id = setTimeout(onSkip, 15000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-arm when done flips, not on every onSkip identity change
  }, [done])

  if (!endAt) return null

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const pct = Math.min(100, Math.max(0, ((totalSeconds - remaining) / totalSeconds) * 100))

  return (
    <div className="fixed bottom-[68px] left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-40">
      <div className={`rounded-2xl p-3.5 flex items-center gap-3 shadow-lg border ${done ? 'bg-[#e8ff5a] border-[#e8ff5a]' : 'bg-[#161616] border-white/10'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-black/10' : 'bg-[#e8ff5a]/15'}`}>
          <Timer size={18} className={done ? 'text-black' : 'text-[#e8ff5a]'} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium ${done ? 'text-black/70' : 'text-gray-500'}`}>
            {done ? 'Rest complete' : 'Resting'}
          </div>
          <div className={`text-lg font-bold tabular-nums ${done ? 'text-black' : 'text-white'}`}>
            {done ? "Let's go 💪" : `${mins}:${String(secs).padStart(2, '0')}`}
          </div>
          {!done && (
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-[#e8ff5a] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>

        {!done && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onAdjust(-15)} className="w-8 h-8 flex items-center justify-center text-gray-400 active:text-white">
              <Minus size={15} />
            </button>
            <button onClick={() => onAdjust(15)} className="w-8 h-8 flex items-center justify-center text-gray-400 active:text-white">
              <Plus size={15} />
            </button>
          </div>
        )}
        <button
          onClick={onSkip}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? 'text-black/60 active:text-black' : 'text-gray-500 active:text-white'}`}
        >
          <X size={17} />
        </button>
      </div>
    </div>
  )
}
