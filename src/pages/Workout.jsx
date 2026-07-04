import { useState } from 'react'
import { useStore } from '../store/useStore'
import { EXERCISES_MAP, DAYS, DAY_SHORT, SPLITS } from '../data/exercises'
import { Plus, Minus, ChevronLeft, ChevronRight, RefreshCw, Check } from 'lucide-react'

function getWeekDates(referenceDate, weekOffset = 0) {
  const d = new Date(referenceDate + 'T12:00:00')
  const dayOfWeek = (d.getDay() + 6) % 7 // Mon=0
  const monday = new Date(d)
  monday.setDate(d.getDate() - dayOfWeek + weekOffset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return day.toISOString().slice(0, 10)
  })
}

function ExerciseCard({ exerciseId, date, isAlternate, onSwapBack }) {
  const { data, logSet, addSet, removeSet } = useStore()
  const ex = EXERCISES_MAP[exerciseId]
  if (!ex) return null

  const sets = data.logs[date]?.[exerciseId] || []
  const defaultSet = sets.length > 0 ? sets[0] : { reps: 10, weight: 0 }

  function handleChange(idx, field, val) {
    const current = sets[idx] || { reps: 10, weight: 0 }
    logSet(date, exerciseId, idx, field === 'reps' ? val : current.reps, field === 'weight' ? val : current.weight)
  }

  return (
    <div className="bg-[#161616] rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-[15px]">{ex.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{ex.muscle} · {ex.equipment}</div>
        </div>
        {isAlternate && (
          <button onClick={onSwapBack} className="text-xs text-[#e8ff5a] flex items-center gap-1 shrink-0 mt-0.5">
            <RefreshCw size={11} /> Original
          </button>
        )}
      </div>

      {/* Set headers */}
      <div className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 text-xs text-gray-500 px-1">
        <div>Set</div>
        <div className="text-center">Weight (lbs)</div>
        <div className="text-center">Reps</div>
        <div />
      </div>

      {/* Sets */}
      {sets.length === 0 ? (
        <button
          onClick={() => { logSet(date, exerciseId, 0, defaultSet.reps, defaultSet.weight) }}
          className="w-full py-3 border border-dashed border-white/15 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add first set
        </button>
      ) : (
        <div className="space-y-2">
          {sets.map((set, idx) => (
            <div key={idx} className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 items-center">
              <div className="text-sm text-gray-500 text-center">{idx + 1}</div>
              <input
                type="number"
                inputMode="decimal"
                value={set?.weight ?? 0}
                onChange={e => handleChange(idx, 'weight', Number(e.target.value))}
                className="bg-[#222] border border-white/8 rounded-xl px-3 py-2 text-center text-[15px] font-semibold text-white w-full outline-none focus:border-[#e8ff5a]/40"
              />
              <input
                type="number"
                inputMode="numeric"
                value={set?.reps ?? 0}
                onChange={e => handleChange(idx, 'reps', Number(e.target.value))}
                className="bg-[#222] border border-white/8 rounded-xl px-3 py-2 text-center text-[15px] font-semibold text-white w-full outline-none focus:border-[#e8ff5a]/40"
              />
              <button onClick={() => removeSet(date, exerciseId, idx)} className="flex items-center justify-center text-gray-600 active:text-red-400">
                <Minus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {sets.length > 0 && (
        <button
          onClick={() => addSet(date, exerciseId)}
          className="w-full py-2.5 border border-white/10 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-2 active:bg-white/5"
        >
          <Plus size={14} /> Add Set
        </button>
      )}
    </div>
  )
}

function DayView({ date, planDay }) {
  const [swaps, setSwaps] = useState({}) // exerciseId -> alternateId

  const exercises = planDay.exercises || []
  const isRest = planDay.label === 'Rest'

  function swap(exerciseId) {
    const ex = EXERCISES_MAP[exerciseId]
    if (!ex?.alternatives?.length) return
    const alts = ex.alternatives.filter(a => EXERCISES_MAP[a])
    if (!alts.length) return
    const currentAlt = swaps[exerciseId]
    const currentIdx = currentAlt ? alts.indexOf(currentAlt) : -1
    const next = alts[(currentIdx + 1) % alts.length]
    setSwaps(s => ({ ...s, [exerciseId]: next }))
  }

  function swapBack(exerciseId) {
    setSwaps(s => { const n = { ...s }; delete n[exerciseId]; return n })
  }

  if (isRest) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center">
        <div className="text-5xl">😴</div>
        <div className="text-xl font-semibold">Rest Day</div>
        <div className="text-sm text-gray-500">Recovery is part of the gains.<br />Stay hydrated.</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">{planDay.label}</div>
          <div className="text-sm text-gray-500">{(planDay.muscles || []).join(' · ')}</div>
        </div>
        <div className="text-xs bg-[#e8ff5a]/15 text-[#e8ff5a] px-3 py-1.5 rounded-full font-medium">
          {exercises.length} exercises
        </div>
      </div>

      {exercises.map(exId => {
        const displayId = swaps[exId] || exId
        return (
          <div key={exId} className="space-y-1">
            <ExerciseCard
              exerciseId={displayId}
              date={date}
              isAlternate={!!swaps[exId]}
              onSwapBack={() => swapBack(exId)}
            />
            <button
              onClick={() => swap(exId)}
              className="text-xs text-gray-600 flex items-center gap-1 pl-1 active:text-gray-400"
            >
              <RefreshCw size={10} /> Swap exercise
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default function Workout() {
  const { today, getPlanDay, data } = useStore()
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState(today)

  const weekDates = getWeekDates(today, weekOffset)
  const isThisWeek = weekOffset === 0

  const planDay = getPlanDay(selectedDate)

  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  function goToToday() {
    setWeekOffset(0)
    setSelectedDate(today)
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {data.profile.name ? `Hey, ${data.profile.name} 👋` : 'Workout'}
            </h1>
            <p className="text-gray-500 text-sm">{dateLabel}</p>
          </div>
          {!isThisWeek && (
            <button onClick={goToToday} className="text-xs text-[#e8ff5a] border border-[#e8ff5a]/30 px-3 py-1.5 rounded-full">
              Today
            </button>
          )}
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 text-gray-400 active:text-white">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDates.map((date, i) => {
              const isSelected = date === selectedDate
              const isToday = date === today
              const dayPlan = getPlanDay(date)
              const isRest = dayPlan.label === 'Rest'
              const hasLog = data.logs[date] && Object.values(data.logs[date]).some(s => s.length > 0)
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                    isSelected ? 'bg-[#e8ff5a]' : isToday ? 'bg-white/10' : 'bg-transparent'
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                    {DAY_SHORT[i]}
                  </span>
                  <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-black' : isToday ? 'text-white' : 'text-gray-400'}`}>
                    {new Date(date + 'T12:00:00').getDate()}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isRest ? 'bg-transparent' :
                    hasLog ? (isSelected ? 'bg-black/60' : 'bg-[#e8ff5a]') :
                    (isSelected ? 'bg-black/30' : 'bg-white/20')
                  }`} />
                </button>
              )
            })}
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 text-gray-400 active:text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day content */}
      <div className="px-4 pt-2">
        <DayView date={selectedDate} planDay={planDay} />
      </div>
    </div>
  )
}
