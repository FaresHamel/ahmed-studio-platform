# i18n Setup - Ahmed Studio

## Overview
This is a simple, lightweight i18n (internationalization) setup supporting **English (en)** and **Arabic (ar)** with automatic RTL/LTR layout adaptation.

## Architecture

### Files
- **`en.json`** - English translations
- **`ar.json`** - Arabic translations
- **`translations.ts`** - Translation helpers and language utilities
- **`context.tsx`** - React context for language state management (client-side)

### How It Works

1. **Language State**: Stored in `localStorage` so it persists across sessions
2. **HTML Attributes**: Automatically updates `<html lang>` and `<html dir>` based on selected language
3. **Provider**: `I18nProvider` wraps the app in `layout.tsx` to provide translations
4. **Hook**: `useI18n()` hook accesses translations and language state from any client component

## Usage

### In Components (Client-Side)

```tsx
'use client';
import { useI18n } from '@/src/i18n/context';

export default function MyComponent() {
  const { t, language, setLanguage, isRTL } = useI18n();

  return (
    <div>
      <h1>{t.home.hero.title}</h1>
      <p>{t.home.hero.description}</p>
      <button onClick={() => setLanguage('ar')}>
        {t.nav.switchLang}
      </button>
    </div>
  );
}
```

### Translation Keys

Translations are nested by section:
- `t.nav.*` - Navigation labels
- `t.footer.*` - Footer content
- `t.home.*` - Home page sections
- `t.about.*` - About page sections
- `t.consultant.*` - Consultant page sections
- `t.cloudStorage.*` - Cloud storage sections
- `t.enhancement.*` - Enhancement sections
- `t.order.*` - Order/checkout sections
- `t.ourLab.*` - Lab sections
- `t.services.*` - Services page
- `t.subscriptions.*` - Subscription sections

### RTL/LTR Adaptation

The `isRTL` property tells you if the current language is RTL:

```tsx
<div className={isRTL ? 'text-right' : 'text-left'}>
  {t.content.text}
</div>
```

Or use conditional Tailwind:
```tsx
<div className={`${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
  {/* Content */}
</div>
```

## Fonts

- **Poppins** (Playfair secondary, h1) - Used for English (all weights 300-700)
- **Amiri** (Arabic serif) - Used for Arabic (weights 400, 700)

Both are imported in `src/lib/fonts.ts` and available as CSS variables:
- `--font-poppins`
- `--font-playfair`
- `--font-amiri`

The HTML `dir` attribute automatically switches to `rtl` when Arabic is selected, so all text direction adapts naturally.

## Language Switcher

Located in the **Navbar** - a styled button with an earth icon that toggles between languages. The button label automatically shows the opposite language name:
- When `en`: shows "العربية" (Arabic)
- When `ar`: shows "English"

## Best Practices

1. **Use dot notation** to access nested translations: `t.section.subsection.key`
2. **Update both en.json and ar.json** whenever adding new content
3. **Keep translations in sync** - add the same keys to both files
4. **Use client-side context** - all i18n operations happen on the client
5. **Respect RTL** - always test Arabic layout; some components may need `flex-row-reverse` or text alignment adjustments
6. **Store language in localStorage** - persistence is automatic via the context

## Testing

To test:
1. Click the language switcher in the navbar
2. Verify all text updates
3. Check that `<html dir>` changes to `rtl` for Arabic
4. Verify layout shifts for RTL (text alignment, flex direction, padding)
5. Refresh the page - language preference should persist

## Future Enhancements

- Add more languages (French, Spanish, etc.)
- Dynamic translation loading from CMS
- Server-side rendering optimization
- Translation statistics and coverage reporting
