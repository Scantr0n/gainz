// Exercise library with muscle groups, alternatives, and strength standards
export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Cardio'
]

export const EXERCISES = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', type: 'strength',
    alternatives: ['dumbbell-bench-press', 'incline-bench-press', 'push-ups'],
    standards: { beginner: 0.5, novice: 0.75, intermediate: 1.0, advanced: 1.25, elite: 1.5 } // multiplier of bodyweight
  },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', muscle: 'Chest', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['bench-press', 'cable-fly', 'push-ups'],
    standards: { beginner: 0.2, novice: 0.3, intermediate: 0.4, advanced: 0.55, elite: 0.7 }
  },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscle: 'Chest', equipment: 'Barbell', type: 'strength',
    alternatives: ['incline-dumbbell-press', 'bench-press'],
    standards: { beginner: 0.4, novice: 0.6, intermediate: 0.85, advanced: 1.1, elite: 1.35 }
  },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['incline-bench-press', 'dumbbell-bench-press'],
    standards: { beginner: 0.15, novice: 0.25, intermediate: 0.35, advanced: 0.48, elite: 0.62 }
  },
  { id: 'cable-fly', name: 'Cable Fly', muscle: 'Chest', equipment: 'Cable', type: 'strength',
    alternatives: ['dumbbell-fly', 'pec-deck'],
    standards: { beginner: 0.15, novice: 0.25, intermediate: 0.35, advanced: 0.45, elite: 0.6 }
  },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['cable-fly', 'pec-deck'],
    standards: { beginner: 0.1, novice: 0.15, intermediate: 0.22, advanced: 0.3, elite: 0.4 }
  },
  { id: 'push-ups', name: 'Push-Ups', muscle: 'Chest', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['bench-press', 'dumbbell-bench-press'],
    standards: { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 } // reps
  },
  // Back
  { id: 'deadlift', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell', type: 'strength',
    alternatives: ['romanian-deadlift', 'trap-bar-deadlift', 'dumbbell-deadlift'],
    standards: { beginner: 0.75, novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 }
  },
  { id: 'pull-ups', name: 'Pull-Ups', muscle: 'Back', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['lat-pulldown', 'assisted-pull-ups', 'cable-row'],
    standards: { beginner: 1, novice: 5, intermediate: 10, advanced: 15, elite: 20 }
  },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', type: 'strength',
    alternatives: ['pull-ups', 'cable-row'],
    standards: { beginner: 0.4, novice: 0.6, intermediate: 0.8, advanced: 1.0, elite: 1.25 }
  },
  { id: 'barbell-row', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', type: 'strength',
    alternatives: ['dumbbell-row', 'cable-row', 'machine-row'],
    standards: { beginner: 0.4, novice: 0.6, intermediate: 0.85, advanced: 1.1, elite: 1.4 }
  },
  { id: 'dumbbell-row', name: 'Dumbbell Row', muscle: 'Back', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['barbell-row', 'cable-row'],
    standards: { beginner: 0.2, novice: 0.3, intermediate: 0.45, advanced: 0.6, elite: 0.75 }
  },
  { id: 'cable-row', name: 'Cable Row', muscle: 'Back', equipment: 'Cable', type: 'strength',
    alternatives: ['barbell-row', 'machine-row'],
    standards: { beginner: 0.35, novice: 0.5, intermediate: 0.7, advanced: 0.9, elite: 1.1 }
  },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscle: 'Back', equipment: 'Barbell', type: 'strength',
    alternatives: ['deadlift', 'good-morning', 'dumbbell-rdl'],
    standards: { beginner: 0.5, novice: 0.75, intermediate: 1.1, advanced: 1.5, elite: 1.9 }
  },
  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', type: 'strength',
    alternatives: ['dumbbell-shoulder-press', 'arnold-press', 'machine-shoulder-press'],
    standards: { beginner: 0.35, novice: 0.5, intermediate: 0.7, advanced: 0.9, elite: 1.15 }
  },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['overhead-press', 'arnold-press'],
    standards: { beginner: 0.13, novice: 0.2, intermediate: 0.3, advanced: 0.42, elite: 0.55 }
  },
  { id: 'lateral-raise', name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['cable-lateral-raise', 'machine-lateral-raise'],
    standards: { beginner: 0.05, novice: 0.1, intermediate: 0.15, advanced: 0.2, elite: 0.28 }
  },
  { id: 'front-raise', name: 'Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['cable-front-raise', 'plate-front-raise'],
    standards: { beginner: 0.05, novice: 0.1, intermediate: 0.15, advanced: 0.22, elite: 0.3 }
  },
  { id: 'face-pull', name: 'Face Pull', muscle: 'Shoulders', equipment: 'Cable', type: 'strength',
    alternatives: ['rear-delt-fly', 'band-pull-apart'],
    standards: { beginner: 0.15, novice: 0.25, intermediate: 0.35, advanced: 0.45, elite: 0.55 }
  },
  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscle: 'Biceps', equipment: 'Barbell', type: 'strength',
    alternatives: ['dumbbell-curl', 'hammer-curl', 'ez-bar-curl'],
    standards: { beginner: 0.2, novice: 0.3, intermediate: 0.45, advanced: 0.6, elite: 0.75 }
  },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['barbell-curl', 'hammer-curl'],
    standards: { beginner: 0.1, novice: 0.15, intermediate: 0.22, advanced: 0.3, elite: 0.38 }
  },
  { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'Biceps', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['dumbbell-curl', 'cable-curl'],
    standards: { beginner: 0.1, novice: 0.18, intermediate: 0.27, advanced: 0.36, elite: 0.45 }
  },
  { id: 'preacher-curl', name: 'Preacher Curl', muscle: 'Biceps', equipment: 'Barbell', type: 'strength',
    alternatives: ['dumbbell-curl', 'cable-curl'],
    standards: { beginner: 0.15, novice: 0.25, intermediate: 0.37, advanced: 0.5, elite: 0.62 }
  },
  { id: 'cable-curl', name: 'Cable Curl', muscle: 'Biceps', equipment: 'Cable', type: 'strength',
    alternatives: ['barbell-curl', 'dumbbell-curl'],
    standards: { beginner: 0.12, novice: 0.2, intermediate: 0.3, advanced: 0.4, elite: 0.52 }
  },
  // Triceps
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscle: 'Triceps', equipment: 'Cable', type: 'strength',
    alternatives: ['skull-crusher', 'overhead-tricep-extension', 'dips'],
    standards: { beginner: 0.15, novice: 0.25, intermediate: 0.38, advanced: 0.5, elite: 0.65 }
  },
  { id: 'skull-crusher', name: 'Skull Crusher', muscle: 'Triceps', equipment: 'Barbell', type: 'strength',
    alternatives: ['tricep-pushdown', 'overhead-tricep-extension'],
    standards: { beginner: 0.18, novice: 0.28, intermediate: 0.42, advanced: 0.57, elite: 0.72 }
  },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', muscle: 'Triceps', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['skull-crusher', 'tricep-pushdown'],
    standards: { beginner: 0.12, novice: 0.2, intermediate: 0.3, advanced: 0.4, elite: 0.52 }
  },
  { id: 'dips', name: 'Dips', muscle: 'Triceps', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['tricep-pushdown', 'skull-crusher'],
    standards: { beginner: 1, novice: 8, intermediate: 15, advanced: 22, elite: 30 }
  },
  // Quads
  { id: 'squat', name: 'Squat', muscle: 'Quads', equipment: 'Barbell', type: 'strength',
    alternatives: ['leg-press', 'goblet-squat', 'hack-squat'],
    standards: { beginner: 0.5, novice: 0.75, intermediate: 1.25, advanced: 1.75, elite: 2.25 }
  },
  { id: 'leg-press', name: 'Leg Press', muscle: 'Quads', equipment: 'Machine', type: 'strength',
    alternatives: ['squat', 'hack-squat', 'goblet-squat'],
    standards: { beginner: 0.75, novice: 1.25, intermediate: 2.0, advanced: 2.75, elite: 3.5 }
  },
  { id: 'hack-squat', name: 'Hack Squat', muscle: 'Quads', equipment: 'Machine', type: 'strength',
    alternatives: ['squat', 'leg-press'],
    standards: { beginner: 0.5, novice: 0.8, intermediate: 1.25, advanced: 1.75, elite: 2.25 }
  },
  { id: 'leg-extension', name: 'Leg Extension', muscle: 'Quads', equipment: 'Machine', type: 'strength',
    alternatives: ['squat', 'lunges'],
    standards: { beginner: 0.3, novice: 0.5, intermediate: 0.7, advanced: 0.95, elite: 1.2 }
  },
  { id: 'lunges', name: 'Lunges', muscle: 'Quads', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['squat', 'step-ups'],
    standards: { beginner: 0.1, novice: 0.2, intermediate: 0.35, advanced: 0.5, elite: 0.65 }
  },
  // Hamstrings
  { id: 'leg-curl', name: 'Leg Curl', muscle: 'Hamstrings', equipment: 'Machine', type: 'strength',
    alternatives: ['romanian-deadlift', 'nordic-curl'],
    standards: { beginner: 0.2, novice: 0.35, intermediate: 0.5, advanced: 0.68, elite: 0.85 }
  },
  { id: 'dumbbell-rdl', name: 'Dumbbell RDL', muscle: 'Hamstrings', equipment: 'Dumbbell', type: 'strength',
    alternatives: ['romanian-deadlift', 'leg-curl'],
    standards: { beginner: 0.2, novice: 0.35, intermediate: 0.55, advanced: 0.75, elite: 0.95 }
  },
  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', type: 'strength',
    alternatives: ['glute-bridge', 'cable-kickback'],
    standards: { beginner: 0.5, novice: 0.85, intermediate: 1.3, advanced: 1.75, elite: 2.2 }
  },
  { id: 'glute-bridge', name: 'Glute Bridge', muscle: 'Glutes', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['hip-thrust'],
    standards: { beginner: 5, novice: 15, intermediate: 30, advanced: 45, elite: 60 }
  },
  // Calves
  { id: 'calf-raise', name: 'Standing Calf Raise', muscle: 'Calves', equipment: 'Machine', type: 'strength',
    alternatives: ['seated-calf-raise', 'donkey-calf-raise'],
    standards: { beginner: 0.5, novice: 0.9, intermediate: 1.4, advanced: 1.9, elite: 2.4 }
  },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscle: 'Calves', equipment: 'Machine', type: 'strength',
    alternatives: ['calf-raise'],
    standards: { beginner: 0.25, novice: 0.45, intermediate: 0.7, advanced: 0.95, elite: 1.2 }
  },
  // Core
  { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', type: 'timed',
    alternatives: ['hollow-hold', 'ab-wheel'],
    standards: { beginner: 20, novice: 45, intermediate: 90, advanced: 150, elite: 240 } // seconds
  },
  { id: 'crunches', name: 'Crunches', muscle: 'Core', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['cable-crunch', 'hanging-leg-raise'],
    standards: { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }
  },
  { id: 'cable-crunch', name: 'Cable Crunch', muscle: 'Core', equipment: 'Cable', type: 'strength',
    alternatives: ['crunches', 'hanging-leg-raise'],
    standards: { beginner: 0.1, novice: 0.2, intermediate: 0.3, advanced: 0.45, elite: 0.6 }
  },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['crunches', 'cable-crunch'],
    standards: { beginner: 3, novice: 8, intermediate: 15, advanced: 22, elite: 30 }
  },
  { id: 'ab-wheel', name: 'Ab Wheel', muscle: 'Core', equipment: 'Bodyweight', type: 'strength',
    alternatives: ['plank', 'cable-crunch'],
    standards: { beginner: 2, novice: 5, intermediate: 10, advanced: 15, elite: 20 }
  },
]

export const EXERCISES_MAP = Object.fromEntries(EXERCISES.map(e => [e.id, e]))

export const TIER_CONFIG = [
  { key: 'beginner', label: 'Beginner', color: '#6b7280', emoji: '🥉', next: 'Novice' },
  { key: 'novice', label: 'Novice', color: '#10b981', emoji: '🟢', next: 'Intermediate' },
  { key: 'intermediate', label: 'Intermediate', color: '#3b82f6', emoji: '🔵', next: 'Advanced' },
  { key: 'advanced', label: 'Advanced', color: '#8b5cf6', emoji: '💜', next: 'Elite' },
  { key: 'elite', label: 'Elite', color: '#f59e0b', emoji: '👑', next: null },
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const GOALS = [
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪', description: 'Maximize muscle growth' },
  { id: 'lose-fat', label: 'Lose Fat', icon: '🔥', description: 'Burn fat, preserve muscle' },
  { id: 'maintain', label: 'Maintain', icon: '⚖️', description: 'Stay fit and consistent' },
  { id: 'bulk', label: 'Bulk', icon: '📈', description: 'Aggressive size and strength gain' },
  { id: 'strength', label: 'Build Strength', icon: '🏋️', description: 'Increase max lifts' },
]

export const SPLITS = {
  'push-pull-legs': {
    name: 'Push / Pull / Legs',
    description: '6 days — Push (chest/shoulders/triceps), Pull (back/biceps), Legs',
    days: {
      Monday: { label: 'Push', muscles: ['Chest', 'Shoulders', 'Triceps'], exercises: ['bench-press', 'overhead-press', 'incline-dumbbell-press', 'lateral-raise', 'tricep-pushdown', 'skull-crusher'] },
      Tuesday: { label: 'Pull', muscles: ['Back', 'Biceps'], exercises: ['deadlift', 'pull-ups', 'barbell-row', 'barbell-curl', 'face-pull', 'hammer-curl'] },
      Wednesday: { label: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], exercises: ['squat', 'leg-press', 'leg-curl', 'hip-thrust', 'calf-raise', 'lunges'] },
      Thursday: { label: 'Push', muscles: ['Chest', 'Shoulders', 'Triceps'], exercises: ['incline-bench-press', 'dumbbell-shoulder-press', 'cable-fly', 'front-raise', 'overhead-tricep-extension', 'dips'] },
      Friday: { label: 'Pull', muscles: ['Back', 'Biceps'], exercises: ['lat-pulldown', 'cable-row', 'dumbbell-row', 'preacher-curl', 'cable-curl', 'dumbbell-rdl'] },
      Saturday: { label: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], exercises: ['hack-squat', 'leg-extension', 'leg-curl', 'glute-bridge', 'seated-calf-raise', 'hanging-leg-raise'] },
      Sunday: { label: 'Rest', muscles: [], exercises: [] },
    }
  },
  'upper-lower': {
    name: 'Upper / Lower',
    description: '4 days — Upper body and Lower body alternating',
    days: {
      Monday: { label: 'Upper', muscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'], exercises: ['bench-press', 'barbell-row', 'overhead-press', 'lat-pulldown', 'barbell-curl', 'tricep-pushdown'] },
      Tuesday: { label: 'Lower', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], exercises: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'hip-thrust', 'calf-raise'] },
      Wednesday: { label: 'Rest', muscles: [], exercises: [] },
      Thursday: { label: 'Upper', muscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'], exercises: ['incline-bench-press', 'pull-ups', 'dumbbell-shoulder-press', 'cable-row', 'dumbbell-curl', 'skull-crusher'] },
      Friday: { label: 'Lower', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], exercises: ['hack-squat', 'dumbbell-rdl', 'leg-extension', 'leg-curl', 'glute-bridge', 'seated-calf-raise'] },
      Saturday: { label: 'Rest', muscles: [], exercises: [] },
      Sunday: { label: 'Rest', muscles: [], exercises: [] },
    }
  },
  'bro-split': {
    name: 'Classic Bro Split',
    description: '5 days — One muscle group per day',
    days: {
      Monday: { label: 'Chest', muscles: ['Chest'], exercises: ['bench-press', 'incline-bench-press', 'dumbbell-fly', 'cable-fly', 'push-ups'] },
      Tuesday: { label: 'Back', muscles: ['Back'], exercises: ['deadlift', 'pull-ups', 'barbell-row', 'lat-pulldown', 'cable-row'] },
      Wednesday: { label: 'Shoulders', muscles: ['Shoulders'], exercises: ['overhead-press', 'dumbbell-shoulder-press', 'lateral-raise', 'front-raise', 'face-pull'] },
      Thursday: { label: 'Arms', muscles: ['Biceps', 'Triceps'], exercises: ['barbell-curl', 'hammer-curl', 'preacher-curl', 'tricep-pushdown', 'skull-crusher', 'overhead-tricep-extension'] },
      Friday: { label: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], exercises: ['squat', 'leg-press', 'leg-curl', 'hip-thrust', 'calf-raise'] },
      Saturday: { label: 'Rest', muscles: [], exercises: [] },
      Sunday: { label: 'Rest', muscles: [], exercises: [] },
    }
  },
  'full-body': {
    name: 'Full Body',
    description: '3 days — Train everything each session',
    days: {
      Monday: { label: 'Full Body A', muscles: ['Chest', 'Back', 'Quads', 'Core'], exercises: ['squat', 'bench-press', 'barbell-row', 'overhead-press', 'plank', 'calf-raise'] },
      Tuesday: { label: 'Rest', muscles: [], exercises: [] },
      Wednesday: { label: 'Full Body B', muscles: ['Back', 'Chest', 'Hamstrings', 'Core'], exercises: ['deadlift', 'pull-ups', 'incline-bench-press', 'dumbbell-shoulder-press', 'hanging-leg-raise', 'calf-raise'] },
      Thursday: { label: 'Rest', muscles: [], exercises: [] },
      Friday: { label: 'Full Body C', muscles: ['Chest', 'Back', 'Legs', 'Arms'], exercises: ['squat', 'bench-press', 'lat-pulldown', 'barbell-curl', 'tricep-pushdown', 'leg-curl'] },
      Saturday: { label: 'Rest', muscles: [], exercises: [] },
      Sunday: { label: 'Rest', muscles: [], exercises: [] },
    }
  }
}
