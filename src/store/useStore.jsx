/* eslint-disable react-refresh/only-export-components -- store file intentionally exports hooks + provider together */
import { useState, useCallback, createContext, useContext } from 'react'
import { EXERCISES_MAP, SPLITS } from '../data/exercises'

const STORAGE_KEY = 'gainz_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

let warnedSaveFailure = false
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    warnedSaveFailure = false
  } catch (err) {
    // Usually QuotaExceededError from too many photos. Warn once instead of
    // silently losing every change from here on.
    if (!warnedSaveFailure) {
      warnedSaveFailure = true
      alert("Gainz couldn't save — browser storage is full. Delete some progress photos (or export a backup first), then try again.")
    }
    console.error('Gainz save failed:', err)
  }
}

function getDefaultData() {
  return {
    profile: {
      name: '',
      bodyweight: null, // lbs
      goal: 'build-muscle',
      split: 'push-pull-legs',
    },
    // logs: { 'YYYY-MM-DD': { exerciseId: [{ sets: [{reps, weight}] }] } }
    logs: {},
    // activePlan: split key
    activePlan: 'push-pull-legs',
    // customPlan: override days if user customizes
    customPlan: null,
    // photos: [{ date, dataUrl, note }]
    photos: [],
    // onboarded: boolean
    onboarded: false,
  }
}

export function useWorkoutStore() {
  const [data, setData] = useState(() => loadData() || getDefaultData())

  const update = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveData(next)
      return next
    })
  }, [])

  // Get today's date string YYYY-MM-DD in the user's local timezone
  // (toISOString would give the UTC date, which is tomorrow during US evenings)
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // Get the active plan's schedule
  const activeSplit = data.customPlan || SPLITS[data.activePlan]

  // Get day of week for a date (0=Mon...6=Sun)
  function getDayIndex(dateStr) {
    const d = new Date(dateStr + 'T12:00:00')
    return (d.getDay() + 6) % 7 // convert Sun=0 to Mon=0
  }

  // Get plan day config for a date
  function getPlanDay(dateStr) {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dayName = dayNames[getDayIndex(dateStr)]
    return activeSplit?.days?.[dayName] || { label: 'Rest', muscles: [], exercises: [] }
  }

  // Log a set for an exercise on a date
  function logSet(date, exerciseId, setIndex, reps, weight) {
    update(prev => {
      const logs = { ...prev.logs }
      if (!logs[date]) logs[date] = {}
      if (!logs[date][exerciseId]) logs[date][exerciseId] = []
      const sets = [...(logs[date][exerciseId] || [])]
      sets[setIndex] = { reps: Math.max(0, Number(reps) || 0), weight: Math.max(0, Number(weight) || 0) }
      logs[date][exerciseId] = sets
      return { ...prev, logs }
    })
  }

  function addSet(date, exerciseId) {
    update(prev => {
      const logs = { ...prev.logs }
      if (!logs[date]) logs[date] = {}
      if (!logs[date][exerciseId]) logs[date][exerciseId] = []
      const lastSet = logs[date][exerciseId].slice(-1)[0]
      logs[date][exerciseId] = [...logs[date][exerciseId], lastSet ? { ...lastSet } : { reps: 10, weight: 0 }]
      return { ...prev, logs }
    })
  }

  function removeSet(date, exerciseId, setIndex) {
    update(prev => {
      const logs = { ...prev.logs }
      if (!logs[date]?.[exerciseId]) return prev
      const sets = logs[date][exerciseId].filter((_, i) => i !== setIndex)
      logs[date][exerciseId] = sets
      return { ...prev, logs }
    })
  }

  // Get exercise history (all logged sets across all dates)
  function getExerciseHistory(exerciseId) {
    const history = []
    for (const [date, dayLog] of Object.entries(data.logs)) {
      if (dayLog[exerciseId] && dayLog[exerciseId].length > 0) {
        const sets = dayLog[exerciseId].filter(s => s && s.reps > 0)
        if (sets.length === 0) continue
        const maxWeight = Math.max(...sets.map(s => s.weight || 0))
        const totalVolume = sets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0)
        const best1RM = Math.max(...sets.map(s => (s.weight || 0) * (1 + (s.reps || 0) / 30)))
        history.push({ date, sets, maxWeight, totalVolume, best1RM })
      }
    }
    return history.sort((a, b) => a.date.localeCompare(b.date))
  }

  // Calculate muscle tier for a muscle group
  function getMuscleStrengthLevel(muscleGroup) {
    if (!data.profile.bodyweight) return null
    const bw = data.profile.bodyweight

    const muscleExercises = Object.values(EXERCISES_MAP).filter(e => e.muscle === muscleGroup)
    let bestRatio = 0

    for (const ex of muscleExercises) {
      const history = getExerciseHistory(ex.id)
      if (history.length === 0) continue

      // Find best performance
      const best = Math.max(...history.map(h => {
        const best1RM = Math.max(...h.sets.map(s => (s.weight || 0) * (1 + (s.reps || 0) / 30)))
        return best1RM
      }))

      if (!ex.standards) continue

      // For bodyweight exercises, just track reps
      if (ex.equipment === 'Bodyweight' && ex.type !== 'timed') {
        const bestReps = Math.max(...history.flatMap(h => h.sets.map(s => s.reps || 0)))
        const elite = ex.standards.elite
        const ratio = bestReps / elite
        bestRatio = Math.max(bestRatio, ratio)
      } else {
        const ratio = best / (bw * ex.standards.elite)
        bestRatio = Math.max(bestRatio, ratio)
      }
    }

    if (bestRatio <= 0) return null
    if (bestRatio < 0.3) return 'beginner'
    if (bestRatio < 0.55) return 'novice'
    if (bestRatio < 0.75) return 'intermediate'
    if (bestRatio < 0.95) return 'advanced'
    return 'elite'
  }

  function updateProfile(fields) {
    update(prev => ({ ...prev, profile: { ...prev.profile, ...fields } }))
  }

  function setActivePlan(splitKey) {
    update(prev => ({ ...prev, activePlan: splitKey, customPlan: null }))
  }

  function addPhoto(dataUrl, note = '') {
    update(prev => ({
      ...prev,
      photos: [...prev.photos, { date: today, dataUrl, note, id: Date.now().toString() }]
    }))
  }

  function removePhoto(id) {
    update(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }))
  }

  function resetApp() {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* nothing to clean up */ }
    setData(getDefaultData())
  }

  function importData(imported) {
    const defaults = getDefaultData()
    const next = {
      ...defaults,
      ...imported,
      profile: { ...defaults.profile, ...(imported.profile || {}) },
    }
    update(next)
  }

  function completeOnboarding(profileData, splitKey) {
    update(prev => ({
      ...prev,
      onboarded: true,
      activePlan: splitKey,
      profile: { ...prev.profile, ...profileData }
    }))
  }

  return {
    data,
    today,
    activeSplit,
    getPlanDay,
    logSet,
    addSet,
    removeSet,
    getExerciseHistory,
    getMuscleStrengthLevel,
    updateProfile,
    setActivePlan,
    addPhoto,
    removePhoto,
    completeOnboarding,
    resetApp,
    importData,
  }
}

const StoreContext = createContext(null)
export function StoreProvider({ children }) {
  const store = useWorkoutStore()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
export function useStore() {
  return useContext(StoreContext)
}
