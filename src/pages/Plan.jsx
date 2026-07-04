import { useState } from 'react'
import { useStore } from '../store/useStore'
import { SPLITS, GOALS, EXERCISES_MAP } from '../data/exercises'
import { Sparkles, ChevronDown, ChevronUp, Check, RefreshCw } from 'lucide-react'

const DAY_COLORS = {
  Push: '#e8ff5a',
  Pull: '#60a5fa',
  Legs: '#a78bfa',
  Chest: '#fb923c',
  Back: '#34d399',
  Shoulders: '#f472b6',
  Arms: '#facc15',
  'Full Body A': '#e8ff5a',
  'Full Body B': '#60a5fa',
  'Full Body C': '#a78bfa',
  Upper: '#e8ff5a',
  Lower: '#a78bfa',
  Rest: '#374151',
}

const INJURY_SWAPS = {
  'shoulder': ['overhead-press', 'dumbbell-shoulder-press', 'lateral-raise', 'front-raise', 'bench-press', 'incline-bench-press'],
  'knee': ['squat', 'leg-press', 'hack-squat', 'lunges', 'leg-extension'],
  'lower back': ['deadlift', 'romanian-deadlift', 'barbell-row', 'squat'],
  'elbow': ['skull-crusher', 'overhead-tricep-extension', 'preacher-curl', 'barbell-curl'],
  'wrist': ['barbell-curl', 'barbell-row', 'bench-press', 'overhead-press'],
}

function SplitCard({ splitKey, split, isActive, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const days = Object.entries(split.days)
  const workDays = days.filter(([, d]) => d.label !== 'Rest').length

  return (
    <div className={`bg-[#161616] rounded-2xl border transition-all ${isActive ? 'border-[#e8ff5a]/50' : 'border-white/8'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{split.name}</span>
              {isActive && <span className="text-xs bg-[#e8ff5a] text-black px-2 py-0.5 rounded-full font-medium">Active</span>}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{split.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-500 active:text-white"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Day pills */}
        <div className="flex gap-1.5 flex-wrap mt-3">
          {days.map(([day, d]) => (
            <span
              key={day}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{
                background: (DAY_COLORS[d.label] || '#374151') + '20',
                color: DAY_COLORS[d.label] || '#6b7280'
              }}
            >
              {day.slice(0, 3)}: {d.label}
            </span>
          ))}
        </div>

        {!isActive && (
          <button
            onClick={() => onSelect(splitKey)}
            className="mt-3 w-full py-2.5 border border-[#e8ff5a]/40 text-[#e8ff5a] rounded-xl text-sm font-medium active:bg-[#e8ff5a]/10"
          >
            Switch to This Split
          </button>
        )}
      </div>

      {/* Expanded exercise list */}
      {expanded && (
        <div className="border-t border-white/8 p-4 space-y-3">
          {days.map(([day, d]) => (
            <div key={day}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: DAY_COLORS[d.label] || '#374151' }} />
                <span className="text-xs font-semibold text-gray-300">{day} — {d.label}</span>
              </div>
              {d.exercises.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-4">
                  {d.exercises.map(id => (
                    <span key={id} className="text-[11px] text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
                      {EXERCISES_MAP[id]?.name || id}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="pl-4 text-xs text-gray-600 italic">Rest day 😴</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InjuryHelper() {
  const [selectedInjury, setSelectedInjury] = useState(null)

  return (
    <div className="bg-[#161616] rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🤕</span>
        <div>
          <div className="font-bold">Injured? Find substitutes</div>
          <div className="text-xs text-gray-500">Select what's bothering you</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(INJURY_SWAPS).map(injury => (
          <button
            key={injury}
            onClick={() => setSelectedInjury(selectedInjury === injury ? null : injury)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
              selectedInjury === injury ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/8 text-gray-400 border border-white/8'
            }`}
          >
            {injury}
          </button>
        ))}
      </div>
      {selectedInjury && (
        <div className="border-t border-white/8 pt-3">
          <div className="text-sm text-gray-400 mb-2">Avoid these with a <span className="text-red-400 font-medium">{selectedInjury}</span> injury:</div>
          <div className="space-y-1.5">
            {INJURY_SWAPS[selectedInjury].map(id => {
              const ex = EXERCISES_MAP[id]
              if (!ex) return null
              const alts = ex.alternatives?.slice(0, 2) || []
              return (
                <div key={id} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  <div>
                    <span className="text-white">{ex.name}</span>
                    {alts.length > 0 && (
                      <span className="text-gray-500"> → swap for <span className="text-green-400">
                        {alts.map(a => EXERCISES_MAP[a]?.name).filter(Boolean).join(' or ')}
                      </span></span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function AIPlanner() {
  const { data, setActivePlan } = useStore()
  const [generating, setGenerating] = useState(false)
  const [recommendation, setRecommendation] = useState(null)

  function generateRecommendation() {
    setGenerating(true)
    // AI-style recommendation logic based on goal
    setTimeout(() => {
      const goal = data.profile.goal
      let rec
      if (goal === 'bulk' || goal === 'build-muscle') {
        rec = {
          split: 'push-pull-legs',
          reason: 'Push/Pull/Legs maximizes weekly volume per muscle group (each hit twice a week), which is optimal for hypertrophy and muscle growth.',
          tips: ['Aim for 6-12 rep range', 'Progressive overload every week', 'Eat in a caloric surplus']
        }
      } else if (goal === 'strength') {
        rec = {
          split: 'upper-lower',
          reason: 'Upper/Lower splits let you hit compound lifts frequently with enough rest for nervous system recovery — ideal for strength gains.',
          tips: ['Focus on 3-6 rep range for compounds', 'Rest 3-5 min between heavy sets', 'Prioritize bench, squat, deadlift']
        }
      } else if (goal === 'lose-fat') {
        rec = {
          split: 'full-body',
          reason: 'Full body training 3x/week burns more calories per session and maintains muscle while in a deficit.',
          tips: ['Keep rest periods short (60-90s)', 'Add cardio on off days', 'Eat at a ~300-500 calorie deficit']
        }
      } else {
        rec = {
          split: 'upper-lower',
          reason: 'Upper/Lower is the most balanced split — great frequency, good volume, and manageable weekly commitment.',
          tips: ['Stay consistent 4 days/week', 'Progressive overload even at maintenance', 'Prioritize sleep and recovery']
        }
      }
      setRecommendation(rec)
      setGenerating(false)
    }, 1200)
  }

  const goalLabel = GOALS.find(g => g.id === data.profile.goal)?.label || 'your goal'

  return (
    <div className="bg-[#161616] rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e8ff5a]/15 flex items-center justify-center">
          <Sparkles size={20} className="text-[#e8ff5a]" />
        </div>
        <div>
          <div className="font-bold">AI Plan Recommender</div>
          <div className="text-xs text-gray-500">Goal: <span className="text-white">{goalLabel}</span></div>
        </div>
      </div>

      {!recommendation ? (
        <button
          onClick={generateRecommendation}
          disabled={generating}
          className="w-full py-3 bg-[#e8ff5a] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60"
        >
          {generating ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Analyzing your goal...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Recommend me a split
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-3 space-y-2">
            <div className="text-sm font-semibold text-[#e8ff5a]">
              Recommended: {SPLITS[recommendation.split].name}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{recommendation.reason}</p>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Pro tips for your goal</div>
            {recommendation.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check size={14} className="text-[#e8ff5a] mt-0.5 shrink-0" />
                <span className="text-gray-300">{tip}</span>
              </div>
            ))}
          </div>
          {data.activePlan !== recommendation.split && (
            <button
              onClick={() => { setActivePlan(recommendation.split); setRecommendation(null) }}
              className="w-full py-2.5 bg-[#e8ff5a] text-black font-bold rounded-xl text-sm"
            >
              Switch to {SPLITS[recommendation.split].name}
            </button>
          )}
          {data.activePlan === recommendation.split && (
            <div className="text-center text-sm text-green-400 flex items-center justify-center gap-1">
              <Check size={14} /> Already on this split
            </div>
          )}
          <button onClick={() => setRecommendation(null)} className="w-full text-sm text-gray-500 text-center py-1">
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default function Plan() {
  const { data, setActivePlan } = useStore()

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-2xl font-bold">Plan</h1>
        <p className="text-gray-500 text-sm mt-1">Your workout split and AI recommendations</p>
      </div>

      <div className="px-4 space-y-4">
        <AIPlanner />
        <InjuryHelper />

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">All Splits</div>
          <div className="space-y-3">
            {Object.entries(SPLITS).map(([key, split]) => (
              <SplitCard
                key={key}
                splitKey={key}
                split={split}
                isActive={data.activePlan === key}
                onSelect={setActivePlan}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
