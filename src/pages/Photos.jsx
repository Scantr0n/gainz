import { useState, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Camera, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import PageContainer from '../components/PageContainer'

function PhotoCard({ photo, onDelete, onClick }) {
  const date = new Date(photo.date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#161616] block"
      >
        <img src={photo.dataUrl} alt="Progress" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-2xl">
          <div className="text-xs text-white font-medium">{date}</div>
          {photo.note && <div className="text-[10px] text-gray-300 mt-0.5 truncate">{photo.note}</div>}
        </div>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(photo.id) }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/70 active:text-red-400"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function CompareView({ photos, onClose }) {
  const [leftIdx, setLeftIdx] = useState(0)
  const [rightIdx, setRightIdx] = useState(Math.min(1, photos.length - 1))

  const sorted = [...photos].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <h2 className="text-lg font-bold">Compare</h2>
        <button onClick={onClose} className="p-2 text-gray-400">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex gap-2 px-4">
        {/* Left photo */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 rounded-2xl overflow-hidden bg-[#161616]">
            {sorted[leftIdx] && <img src={sorted[leftIdx].dataUrl} alt="Before" className="w-full h-full object-cover" />}
          </div>
          <div className="flex items-center justify-between gap-1">
            <button onClick={() => setLeftIdx(i => Math.max(0, i - 1))} className="p-2 text-gray-500 active:text-white disabled:opacity-30" disabled={leftIdx === 0}>
              <ChevronLeft size={18} />
            </button>
            <div className="text-xs text-gray-500 text-center">
              {sorted[leftIdx] ? new Date(sorted[leftIdx].date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </div>
            <button onClick={() => setLeftIdx(i => Math.min(sorted.length - 1, i + 1))} className="p-2 text-gray-500 active:text-white disabled:opacity-30" disabled={leftIdx >= sorted.length - 1}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right photo */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 rounded-2xl overflow-hidden bg-[#161616]">
            {sorted[rightIdx] && <img src={sorted[rightIdx].dataUrl} alt="After" className="w-full h-full object-cover" />}
          </div>
          <div className="flex items-center justify-between gap-1">
            <button onClick={() => setRightIdx(i => Math.max(0, i - 1))} className="p-2 text-gray-500 active:text-white disabled:opacity-30" disabled={rightIdx === 0}>
              <ChevronLeft size={18} />
            </button>
            <div className="text-xs text-gray-500 text-center">
              {sorted[rightIdx] ? new Date(sorted[rightIdx].date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </div>
            <button onClick={() => setRightIdx(i => Math.min(sorted.length - 1, i + 1))} className="p-2 text-gray-500 active:text-white disabled:opacity-30" disabled={rightIdx >= sorted.length - 1}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="pb-10" />
    </div>
  )
}

export default function Photos() {
  const { data, addPhoto, removePhoto } = useStore()
  const fileInputRef = useRef(null)
  const [comparing, setComparing] = useState(false)
  const [note, setNote] = useState('')
  const [viewPhoto, setViewPhoto] = useState(null)

  const photos = [...data.photos].sort((a, b) => b.date.localeCompare(a.date))

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      // Downscale + JPEG-compress before storing: raw phone photos as base64
      // blow past the ~5MB localStorage quota after just one or two shots.
      const img = new Image()
      img.onload = () => {
        const MAX = 1080
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        addPhoto(canvas.toDataURL('image/jpeg', 0.8), note)
        setNote('')
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  if (comparing && photos.length >= 2) {
    return <CompareView photos={photos} onClose={() => setComparing(false)} />
  }

  if (viewPhoto) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-14 pb-4">
          <div>
            <div className="font-bold">{new Date(viewPhoto.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            {viewPhoto.note && <div className="text-sm text-gray-400">{viewPhoto.note}</div>}
          </div>
          <button onClick={() => setViewPhoto(null)} className="p-2 text-gray-400"><X size={22} /></button>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <img src={viewPhoto.dataUrl} alt="Progress" className="max-w-full max-h-full rounded-2xl object-contain" />
        </div>
        <div className="pb-10" />
      </div>
    )
  }

  return (
    <PageContainer>
      <div className="px-4 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Progress Photos</h1>
            <p className="text-gray-500 text-sm mt-1">{photos.length} photos</p>
          </div>
          {photos.length >= 2 && (
            <button
              onClick={() => setComparing(true)}
              className="text-sm text-[#e8ff5a] border border-[#e8ff5a]/30 px-3 py-1.5 rounded-full"
            >
              Compare
            </button>
          )}
        </div>
      </div>

      {/* Add photo */}
      <div className="px-4 mb-5">
        <div className="bg-[#161616] rounded-2xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full bg-white/8 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-[#e8ff5a] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Camera size={18} />
            Take / Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="text-6xl">📸</div>
          <div>
            <div className="text-lg font-semibold">No photos yet</div>
            <div className="text-sm text-gray-500 mt-1">Take your first progress photo to start tracking your transformation.</div>
          </div>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3">
          {photos.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={removePhoto}
              onClick={() => setViewPhoto(photo)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
