# Radin Iframe Landing

Лендинг-страница с модальным окном регистрации поверх оригинального сайта через iframe с интеграцией Apuesta.cloud.

## Особенности

- 🎯 Модальное окно регистрации поверх оригинального сайта
- 📱 Адаптивный дизайн
- ✅ Валидация форм с React Hook Form и Zod
- 🎨 Современный UI с inline стилями
- 🔒 TypeScript для типобезопасности
- 🚀 Интеграция с Apuesta.cloud для автоматической регистрации
- 🔄 Автоматическое перенаправление на сайт казино

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Запустите проект в режиме разработки:
```bash
npm run dev
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Структура проекта

```
├── app/
│   ├── globals.css      # Глобальные стили
│   ├── layout.tsx      # Основной layout
│   └── page.tsx        # Главная страница
├── components/
│   └── RegistrationModal.tsx  # Компонент модального окна
├── lib/
│   └── types.ts        # TypeScript типы
└── package.json
```

## Технологии

- **Next.js 14** - React фреймворк
- **React Hook Form** - Управление формами
- **Zod** - Валидация схем
- **Tailwind CSS** - Стилизация
- **TypeScript** - Типизация

## Настройка

### 1. Конфигурация Apuesta.cloud

Отредактируйте файл `app/page.tsx` и замените параметры на ваши реальные:

```tsx
const response = await initAppAndGetActiveDomain(
  'https://redirector.origin', // Замените на ваш redirectorOrigin
  'campaignId' // Замените на ваш redirectorCampaignId
)
```

### 2. Изменение URL казино

Для изменения URL оригинального сайта отредактируйте файл `app/page.tsx`:

```tsx
<iframe
  src="https://hertzbetz.io"  // Замените на нужный URL
  // ...
/>
```

### 3. Настройка валюты и языка

В файле `components/RegistrationModal.tsx` измените значения по умолчанию:

```tsx
defaultValues: {
  currency: 'EUR', // Валюта по умолчанию
  language: 'ru',  // Язык по умолчанию
  // ...
}
```

## Сборка для продакшена

```bash
npm run build
npm start
```
# test-iframe
