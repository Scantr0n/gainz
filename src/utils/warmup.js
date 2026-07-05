const SCHEME = [
  { pct: 0.5, reps: 8 },
  { pct: 0.7, reps: 5 },
  { pct: 0.85, reps: 3 },
]

export function computeWarmupSets(workingWeight) {
  if (!workingWeight || workingWeight <= 0) return []
  const increment = workingWeight >= 45 ? 5 : 2.5

  const sets = []
  for (const { pct, reps } of SCHEME) {
    const raw = workingWeight * pct
    const weight = Math.max(increment, Math.round(raw / increment) * increment)
    if (weight >= workingWeight) continue
    if (sets.length && weight <= sets[sets.length - 1].weight) continue
    sets.push({ weight, reps })
  }
  return sets
}
