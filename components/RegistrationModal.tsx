'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  RegisterPlayer, 
  getLinkToNavigate, 
  LoginType, 
  type ActiveDomainData,
  type RegisterFormData 
} from 'apuesta-cloud-landing-utils'

// Вычисляем язык для Apuesta: 'tr' | 'de' | 'en' (дефолт 'en')
const getApuestaLanguage = (): 'tr' | 'de' | 'en' => {
  const locale = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : ''
  if (locale.startsWith('tr')) return 'tr'
  if (locale.startsWith('de')) return 'de'
  return 'en'
}

// Определяем язык интерфейса
const getUILanguage = (): 'ru' | 'en' => {
  const locale = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : ''
  // return locale.startsWith('ru') ? 'ru' : 'en'
  return 'en'
}

// Тексты интерфейса
const getUITexts = (lang: 'ru' | 'en') => {
  const texts = {
    ru: {
      registration: 'Регистрация',
      emailPlaceholder: 'Введите ваш email',
      passwordPlaceholder: 'Введите пароль',
      newsUpdates: 'Я хочу получать информацию о новостях и предложениях от казино и выбранных партнеров',
      termsText: 'Мне исполнилось 18 лет и я принимаю',
      termsLink: 'Условия использования',
      privacyLink: 'Политику конфиденциальности',
      and: 'и',
      registerButton: 'Регистрация',
      loading: 'Загрузка...',
      waiting: 'Ожидание данных...',
      orRegister: 'Или зарегистрируйтесь через',
      googleButton: 'Google',
      domainLoading: 'Загрузка данных домена...',
      domainError: 'Ошибка:',
      registrationError: 'Ошибка регистрации. Попробуйте позже.',
      domainNotLoaded: 'Данные домена не загружены. Попробуйте позже.',
      registrationSuccess: 'Регистрация успешна!',
      emailError: 'Введите корректный email',
      passwordError: 'Пароль должен содержать минимум 6 символов',
      termsError: 'Необходимо принять условия использования'
    },
    en: {
      registration: 'Registration',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter password',
      newsUpdates: 'I want to receive information about news and offers from the casino and selected partners',
      termsText: 'I am 18 years old and I accept',
      termsLink: 'Terms of Use',
      privacyLink: 'Privacy Policy',
      and: 'and',
      registerButton: 'Register',
      loading: 'Loading...',
      waiting: 'Waiting for data...',
      orRegister: 'Or register via',
      googleButton: 'Google',
      domainLoading: 'Loading domain data...',
      domainError: 'Error:',
      registrationError: 'Registration error. Please try again later.',
      domainNotLoaded: 'Domain data not loaded. Please try later.',
      registrationSuccess: 'Registration successful!',
      emailError: 'Enter a valid email',
      passwordError: 'Password must contain at least 6 characters',
      termsError: 'You must accept the terms of use'
    }
  }
  return texts[lang]
}

// Схема валидации формы
const createRegistrationSchema = (texts: ReturnType<typeof getUITexts>) => z.object({
  email: z.string().email(texts.emailError),
  password: z.string().min(6, texts.passwordError),
  currency: z.string().default('EUR'),
  language: z.enum(['tr', 'de', 'en']).optional(),
  promoCode: z.string().optional(),
  newsUpdates: z.boolean(),
  termsAccepted: z.boolean().refine(val => val === true, texts.termsError),
})

type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>

interface RegistrationModalProps {
  onClose: () => void
  domainData: ActiveDomainData | null
  isLoading: boolean
  error: string | null
}

export default function RegistrationModal({ onClose, domainData, isLoading, error }: RegistrationModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  
  // Определяем язык интерфейса и получаем тексты
  const uiLang = getUILanguage()
  const texts = getUITexts(uiLang)
  const registrationSchema = createRegistrationSchema(texts)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      newsUpdates: true,
      termsAccepted: true,
      currency: 'EUR',
      language: getApuestaLanguage(),
    },
  })

  const onSubmit = async (data: RegistrationFormData) => {
    if (!domainData) {
      setRegistrationError(texts.domainNotLoaded)
      return
    }

    try {
      setRegistrationError(null)
      
      // Подготавливаем данные для регистрации
      const registerData: RegisterFormData = {
        email: data.email,
        phone: null,
        password: data.password,
        currency: data.currency,
        language: (data.language as 'tr' | 'de' | 'en') ?? getApuestaLanguage(),
        promoCode: data.promoCode || undefined,
        loginType: LoginType.Email,
        region: '', // пустая строка для значения по умолчанию
      }

      // Регистрируем игрока через API
      const response = await RegisterPlayer(domainData.domain, registerData)

      // Получаем ссылку для перенаправления
      const linkToNavigate = getLinkToNavigate({
        activeDomainData: domainData,
        refreshToken: response.refresh_token
      })
      
      if (linkToNavigate) {
        // Сохраняем флаг регистрации
        localStorage.setItem('was-registered', 'true')
        
        // Перенаправляем на сайт казино в новом окне
        window.open(linkToNavigate, '_blank', 'noopener,noreferrer')
        // window.location.href = linkToNavigate
      } else {
        alert(texts.registrationSuccess)
        onClose()
      }
      
    } catch (error) {
      
      // Пытаемся перенаправить на страницу ошибки
      if (domainData) {
        const errorLink = getLinkToNavigate({ 
          activeDomainData: domainData, 
          isError: true 
        })
        
        if (errorLink) {
          window.open(errorLink, '_blank', 'noopener,noreferrer')
          // window.location.href = errorLink
          return
        }
      }
      
      setRegistrationError(texts.registrationError)
    }
  }

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
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #374151'
      }}>
        {/* Кнопка закрытия */}
        {/* <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '24px',
            lineHeight: '1',
            padding: '4px'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          ×
        </button> */}

        {/* Табы */}
        <div style={{ display: 'flex', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '8px 0',
              textAlign: 'center',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              color: activeTab === 'signup' ? '#f97316' : '#9ca3af',
              borderBottom: activeTab === 'signup' ? '2px solid #f97316' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (activeTab !== 'signup') e.currentTarget.style.color = '#ffffff'
            }}
            onMouseOut={(e) => {
              if (activeTab !== 'signup') e.currentTarget.style.color = '#9ca3af'
            }}
          >
            {texts.registration}
          </button>
        </div>

        {/* Приветственное предложение */}
        {/* <div style={{
          background: 'linear-gradient(135deg, #6b46c1 0%, #9333ea 100%)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '16px' }}>🎁</span>
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>
              Приветственный пакет
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '12px' }}>
              до €1,500 + 250 бесплатных спинов
            </p>
          </div>
        </div> */}

        {/* Состояния загрузки и ошибок */}
        {/* {isLoading && (
          <div style={{
            backgroundColor: '#374151',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
              {texts.domainLoading}
            </p>
          </div>
        )} */}

        {error && (
          <div style={{
            backgroundColor: '#dc2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', margin: 0, fontSize: '14px' }}>
              {texts.domainError} {error}
            </p>
          </div>
        )}

        {registrationError && (
          <div style={{
            backgroundColor: '#dc2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', margin: 0, fontSize: '14px' }}>
              {registrationError}
            </p>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                ✉️
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder={texts.emailPlaceholder}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4b5563'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Пароль */}
          <div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                🔒
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={texts.passwordPlaceholder}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4b5563'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Промокод (опционально) */}
          {/* <div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                🎟️
              </div>
              <input
                {...register('promoCode')}
                type="text"
                placeholder="Промокод (необязательно)"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4b5563'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div> */}

          {/* Чекбоксы */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                {...register('newsUpdates')}
                type="checkbox"
                style={{
                  marginTop: '2px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#f97316',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.4' }}>
                {texts.newsUpdates}
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                {...register('termsAccepted')}
                type="checkbox"
                style={{
                  marginTop: '2px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#f97316',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.4' }}>
                {texts.termsText}{' '}
                <a href="#" style={{ color: '#f97316', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>{texts.termsLink}</a>
                {' '}{texts.and}{' '}
                <a href="#" style={{ color: '#f97316', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>{texts.privacyLink}</a>
              </span>
            </label>
            {errors.termsAccepted && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading || !domainData}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isSubmitting || isLoading || !domainData ? '#6b7280' : '#6b46c1',
              color: 'white',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: isSubmitting || isLoading || !domainData ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s',
              opacity: isSubmitting || isLoading || !domainData ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isSubmitting && !isLoading && domainData) {
                e.currentTarget.style.backgroundColor = '#553c9a'
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting && !isLoading && domainData) {
                e.currentTarget.style.backgroundColor = '#6b46c1'
              }
            }}
          >
            {isSubmitting ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <>
                <span>
                  {isLoading ? texts.loading : !domainData ? texts.waiting : texts.registerButton}
                </span>
                {/* {!isLoading && domainData && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>100%</span>
                  </div>
                )} */}
              </>
            )}
          </button>

          {/* Разделитель */}
          {/* <div style={{ position: 'relative', margin: '24px 0' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#4b5563'
            }} />
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <span style={{
                backgroundColor: '#1f2937',
                color: '#9ca3af',
                padding: '0 16px',
                fontSize: '12px'
              }}>
                {texts.orRegister}
              </span>
            </div>
          </div> */}

          {/* Google кнопка */}
          {/* <button
            type="button"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              color: '#374151',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {texts.googleButton}
          </button> */}
        </form>
      </div>
    </div>
  )
}
