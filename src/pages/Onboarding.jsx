import { useState } from 'react'
import { useStore } from '../store/useStore'
import { GOALS, SPLITS } from '../data/exercises'
import { ChevronRight, Dumbbell } from 'lucide-react'

const steps = ['welcome', 'goal', 'split', 'profile']

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('build-muscle')
  const [split, setSplit] = useState('push-pull-legs')
  const [name, setName] = useState('')
  const [bodyweight, setBodyweight] = useState('')

  function finish() {
    completeOnboarding({ name, bodyweight: Number(bodyweight) || null, goal }, split)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white px-6">
      {/* Progress dots */}
      <div className="flex gap-2 pt-14 pb-2 justify-center">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#e8ff5a]' : i < step ? 'w-4 bg-white/40' : 'w-4 bg-white/15'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-[#e8ff5a] flex items-center justify-center mx-auto">
              <Dumbbell size={40} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Gainz</h1>
              <p className="text-gray-400 mt-2 text-lg">Track. Progress. Dominate.</p>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Log your lifts, visualize your gains, and build the perfect workout plan.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">What's your goal?</h2>
              <p className="text-gray-500 text-sm mt-1">We'll tailor your plan around this.</p>
            </div>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    goal === g.id ? 'border-[#e8ff5a] bg-[#e8ff5a]/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <div className="font-semibold">{g.label}</div>
                    <div className="text-sm text-gray-500">{g.description}</div>
                  </div>
                  {goal === g.id && <div className="ml-auto w-5 h-5 rounded-full bg-[#e8ff5a] flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-black" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Choose a split</h2>
              <p className="text-gray-500 text-sm mt-1">How many days per week do you train?</p>
            </div>
            <div className="space-y-3">
              {Object.entries(SPLITS).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => setSplit(key)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                    split === key ? 'border-[#e8ff5a] bg-[#e8ff5a]/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{s.description}</div>
                  </div>
                  {split === key && <div className="mt-1 w-5 h-5 rounded-full bg-[#e8ff5a] flex items-center justify-center flex-shrink-0"><div className="w-2.5 h-2.5 rounded-full bg-black" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Almost there</h2>
              <p className="text-gray-500 text-sm mt-1">A couple quick details (optional).</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Your name</label>
                <input
                  type="text"
                  placeholder="e.g. Jack"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/8 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#e8ff5a]/50 text-base"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bodyweight (lbs)</label>
                <input
                  type="number"
                  placeholder="e.g. 175"
                  value={bodyweight}
                  onChange={e => setBodyweight(e.target.value)}
                  className="w-full bg-white/8 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#e8ff5a]/50 text-base"
                />
                <p className="text-xs text-gray-600 mt-2">Used to calculate your strength tiers. You can update this anytime.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pb-10 pt-6">
        <button
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finish()}
          className="w-full bg-[#e8ff5a] text-black font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-98 transition-transform"
        >
          {step === steps.length - 1 ? "Let's Go" : 'Continue'}
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="w-full mt-3 text-gray-500 py-2 text-sm">
            Back
          </button>
        )}
      </div>
    </div>
  )
}
