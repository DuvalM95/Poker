import { useMemo } from 'react'

// Deterministic pseudo-random generator so the scatter pattern is stable
// across re-renders (typing, state changes) instead of reshuffling constantly.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SUITS = ['♠', '♥', '♦', '♣']

function buildSuits({ count, seed, minSize, maxSize, minOpacity, maxOpacity }) {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    suit: SUITS[Math.floor(rand() * SUITS.length)],
    top: rand() * 100,
    left: rand() * 100,
    size: minSize + rand() * (maxSize - minSize),
    rotate: rand() * 60 - 30,
    opacity: minOpacity + rand() * (maxOpacity - minOpacity),
  }))
}

/**
 * Scattered suit-symbol background decoration. Absolutely positioned to fill
 * its nearest `relative` ancestor — that ancestor also needs `overflow-hidden`.
 */
export default function CardSuitsBackground({
  count = 34,
  seed = 42,
  minSize = 26,
  maxSize = 72,
  minOpacity = 0.05,
  maxOpacity = 0.13,
  className = '',
}) {
  const suits = useMemo(
    () => buildSuits({ count, seed, minSize, maxSize, minOpacity, maxOpacity }),
    [count, seed, minSize, maxSize, minOpacity, maxOpacity]
  )

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {suits.map((s) => (
        <span
          key={s.id}
          className="absolute font-display text-paper"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
          }}
        >
          {s.suit}
        </span>
      ))}
    </div>
  )
}