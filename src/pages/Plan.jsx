import { useState } from 'react'
import { useStore } from '../store/useStore'
import { SPLITS, GOALS, EXERCISES, EXERCISES_MAP } from '../data/exercises'
import { Sparkles, ChevronDown, ChevronUp, Check, RefreshCw, AlertTriangle } from 'lucide-react'
import { askClaudeForJSON } from '../utils/api'
import PageContainer from '../components/PageContainer'

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

// Rule-based fallback for injury guidance — same role as getMockRecommendation
// below: used in demo mode (no API key) and if the live call fails.
function getMockInjuryGuidance(injury) {
  const ids = INJURY_SWAPS[injury] || []
  return {
    avoid: ids.map(id => ({
      exercise: id,
      reason: null,
      alternatives: (EXERCISES_MAP[id]?.alternatives || []).slice(0, 2),
    })),
  }
}

function buildInjuryPrompt(injury) {
  const catalog = EXERCISES.map(e => `- "${e.id}": ${e.name} (${e.muscle}, ${e.equipment})`).join('\n')
  return `A lifter has a "${injury}" injury or is experiencing pain there. From this exact exercise catalog (use the quoted id verbatim, never invent an id), identify which exercises they should avoid or modify, and a safer alternative for each from the same catalog.

${catalog}

Return ONLY valid JSON in this shape, no other text:
{"avoid":[{"exercise":"<id from catalog>","reason":"1 short clause on why it stresses this injury","alternatives":["<id>","<id>"]}],"note":"1 short sentence of general caution, e.g. suggesting they stop if it hurts or see a professional for anything serious"}
Limit to the 4-8 most relevant exercises. Only use exercise ids that appear in the catalog above.`
}

function InjuryHelper() {
  const [selectedInjury, setSelectedInjury] = useState(null)
  const [loading, setLoading] = useState(false)
  const [guidance, setGuidance] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState(null)

  async function selectInjury(injury) {
    if (selectedInjury === injury) {
      setSelectedInjury(null)
      setGuidance(null)
      return
    }
    setSelectedInjury(injury)
    setGuidance(null)
    setError(null)
    setLoading(true)
    try {
      const result = await askClaudeForJSON(buildInjuryPrompt(injury), 800)
      if (result.demo) {
        setGuidance(getMockInjuryGuidance(injury))
        setIsDemo(true)
      } else if (Array.isArray(result.avoid)) {
        const cleaned = result.avoid.filter(a => EXERCISES_MAP[a.exercise])
        if (cleaned.length === 0) throw new Error('No valid exercises in response')
        setGuidance({ avoid: cleaned, note: result.note })
        setIsDemo(false)
      } else {
        throw new Error('Unexpected response shape')
      }
    } catch {
      setGuidance(getMockInjuryGuidance(injury))
      setIsDemo(true)
      setError("Couldn't reach the AI right now — showing general guidance instead.")
    } finally {
      setLoading(false)
    }
  }

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
            onClick={() => selectInjury(injury)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
              selectedInjury === injury ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/8 text-gray-400 border border-white/8'
            }`}
          >
            {injury}
          </button>
        ))}
      </div>

      {selectedInjury && loading && (
        <div className="border-t border-white/8 pt-3 flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw size={14} className="animate-spin" />
          Checking exercises for your {selectedInjury}...
        </div>
      )}

      {selectedInjury && !loading && guidance && (
        <div className="border-t border-white/8 pt-3 space-y-3">
          {error && (
            <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-400/10 rounded-xl p-2.5">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-gray-400">Avoid these with a <span className="text-red-400 font-medium">{selectedInjury}</span> injury:</div>
            {isDemo && (
              <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full shrink-0">Demo mode</span>
            )}
          </div>
          <div className="space-y-1.5">
            {guidance.avoid.map(({ exercise: id, reason, alternatives }) => {
              const ex = EXERCISES_MAP[id]
              if (!ex) return null
              const alts = (alternatives || []).filter(a => EXERCISES_MAP[a]).slice(0, 2)
              return (
                <div key={id} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  <div>
                    <span className="text-white">{ex.name}</span>
                    {reason && <span className="text-gray-500"> — {reason}</span>}
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
          {guidance.note && (
            <p className="text-xs text-gray-600 italic">{guidance.note}</p>
          )}
          <p className="text-xs text-gray-600">Not medical advice. Stop if something hurts, and see a professional for anything more than mild discomfort.</p>
        </div>
      )}
    </div>
  )
}

// Rule-based fallback used when no Claude API access is available (local dev
// with no key pasted in Settings, or the live API call fails) — keeps the
// feature usable instead of just erroring out.
function getMockRecommendation(goal) {
  if (goal === 'bulk' || goal === 'build-muscle') {
    return {
      split: 'push-pull-legs',
      reason: 'Push/Pull/Legs maximizes weekly volume per muscle group (each hit twice a week), which is optimal for hypertrophy and muscle growth.',
      tips: ['Aim for 6-12 rep range', 'Progressive overload every week', 'Eat in a caloric surplus'],
    }
  }
  if (goal === 'strength') {
    return {
      split: 'upper-lower',
      reason: 'Upper/Lower splits let you hit compound lifts frequently with enough rest for nervous system recovery — ideal for strength gains.',
      tips: ['Focus on 3-6 rep range for compounds', 'Rest 3-5 min between heavy sets', 'Prioritize bench, squat, deadlift'],
    }
  }
  if (goal === 'lose-fat') {
    return {
      split: 'full-body',
      reason: 'Full body training 3x/week burns more calories per session and maintains muscle while in a deficit.',
      tips: ['Keep rest periods short (60-90s)', 'Add cardio on off days', 'Eat at a ~300-500 calorie deficit'],
    }
  }
  return {
    split: 'upper-lower',
    reason: 'Upper/Lower is the most balanced split — great frequency, good volume, and manageable weekly commitment.',
    tips: ['Stay consistent 4 days/week', 'Progressive overload even at maintenance', 'Prioritize sleep and recovery'],
  }
}

function buildRecommendationPrompt(goal, goalLabel) {
  const splitList = Object.entries(SPLITS)
    .map(([key, s]) => `- "${key}": ${s.name} — ${s.description}`)
    .join('\n')
  return `You are a strength coach. A lifter's goal is "${goalLabel}". Recommend the single best workout split for them from this exact list (use the quoted key verbatim):
${splitList}

Return ONLY valid JSON in this shape, no other text:
{"split":"<one of the keys above>","reason":"1-2 sentence explanation tailored to their goal","tips":["tip 1","tip 2","tip 3"]}`
}

function AIPlanner() {
  const { data, setActivePlan } = useStore()
  const [generating, setGenerating] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState(null)

  async function generateRecommendation() {
    setGenerating(true)
    setError(null)
    const goal = data.profile.goal
    const goalLabel = GOALS.find(g => g.id === goal)?.label || 'general fitness'
    try {
      const result = await askClaudeForJSON(buildRecommendationPrompt(goal, goalLabel))
      if (result.demo) {
        setRecommendation(getMockRecommendation(goal))
        setIsDemo(true)
      } else if (SPLITS[result.split] && result.reason && Array.isArray(result.tips)) {
        setRecommendation(result)
        setIsDemo(false)
      } else {
        throw new Error('Unexpected response shape')
      }
    } catch {
      // Claude call failed (bad/missing key, network, rate limit, etc.) —
      // fall back to the rule-based recommendation rather than a dead end.
      setRecommendation(getMockRecommendation(goal))
      setIsDemo(true)
      setError("Couldn't reach the AI right now — showing a rule-based recommendation instead.")
    } finally {
      setGenerating(false)
    }
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
          {error && (
            <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-400/10 rounded-xl p-2.5">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="bg-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#e8ff5a]">
                Recommended: {SPLITS[recommendation.split].name}
              </div>
              {isDemo && (
                <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full shrink-0">Demo mode</span>
              )}
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
    <PageContainer>
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
    </PageContainer>
  )
}
