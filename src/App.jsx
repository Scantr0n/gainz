import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider, useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Tiers from './pages/Tiers'
import Plan from './pages/Plan'
import Photos from './pages/Photos'

function AppInner() {
  const { data } = useStore()
  if (!data.onboarded) return <Onboarding />
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/photos" element={<Photos />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
