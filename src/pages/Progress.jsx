import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { EXERCISES, MUSCLE_GROUPS, EXERCISES_MAP } from '../data/exercises'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'

const METRICS = [
  { key: 'maxWeight', label: 'Max Weight', unit: 'lbs' },
  { key: 'best1RM', label: 'Estimated 1RM', unit: 'lbs' },
  { key: 'totalVolume', label: 'Total Volume', unit: 'lbs' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="font-bold text-[#e8ff5a]">{payload[0]?.value?.toFixed(1)} {payload[0]?.payload?.unit}</div>
    </div>
  )
}

export default function Progress() {
  const { getExerciseHistory } = useStore()
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [selectedExId, setSelectedExId] = useState(null)
  const [metric, setMetric] = useState('maxWeight')
  const [search, setSearch] = useState('')

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(e => {
      const matchesMuscle = selectedMuscle === 'All' || e.muscle === selectedMuscle
      const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase())
      return matchesMuscle && matchesSearch
    })
  }, [selectedMuscle, search])

  const history = useMemo(() => {
    if (!selectedExId) return []
    return getExerciseHistory(selectedExId)
  }, [selectedExId, getExerciseHistory])

  const chartData = history.map(h => ({
    date: new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: metric === 'totalVolume' ? h.totalVolume : metric === 'best1RM' ? h.best1RM : h.maxWeight,
    unit: METRICS.find(m => m.key === metric)?.unit
  }))

  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].value - chartData[0].value
    : 0

  const selectedEx = selectedExId ? EXERCISES_MAP[selectedExId] : null

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your gains over time</p>
      </div>

      {/* Muscle group filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', ...MUSCLE_GROUPS].map(g => (
            <button
              key={g}
              onClick={() => { setSelectedMuscle(g); setSelectedExId(null) }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedMuscle === g ? 'bg-[#e8ff5a] text-black' : 'bg-white/8 text-gray-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/8 border border-white/8 rounded-2xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none"
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {filteredExercises.map(ex => {
            const hist = getExerciseHistory(ex.id)
            const hasData = hist.length > 0
            const isSelected = selectedExId === ex.id
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExId(isSelected ? null : ex.id)}
                className={`px-3 py-2 rounded-xl text-sm transition-all border ${
                  isSelected ? 'border-[#e8ff5a] bg-[#e8ff5a]/10 text-white' :
                  hasData ? 'border-white/15 bg-white/8 text-gray-300' :
                  'border-white/8 bg-transparent text-gray-600'
                }`}
              >
                {ex.name}
                {hasData && !isSelected && <span className="ml-1 text-[10px] text-[#e8ff5a]">●</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      {selectedExId && (
        <div className="px-4">
          <div className="bg-[#161616] rounded-2xl p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-base">{selectedEx?.name}</div>
                <div className="text-xs text-gray-500">{selectedEx?.muscle} · {selectedEx?.equipment}</div>
              </div>
              {chartData.length >= 2 && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {trend > 0 ? <TrendingUp size={16} /> : trend < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
                  {Math.abs(trend).toFixed(1)}
                </div>
              )}
            </div>

            {/* Metric selector */}
            <div className="flex gap-2">
              {METRICS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${metric === m.key ? 'bg-[#e8ff5a] text-black' : 'bg-white/8 text-gray-400'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {chartData.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No data yet. Start logging to see your progress.
              </div>
            ) : chartData.length === 1 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-3xl font-bold text-[#e8ff5a]">{chartData[0].value.toFixed(1)}<span className="text-base text-gray-400 ml-1">{chartData[0].unit}</span></div>
                <div className="text-sm text-gray-500">1 session logged. Keep going!</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#e8ff5a"
                    strokeWidth={2.5}
                    dot={{ fill: '#e8ff5a', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#e8ff5a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* History table */}
            {history.length > 0 && (
              <div className="space-y-2 border-t border-white/8 pt-4">
                <div className="text-xs text-gray-500 font-medium">Session History</div>
                {history.slice().reverse().slice(0, 8).map(h => (
                  <div key={h.date} className="flex items-center justify-between py-1">
                    <div className="text-sm text-gray-400">{new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-white font-medium">{h.maxWeight} lbs</span>
                      <span className="text-gray-500">{h.sets.length} sets</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedExId && (
        <div className="px-4 py-16 text-center text-gray-600 text-sm">
          Select an exercise to see your progress chart
        </div>
      )}
    </div>
  )
}
