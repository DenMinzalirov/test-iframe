'use client'

import RegistrationModal from '@/components/RegistrationModal'
import { useState, useEffect } from 'react'
import { initAppAndGetActiveDomain, type ActiveDomainData } from 'apuesta-cloud-landing-utils'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [domainData, setDomainData] = useState<ActiveDomainData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showIframe, setShowIframe] = useState(false)

  useEffect(() => {
    // Инициализация домена при загрузке
    const initializeDomain = async () => {
      const initStartTime = new Date().toISOString()
      
      try {
        setIsLoading(true)
        // Замените на ваши реальные параметры от Apuesta.cloud
        const response = await initAppAndGetActiveDomain(
          'https://htzbtz.cc', // redirectorOrigin https://hrtzbtz.cc/ https://htzbtz.cc/
          '686a47af' // redirectorCampaignId
        )
        
        const initEndTime = new Date().toISOString()
        const initDuration = new Date(initEndTime).getTime() - new Date(initStartTime).getTime()
        
        setDomainData(response)
      } catch (err) {
        const errorTime = new Date().toISOString()
        const errorDuration = new Date(errorTime).getTime() - new Date(initStartTime).getTime()
        
        setError(err instanceof Error ? err.message : 'Ошибка инициализации домена')
      } finally {
        setIsLoading(false)
      }
    }

    initializeDomain()
  }, [])

  // Показываем iframe через 2 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIframe(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Фоновое изображение */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/images/hertzbetz.io_en (1).png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
          // opacity: showIframe ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />

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
            zIndex: 2,
            opacity: showIframe ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
          title="HertzBetz Casino"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      
      {/* Модальное окно регистрации */}
      {isModalOpen && (
        <RegistrationModal 
          onClose={() => setIsModalOpen(false)}
          domainData={domainData}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  )
}