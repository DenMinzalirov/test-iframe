# Radin Iframe Landing

Лендинг-страница с модальным окном регистрации поверх оригинального сайта через iframe.

## Особенности

- 🎯 Модальное окно регистрации поверх оригинального сайта
- 📱 Адаптивный дизайн
- ✅ Валидация форм с React Hook Form и Zod
- 🎨 Современный UI с Tailwind CSS
- 🔒 TypeScript для типобезопасности

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

Для изменения URL оригинального сайта отредактируйте файл `app/page.tsx`:

```tsx
<iframe
  src="https://hertzbetz.io"  // Замените на нужный URL
  // ...
/>
```

## Сборка для продакшена

```bash
npm run build
npm start
```
# test-iframe
