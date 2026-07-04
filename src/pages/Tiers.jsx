import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { MUSCLE_GROUPS, TIER_CONFIG, EXERCISES, EXERCISES_MAP } from '../data/exercises'
import { Trophy, ChevronRight } from 'lucide-react'

const TIER_ORDER = ['elite', 'advanced', 'intermediate', 'novice', 'beginner']
const TIER_COLORS = {
  elite: '#f59e0b',
  advanced: '#8b5cf6',
  intermediate: '#3b82f6',
  novice: '#10b981',
  beginner: '#6b7280',
}
const TIER_BG = {
  elite: '#f59e0b20',
  advanced: '#8b5cf620',
  intermediate: '#3b82f620',
  novice: '#10b98120',
  beginner: '#6b728020',
}
const TIER_EMOJI = {
  elite: '👑',
  advanced: '💎',
  intermediate: '🔵',
  novice: '🟢',
  beginner: '⚪',
}

function TierBadge({ tier, size = 'md' }) {
  if (!tier) return null
  const config = TIER_CONFIG.find(t => t.key === tier)
  const color = TIER_COLORS[tier]
  const bg = TIER_BG[tier]
  const emoji = TIER_EMOJI[tier]
  const isLarge = size === 'lg'
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${isLarge ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}
      style={{ background: bg, color }}
    >
      {emoji} {config?.label}
    </span>
  )
}

function MuscleCard({ muscle }) {
  const { getMuscleStrengthLevel, getExerciseHistory, data } = useStore()
  const tier = getMuscleStrengthLevel(muscle)
  const tierConfig = tier ? TIER_CONFIG.find(t => t.key === tier) : null
  const tierIndex = tier ? TIER_ORDER.indexOf(tier) : -1

  // Find best exercise for this muscle
  const muscleExercises = EXERCISES.filter(e => e.muscle === muscle)
  const exerciseStats = muscleExercises.map(ex => {
    const h = getExerciseHistory(ex.id)
    if (h.length === 0) return null
    const best = Math.max(...h.map(d => d.maxWeight))
    return { name: ex.name, weight: best, sessions: h.length }
  }).filter(Boolean)

  const totalSessions = exerciseStats.reduce((s, e) => s + e.sessions, 0)
  const hasData = exerciseStats.length > 0

  // Progress to next tier
  const progressPct = tierIndex >= 0 ? Math.min(100, ((TIER_ORDER.length - 1 - tierIndex) / (TIER_ORDER.length - 1)) * 100) : 0

  return (
    <div className={`bg-[#161616] rounded-2xl p-4 border ${tier ? `border-[${TIER_COLORS[tier]}]/20` : 'border-white/5'}`}
      style={{ borderColor: tier ? TIER_COLORS[tier] + '20' : undefined }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-base">{muscle}</div>
          {hasData && <div className="text-xs text-gray-500 mt-0.5">{totalSessions} sessions</div>}
        </div>
        {tier ? <TierBadge tier={tier} /> : (
          <span className="text-xs text-gray-600 bg-white/5 px-2.5 py-1 rounded-full">No data</span>
        )}
      </div>

      {/* Progress bar */}
      {tier && (
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Elite</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: TIER_COLORS[tier] }}
            />
          </div>
        </div>
      )}

      {/* Top exercises */}
      {exerciseStats.length > 0 && (
        <div className="space-y-1.5 border-t border-white/5 pt-3">
          {exerciseStats.slice(0, 2).map(e => (
            <div key={e.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-400 truncate mr-2">{e.name}</span>
              <span className="text-white font-semibold shrink-0">{e.weight} lbs</span>
            </div>
          ))}
        </div>
      )}

      {!hasData && (
        <div className="text-xs text-gray-600 text-center py-2">Log {muscle.toLowerCase()} exercises to unlock your tier</div>
      )}

      {tier === 'elite' && (
        <div className="mt-3 text-center text-xs text-[#f59e0b] font-medium">🔥 You've mastered this muscle group</div>
      )}
    </div>
  )
}

export default function Tiers() {
  const { getMuscleStrengthLevel, data } = useStore()

  const rankedMuscles = useMemo(() => {
    return MUSCLE_GROUPS.filter(m => m !== 'Cardio').map(m => ({
      muscle: m,
      tier: getMuscleStrengthLevel(m),
      tierIndex: (() => {
        const t = getMuscleStrengthLevel(m)
        return t ? TIER_ORDER.indexOf(t) : 99
      })()
    })).sort((a, b) => a.tierIndex - b.tierIndex)
  }, [getMuscleStrengthLevel])

  const topTier = rankedMuscles.find(m => m.tier)?.tier
  const tieredCount = rankedMuscles.filter(m => m.tier).length
  const hasBodyweight = !!data.profile.bodyweight

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-2xl font-bold">Strength Tiers</h1>
        <p className="text-gray-500 text-sm mt-1">See where each muscle group ranks</p>
      </div>

      {!hasBodyweight && (
        <div className="mx-4 mb-4 bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 rounded-2xl p-4">
          <div className="text-sm font-medium text-[#e8ff5a]">Set your bodyweight</div>
          <div className="text-xs text-gray-400 mt-1">Tiers are calculated relative to your bodyweight. Add it in your profile to unlock rankings.</div>
        </div>
      )}

      {/* Tier legend */}
      <div className="px-4 mb-4">
        <div className="bg-[#161616] rounded-2xl p-4">
          <div className="text-sm font-semibold mb-3">Tier Levels</div>
          <div className="flex gap-2 flex-wrap">
            {TIER_CONFIG.map(t => (
              <div key={t.key} className="flex items-center gap-1.5 text-xs">
                <span>{TIER_EMOJI[t.key]}</span>
                <span style={{ color: TIER_COLORS[t.key] }} className="font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall rank */}
      {tieredCount > 0 && topTier && (
        <div className="px-4 mb-4">
          <div className="bg-[#161616] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: TIER_BG[topTier] }}>
              {TIER_EMOJI[topTier]}
            </div>
            <div>
              <div className="text-xs text-gray-500">Your best tier</div>
              <div className="text-xl font-bold mt-0.5" style={{ color: TIER_COLORS[topTier] }}>
                {TIER_CONFIG.find(t => t.key === topTier)?.label}
              </div>
              <div className="text-xs text-gray-500">{tieredCount} of {rankedMuscles.length} muscles ranked</div>
            </div>
          </div>
        </div>
      )}

      {/* Muscle cards */}
      <div className="px-4 grid grid-cols-1 gap-3">
        {rankedMuscles.map(({ muscle }) => (
          <MuscleCard key={muscle} muscle={muscle} />
        ))}
      </div>
    </div>
  )
}
