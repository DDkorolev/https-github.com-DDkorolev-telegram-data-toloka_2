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
    <div className="flex justify-between items-center mt-4">
      {emojis.map((emoji) => (
        <button
          key={emoji.value}
          className={`p-2 rounded-full hover:bg-blue-50 transition-colors text-2xl ${
            selectedRating === emoji.value ? "bg-blue-100" : ""
          }`}
          onClick={() => handleRating(emoji.value)}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  )
}
