"use client"

import { useState } from "react"

interface EmojiRatingProps {
  onRate: (rating: number) => void
}

export function EmojiRating({ onRate }: EmojiRatingProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const emojis = [
    { value: 1, emoji: "😞" },
    { value: 2, emoji: "🙁" },
    { value: 3, emoji: "😐" },
    { value: 4, emoji: "🙂" },
    { value: 5, emoji: "😄" },
  ]

  const handleRating = (value: number) => {
    setSelectedRating(value)
    onRate(value)
  }

  return (
    <div className="emoji-rating">
      {emojis.map((emoji) => (
        <button
          key={emoji.value}
          className={`emoji-button text-2xl ${selectedRating === emoji.value ? "active" : ""}`}
          onClick={() => handleRating(emoji.value)}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  )
}
