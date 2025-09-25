'use client'

import { useState } from 'react'

interface SpinToWinProps {
  onOpenRegistration: () => void
}

export default function SpinToWin({ onOpenRegistration }: SpinToWinProps) {
  const symbols = ['🍒', '🔔', '💎', '7️⃣']
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [winText, setWinText] = useState<string | null>(null)
  const [reels, setReels] = useState<Array<{ spinning: boolean; loops: number; finalIndex: number | null }>>([
    { spinning: false, loops: 0, finalIndex: null },
    { spinning: false, loops: 0, finalIndex: null },
    { spinning: false, loops: 0, finalIndex: null },
  ])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(1px)'
    }}>
      <style jsx>{`
        @keyframes reelSpin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        /* Бесшовная прокрутка: дублируем контент и двигаем на половину высоты */
        @keyframes reelLoop {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); }
        }
        .spin-card { animation: popIn .4s ease; }
        .reel-track { animation: reelSpin .8s cubic-bezier(.2,.8,.2,1) 3; }
        .reel-loop { animation: reelLoop 0.8s linear infinite; }
      `}</style>

      <div className="spin-card" style={{
        width: '320px',
        background: 'linear-gradient(180deg, rgba(31,41,55,0.95), rgba(17,24,39,0.95))',
        border: '1px solid #374151',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        padding: '16px',
        color: 'white',
        backdropFilter: 'blur(6px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'radial-gradient(circle at 30% 30%, #f59e0b, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>🎰</div>
            <div>
              <div style={{ fontWeight: 700, letterSpacing: '.2px' }}>Spin to Win</div>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>Try your luck and claim your bonus</div>
            </div>
          </div>
          <button
            onClick={onOpenRegistration}
            style={{
              background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '6px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
            aria-label="Open registration"
          >
            ✨
          </button>
        </div>

        {/* Мини-слоты */}
        <div style={{
          background: '#111827',
          border: '1px solid #374151',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{
              width: '72px', height: '64px', overflow: 'hidden',
              background: '#1f2937', border: '1px solid #374151', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {reels[i].spinning ? (
                <div className="reel-loop" style={{ display: 'grid', gap: '8px', padding: '8px 0' }}>
                  {[...symbols, ...symbols].map((s, idx) => (
                    <div key={`${s}-${idx}`} style={{ fontSize: '26px', textAlign: 'center' }}>{s}</div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '28px', textAlign: 'center' }}>
                  {reels[i].finalIndex !== null ? symbols[reels[i].finalIndex] : symbols[0]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Кнопки действий */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            disabled={isSpinning}
            onClick={() => {
              if (isSpinning) return
              setIsSpinning(true)
              setWinText(null)
              setHasSpun(false)
              // Проходим 1 полный круг всем барабанам, затем останавливаем по кругам:
              // слот 1 — конец 2-го круга, слот 2 — конец 3-го, слот 3 — конец 4-го
              const stopLoopsByReel = [2, 3, 4]
              const durationMs = 800

              // Запускаем все барабаны (бесконечная прокрутка до остановки)
              setReels([
                { spinning: true, loops: stopLoopsByReel[0], finalIndex: null },
                { spinning: true, loops: stopLoopsByReel[1], finalIndex: null },
                { spinning: true, loops: stopLoopsByReel[2], finalIndex: null },
              ])

              // План остановок на кратных длительностях (с небольшим jitter)
              stopLoopsByReel.forEach((loopsToWait, idx) => {
                const jitter = Math.floor(Math.random() * 180)
                const stopAt = loopsToWait * durationMs + jitter
                setTimeout(() => {
                  const finalIndex = Math.floor(Math.random() * symbols.length)
                  setReels((prev) => {
                    const next = [...prev]
                    next[idx] = { spinning: false, loops: loopsToWait, finalIndex }
                    return next
                  })

                  // Когда все остановились — показать «выигрыш»
                  setTimeout(() => {
                    const allStopped = (r: typeof reels) => r.every(reel => reel.spinning === false)
                    setReels((stateAfter) => {
                      if (allStopped(stateAfter)) {
                        setIsSpinning(false)
                        setHasSpun(true)
                        const wins = [
                          'You won 50 Free Spins!',
                          'Lucky! 100% up to 200 EUR',
                          'Jackpot Chance! 150% up to 500 EUR',
                          'Big Win! 200% up to 1000 EUR + 50 FS'
                        ]
                        const pick = wins[Math.floor(Math.random() * wins.length)]
                        setWinText(pick)
                      }
                      return stateAfter
                    })
                  }, 10)
                }, stopAt)
              })
            }}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: isSpinning ? '#6b7280' : '#6b46c1',
              color: 'white', fontWeight: 700, border: 'none', borderRadius: '10px', cursor: isSpinning ? 'not-allowed' : 'pointer',
              transition: 'all .2s'
            }}
            onMouseOver={(e) => { if (!isSpinning) e.currentTarget.style.backgroundColor = '#553c9a' }}
            onMouseOut={(e) => { if (!isSpinning) e.currentTarget.style.backgroundColor = '#6b46c1' }}
          >
            {isSpinning ? 'Spinning...' : hasSpun ? 'Spin Again' : 'Spin'}
          </button>
          <button
            onClick={onOpenRegistration}
            disabled={!winText}
            style={{
              padding: '10px 12px', minWidth: '120px',
              backgroundColor: winText ? '#f59e0b' : '#6b7280', color: '#111827', fontWeight: 800,
              border: 'none', borderRadius: '10px', cursor: winText ? 'pointer' : 'not-allowed',
              transition: 'all .2s'
            }}
            onMouseOver={(e) => { if (winText) e.currentTarget.style.filter = 'brightness(1.05)' }}
            onMouseOut={(e) => { if (winText) e.currentTarget.style.filter = 'none' }}
          >
            Claim Bonus
          </button>
        </div>

        {/* Отображение выигрыша */}
        {winText && (
          <div style={{
            marginTop: '10px',
            background: 'linear-gradient(90deg, rgba(245,158,11,.15), rgba(139,92,246,.15))',
            border: '1px solid rgba(245,158,11,.35)',
            borderRadius: '10px',
            padding: '10px',
            color: 'white',
            textAlign: 'center',
            fontWeight: 700
          }}>
            {winText}
          </div>
        )}
      </div>
    </div>
  )
}


