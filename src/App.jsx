import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider, useStore } from './store/useStore'
import { RestTimerProvider, useRestTimer } from './store/useRestTimer'
import BottomNav from './components/BottomNav'
import RestTimer from './components/RestTimer'
import Onboarding from './pages/Onboarding'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Tiers from './pages/Tiers'
import Plan from './pages/Plan'
import Photos from './pages/Photos'
import Settings from './pages/Settings'

function AppInner() {
  const { data } = useStore()
  const { restEndAt, restSeconds, adjustRest, skipRest } = useRestTimer()
  if (!data.onboarded) return <Onboarding />
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <RestTimer endAt={restEndAt} totalSeconds={restSeconds} onSkip={skipRest} onAdjust={adjustRest} />
      <BottomNav />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <RestTimerProvider>
        <AppInner />
      </RestTimerProvider>
    </StoreProvider>
  )
}
