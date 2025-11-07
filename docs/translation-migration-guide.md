# Translation System Migration Guide

This guide explains how to update existing components to use the translation system instead of hardcoded text.

## Quick Start

1. **Seed common translation keys:**
   ```bash
   npx tsx scripts/seed-translation-keys.ts
   ```

2. **Use the `useT` hook in components:**
   ```tsx
   import { useT } from '@/hooks/use-t'
   
   function MyComponent() {
     const { t } = useT()
     return <button>{t('button.submit')}</button>
   }
   ```

## Common Translation Keys

### Buttons
- `button.submit` - Submit button
- `button.cancel` - Cancel button
- `button.save` - Save button
- `button.delete` - Delete button
- `button.edit` - Edit button
- `button.create` - Create button
- `button.add` - Add button
- `button.close` - Close button
- `button.back` - Back button
- `button.loading` - Loading state
- `button.saving` - Saving state
- `button.deleting` - Deleting state

### Navigation
- `nav.home` - Home link
- `nav.projects` - Projects link
- `nav.about` - About link
- `nav.contact` - Contact link
- `nav.services` - Services link

### Admin
- `admin.dashboard` - Dashboard title
- `admin.projects` - Projects section
- `admin.content` - Content section
- `admin.messages` - Messages section
- `admin.settings` - Settings section
- `admin.translations` - Translations section

### Messages
- `message.success` - Success message
- `message.error` - Error message
- `message.loading` - Loading message
- `message.noData` - No data message

### Forms
- `form.name` - Name field label
- `form.email` - Email field label
- `form.message` - Message field label
- `form.required` - Required field indicator

## Migration Pattern

### Before:
```tsx
<button>Submit</button>
<button>Cancel</button>
```

### After:
```tsx
import { useT } from '@/hooks/use-t'

function MyComponent() {
  const { t } = useT()
  return (
    <>
      <button>{t('button.submit')}</button>
      <button>{t('button.cancel')}</button>
    </>
  )
}
```

## Adding New Translation Keys

1. **Add to seed script** (`scripts/seed-translation-keys.ts`):
   ```typescript
   'button.newAction': {
     category: 'ui',
     description: 'Description for translators',
     translations: {
       nl: 'Nederlandse tekst',
       fr: 'Texte français',
       en: 'English text',
       de: 'Deutscher Text'
     }
   }
   ```

2. **Run seed script:**
   ```bash
   npx tsx scripts/seed-translation-keys.ts
   ```

3. **Or add via admin UI:**
   - Go to `/admin/translations`
   - Click "Add Translation Key"
   - Fill in key, category, and translations

## Components Already Updated

- ✅ `DeleteConfirmation` - Uses `button.cancel`, `button.delete`, `button.deleting`

## Components to Update (Priority Order)

1. **High Priority:**
   - `ContactForm` - Form labels and buttons
   - `AuthForm` - Login form text
   - `AdminNavigation` - Navigation links
   - `ProjectForm` - Form labels
   - `ContentForm` - Form labels

2. **Medium Priority:**
   - `ProjectList` - Table headers and actions
   - `ContentList` - Table headers and actions
   - `ContactMessageList` - Table headers
   - `MediaLibrary` - Buttons and labels

3. **Low Priority:**
   - `AnalyticsDashboard` - Chart labels
   - `ThemeSettings` - Setting labels
   - `EmailSettings` - Setting labels

## Best Practices

1. **Always provide fallback values:**
   ```tsx
   const { t } = useT({ defaultValue: 'Default Text' })
   ```

2. **Use descriptive key names:**
   - ✅ `button.submit`
   - ❌ `btn1` or `submit`

3. **Group related keys by category:**
   - `button.*` for buttons
   - `form.*` for form fields
   - `admin.*` for admin UI
   - `message.*` for messages

4. **Keep keys consistent:**
   - Use same key across components
   - Don't duplicate similar keys

5. **Test with different languages:**
   - Switch languages in admin
   - Verify all translations appear correctly

## Troubleshooting

**Translation not showing:**
- Check if key exists in database
- Verify language is active
- Check browser console for errors
- Clear translation cache if needed

**Missing translation:**
- Add translation via admin UI
- Or update seed script and re-run

