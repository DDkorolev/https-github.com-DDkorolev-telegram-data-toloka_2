"use client"

interface AudioWaveProps {
  isPlaying?: boolean
  onPlay?: () => void
  onPause?: () => void
}

export function AudioWave({ isPlaying = false, onPlay, onPause }: AudioWaveProps) {
  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause?.()
    } else {
      onPlay?.()
    }
  }

  return (
    <div className="audio-wave" onClick={handleTogglePlay}>
      <div className="flex items-center justify-center space-x-1">
        {Array.from({ length: 20 }).map((_, i) => {
          const height = Math.sin((i / 20) * Math.PI) * 40 + 10
          return (
            <div
              key={i}
              className={`w-1 bg-blue-400 rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : ""}`}
              style={{ height: `${height}%` }}
            ></div>
          )
        })}
      </div>
    </div>
  )
}
