'use client'

import RegistrationModal from '@/components/RegistrationModal'
import { useState } from 'react'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Iframe с оригинальным сайтом - занимает весь экран */}
      <iframe
        src="https://hertzbetz.io"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 1
        }}
        title="HertzBetz Casino"
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      
      {/* Модальное окно регистрации */}
      {isModalOpen && (
        <RegistrationModal 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
