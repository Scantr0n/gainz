import { NavLink } from 'react-router-dom'
import { Dumbbell, BarChart2, Trophy, Sparkles, Camera } from 'lucide-react'

const tabs = [
  { to: '/', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/tiers', icon: Trophy, label: 'Tiers' },
  { to: '/plan', icon: Sparkles, label: 'Plan' },
  { to: '/photos', icon: Camera, label: 'Photos' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111] border-t border-white/10 safe-bottom z-50">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#e8ff5a]' : 'text-gray-500'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
