# Settings Sections

This directory contains all the settings section components for the Underleaf LaTeX Editor settings panel.

## Components

### AppearanceSettings

The `AppearanceSettings` component provides a comprehensive interface for customizing the visual appearance of the editor and interface.

#### Features

- **Theme Mode Toggle**: Quick switch between light and dark themes
- **Color Theme Selection**: Choose from curated themes including:
  - Light themes: Light, Solarized Light, GitHub Light
  - Dark themes: Dark, Monokai, Solarized Dark, GitHub Dark
- **Theme Preview Cards**: Visual previews with syntax highlighting examples
- **Real-time Application**: Changes are applied immediately
- **Responsive Design**: Adapts to different screen sizes

#### Usage

```tsx
import { AppearanceSettings } from '@/components/settings/sections'

function SettingsPanel() {
  return (
    <div>
      <AppearanceSettings />
    </div>
  )
}
```

#### Props

- `className?: string` - Optional CSS classes to apply to the component

#### Requirements Satisfied

This component satisfies the following requirements from the specification:

- **4.1**: Display available themes including Monokai, Solarized, GitHub variants
- **4.2**: Immediately apply theme to both editor and UI when selected
- **4.3**: Update syntax highlighting colors to match the theme
- **4.4**: Maintain functionality across all themes
- **4.5**: Load previously selected theme on application restart

#### Theme Integration

The component integrates with:

- `useTheme` hook for theme management
- `useSettingsStore` for settings persistence
- Theme utilities from `@/utils/themes`
- CSS custom properties for dynamic theming

#### Testing

Comprehensive tests are available in `src/tests/components/settings/sections/AppearanceSettings.test.tsx` covering:

- Component rendering
- Theme selection functionality
- Toggle behavior
- Preview display
- Integration with hooks and stores

#### Demo

A demo component is available at `AppearanceSettingsDemo` for development and testing purposes.