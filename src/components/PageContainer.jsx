import { useRestTimer } from '../store/useRestTimer'

export default function PageContainer({ children, className = '' }) {
  const { restEndAt } = useRestTimer()
  return (
    <div className={`flex flex-col min-h-screen transition-[padding] duration-200 ${restEndAt ? 'pb-44' : 'pb-24'} ${className}`}>
      {children}
    </div>
  )
}
