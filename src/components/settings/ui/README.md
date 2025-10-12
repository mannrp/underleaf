# Settings UI Components

This directory contains reusable UI components specifically designed for settings panels. All components follow accessibility best practices, include smooth animations, and provide comprehensive keyboard navigation support.

## Components

### SettingsToggle

A toggle switch component with smooth animations and accessibility features.

**Features:**
- Smooth toggle animations with visual feedback
- Keyboard navigation (Space, Enter)
- Disabled state support
- Hover and focus indicators
- Screen reader support
- Click feedback animations

**Usage:**
```tsx
import { SettingsToggle } from '@/components/settings/ui'

<SettingsToggle
  label="Dark Mode"
  description="Use dark theme for better visibility"
  checked={darkMode}
  onChange={setDarkMode}
  disabled={false}
/>
```

**Props:**
- `label: string` - The toggle label
- `description?: string` - Optional description text
- `checked: boolean` - Current toggle state
- `onChange: (checked: boolean) => void` - Change handler
- `disabled?: boolean` - Disable the toggle
- `className?: string` - Additional CSS classes

### SettingsSlider

A range slider component with real-time value updates and smooth animations.

**Features:**
- Real-time value display with custom formatting
- Smooth drag animations and visual feedback
- Keyboard navigation (Arrow keys, Home, End)
- Custom step values and units
- Min/max boundary enforcement
- Disabled state support
- Focus indicators and accessibility

**Usage:**
```tsx
import { SettingsSlider } from '@/components/settings/ui'

<SettingsSlider
  label="Font Size"
  description="Adjust the editor font size"
  value={fontSize}
  min={8}
  max={32}
  step={1}
  unit="px"
  onChange={setFontSize}
  formatValue={(value) => `${value} pixels`}
/>
```

**Props:**
- `label: string` - The slider label
- `description?: string` - Optional description text
- `value: number` - Current slider value
- `min: number` - Minimum value
- `max: number` - Maximum value
- `step?: number` - Step increment (default: 1)
- `unit?: string` - Unit suffix for display
- `onChange: (value: number) => void` - Change handler
- `disabled?: boolean` - Disable the slider
- `className?: string` - Additional CSS classes
- `formatValue?: (value: number) => string` - Custom value formatter

### SettingsSelect

A dropdown select component with smooth animations and keyboard navigation.

**Features:**
- Smooth dropdown animations
- Keyboard navigation (Arrow keys, Enter, Escape, Home, End)
- Option descriptions and icons
- Search-like keyboard navigation
- Click outside to close
- Disabled state support
- Screen reader support
- Focus management

**Usage:**
```tsx
import { SettingsSelect, SelectOption } from '@/components/settings/ui'

const options: SelectOption[] = [
  { 
    value: 'dark', 
    label: 'Dark Theme', 
    description: 'Dark background with light text',
    icon: Monitor 
  },
  { 
    value: 'light', 
    label: 'Light Theme', 
    description: 'Light background with dark text',
    icon: Monitor 
  }
]

<SettingsSelect
  label="Theme"
  description="Choose your preferred color scheme"
  value={theme}
  options={options}
  onChange={setTheme}
  placeholder="Select a theme..."
/>
```

**Props:**
- `label: string` - The select label
- `description?: string` - Optional description text
- `value: string` - Currently selected value
- `options: SelectOption[]` - Array of selectable options
- `onChange: (value: string) => void` - Change handler
- `disabled?: boolean` - Disable the select
- `className?: string` - Additional CSS classes
- `placeholder?: string` - Placeholder text when no option selected

**SelectOption Interface:**
```tsx
interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}
```

## Design Principles

### Accessibility
- All components support keyboard navigation
- Proper ARIA attributes and roles
- Screen reader compatibility
- Focus indicators and management
- Semantic HTML structure

### Visual Design
- Consistent with the application's dark theme
- Smooth animations and transitions (200-300ms)
- Hover and focus states with visual feedback
- Disabled states with reduced opacity
- Gradient backgrounds and shadow effects

### User Experience
- Immediate visual feedback on interactions
- Real-time value updates
- Intuitive keyboard shortcuts
- Click feedback animations
- Proper error states and validation

## Animation Details

### Toggle Animations
- 300ms ease-out transition for toggle state
- Scale animation on press (95% scale)
- Smooth background color transitions
- Ripple effect on activation

### Slider Animations
- 200ms transitions for thumb movement
- Scale animation on drag (125% scale)
- Smooth progress bar updates
- Focus ring animations

### Select Animations
- 200ms dropdown fade and scale animations
- Smooth option hover transitions
- Chevron rotation animation
- Focus state transitions

## Testing

All components include comprehensive unit tests covering:
- Rendering and basic functionality
- User interactions (click, keyboard)
- Accessibility features
- Edge cases and error states
- Animation states
- Disabled states

Run tests with:
```bash
npm run test:run -- src/tests/components/settings/ui
```

## Usage Examples

See `SettingsUIDemo.tsx` for a comprehensive example showcasing all components with various configurations and states.

## Browser Support

These components are designed to work in modern browsers with support for:
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript features
- Modern event handling

## Performance Considerations

- Components use React hooks efficiently
- Event listeners are properly cleaned up
- Animations use CSS transforms for optimal performance
- Minimal re-renders through proper state management