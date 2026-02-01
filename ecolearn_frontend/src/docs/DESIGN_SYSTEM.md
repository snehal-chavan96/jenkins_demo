# 🎨 EcoLearn - Design System Documentation

## Overview
EcoLearn uses a vibrant, child-friendly, nature-themed design system optimized for engagement and learning. This document outlines all design tokens, components, patterns, and usage guidelines.

---

## 🌈 Color Palette

### Primary Colors (Nature-Inspired)

```css
/* Greens (Growth & Nature) */
--eco-green: #22c55e       /* Primary green */
--eco-green-dark: #16a34a  /* Hover states */
--eco-green-light: #86efac /* Backgrounds */
--eco-emerald: #10b981     /* Accents */
--eco-lime: #84cc16        /* Highlights */
--eco-teal: #14b8a6        /* Secondary */

/* Blues (Water & Sky) */
--eco-blue: #3b82f6        /* Primary blue */
--eco-blue-dark: #2563eb   /* Hover states */
--eco-blue-light: #93c5fd  /* Backgrounds */
--eco-sky: #0ea5e9         /* Accents */

/* Yellows (Sunshine & Energy) */
--eco-yellow: #fbbf24      /* Primary yellow */
--eco-yellow-dark: #f59e0b /* Hover states */
--eco-yellow-light: #fde047/* Backgrounds */

/* Earth Tones */
--eco-brown: #92400e       /* Dark brown */
--eco-brown-light: #d97706 /* Light brown */
```

### Semantic Colors

```css
/* UI States */
--success: var(--eco-green)
--warning: var(--eco-yellow)
--error: #ef4444
--info: var(--eco-blue)

/* Backgrounds */
--background: #f0fdf4      /* Light green tint */
--card: #ffffff            /* Pure white */
--muted: #f1f5f9          /* Light gray */

/* Text */
--foreground: #1e293b      /* Dark gray (primary text) */
--muted-foreground: #64748b /* Medium gray (secondary text) */
```

### Gradients

```css
/* Primary Gradients */
.gradient-green: from-green-400 via-green-500 to-emerald-600
.gradient-blue: from-blue-400 via-blue-500 to-blue-600
.gradient-yellow: from-yellow-400 via-yellow-500 to-orange-500
.gradient-purple: from-purple-400 via-purple-500 to-purple-600
.gradient-orange: from-orange-400 via-orange-500 to-red-600

/* Background Gradients */
.bg-gradient-eco: from-green-50 via-blue-50 to-yellow-50
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Nunito', system-ui, -apple-system, sans-serif;
```

**Why Nunito?**
- Rounded, friendly letterforms perfect for children
- Excellent readability at all sizes
- Wide range of weights (400-800)
- Google Fonts CDN available

### Type Scale

| Element | Mobile | Tablet | Desktop | Weight | Line Height |
|---------|--------|--------|---------|--------|-------------|
| H1 | 30px | 36px | 48px | 800 | 1.3 |
| H2 | 24px | 28px | 36px | 700 | 1.3 |
| H3 | 20px | 22px | 24px | 700 | 1.4 |
| H4 | 16px | 18px | 20px | 600 | 1.5 |
| Body | 14px | 16px | 16px | 400 | 1.6 |
| Small | 12px | 14px | 14px | 400 | 1.5 |
| Button | 14px | 16px | 16px | 600 | 1.5 |

### Usage Examples

```tsx
// Headings with gradient
<h1 className="text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">

// Body text
<p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">

// Small text
<span className="text-xs sm:text-sm text-gray-600">
```

---

## 🎯 Icons

### Icon System: Lucide React
**Why Lucide?**
- Consistent 2px stroke width
- Clean, minimal design
- Nature-themed icons available
- Tree-shakeable (small bundle size)
- SVG format (scalable & crisp)

### Icon Categories

#### **Nature & Environment**
```tsx
import { Leaf, TreePine, Sprout, Flower2, Sun, Cloud, Droplets } from 'lucide-react';
```

#### **Learning & Education**
```tsx
import { BookOpen, GraduationCap, School, Brain, Lightbulb } from 'lucide-react';
```

#### **Gamification**
```tsx
import { Trophy, Award, Medal, Star, Sparkles, Zap, Target } from 'lucide-react';
```

#### **Social**
```tsx
import { Users, User, Heart, ThumbsUp, MessageCircle } from 'lucide-react';
```

#### **Navigation**
```tsx
import { Home, Search, Menu, ArrowRight, ChevronDown } from 'lucide-react';
```

### Icon Sizing

```tsx
// Small icons (in text)
<Icon className="h-4 w-4 sm:h-5 sm:w-5">

// Medium icons (in buttons)
<Icon className="h-5 w-5 sm:h-6 sm:w-6">

// Large icons (features)
<Icon className="h-8 w-8 sm:h-10 sm:w-10">

// Hero icons
<Icon className="h-12 w-12 sm:h-16 sm:w-16">
```

### Icon Colors

```tsx
// Success/Nature
<Leaf className="text-green-600" />

// Info
<Info className="text-blue-600" />

// Warning
<AlertTriangle className="text-yellow-600" />

// Error
<XCircle className="text-red-600" />
```

---

## 🎭 Emojis

### Strategic Emoji Usage
Emojis add personality and engagement for young users:

```tsx
// Page titles
"Super Cool Eco Courses! 📚"
"Epic Eco Challenges! 🎯"
"Top Eco-Heroes! 🏆"

// Stats and achievements
"🌿 Eco-Points"
"📚 Courses"
"🎯 Challenges"
"⭐ Level 5"

// Success messages
"Woohoo! You earned 50 points! 🎉"
"Great job! Keep going! 🚀"
"You're amazing! 🌟"

// Call-to-actions
"Join the Adventure Now! 🌍"
"Start Learning Today! 🌱"
```

### Emoji Guidelines
- ✅ Use for headings, stats, badges
- ✅ Use in success/celebration messages
- ✅ Use in navigation labels (optional)
- ❌ Don't overuse (max 1-2 per sentence)
- ❌ Don't use in error messages
- ❌ Don't replace important text

---

## 🎨 Components

### Buttons

#### Variants

```tsx
// Primary (Green Gradient)
<Button className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700">

// Secondary (Outline)
<Button variant="outline" className="border-2 border-green-300 hover:bg-green-50">

// Destructive
<Button variant="destructive">

// Ghost
<Button variant="ghost">
```

#### Sizes

```tsx
// Small
<Button className="h-10 px-4 text-sm rounded-xl">

// Medium (default)
<Button className="h-12 sm:h-14 px-6 text-base sm:text-lg rounded-xl sm:rounded-2xl">

// Large
<Button className="h-14 sm:h-16 px-8 text-lg sm:text-xl rounded-2xl">
```

### Cards

```tsx
// Standard card
<Card className="border-3 sm:border-4 border-green-200 rounded-2xl sm:rounded-3xl shadow-xl bg-white">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Gradient card
<Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">

// Colored border card
<Card className="border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
```

### Badges

```tsx
// Success
<Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white">Completed</Badge>

// Warning
<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Medium</Badge>

// Info
<Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">New</Badge>

// Locked
<Badge variant="secondary">Locked</Badge>
```

### Inputs

```tsx
<Input className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-green-200 focus:border-green-400 text-sm sm:text-base" />
```

### Avatars

```tsx
<Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ring-4 ring-green-300">
  <AvatarImage src="..." />
  <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white">
    A
  </AvatarFallback>
</Avatar>
```

### Progress Bars

```tsx
// Standard
<Progress value={75} className="h-3" />

// Colored
<Progress value={75} className="h-3 bg-green-100" />

// With label
<div className="flex items-center gap-2">
  <Progress value={75} className="flex-1 h-3" />
  <span className="text-sm">75%</span>
</div>
```

---

## 🎬 Animations

### Motion Library: Framer Motion

```tsx
import { motion } from 'motion/react';
```

### Standard Animations

#### **Fade In**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

#### **Slide In (From Bottom)**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

#### **Scale In**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
```

#### **Hover Effects**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
>
```

#### **Continuous Animations**
```tsx
// Floating
<motion.div
  animate={{ y: [-10, 10, -10] }}
  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
>

// Pulsing
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>

// Rotating
<motion.div
  animate={{ rotate: [0, 360] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
>
```

### Staggered Animations

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 📐 Spacing System

### Padding & Margins

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.25rem (4px) | Tight spacing |
| sm | 0.5rem (8px) | Small gaps |
| base | 1rem (16px) | Default spacing |
| md | 1.5rem (24px) | Medium gaps |
| lg | 2rem (32px) | Large gaps |
| xl | 3rem (48px) | Extra large gaps |
| 2xl | 4rem (64px) | Hero spacing |

### Responsive Spacing

```tsx
// Component padding
<div className="p-4 sm:p-6 lg:p-8">

// Vertical spacing
<div className="space-y-4 sm:space-y-6 lg:space-y-8">

// Grid gaps
<div className="grid gap-4 sm:gap-6 lg:gap-8">
```

---

## 🎯 Border System

### Border Widths

```tsx
// Standard
className="border"        // 1px

// Emphasized
className="border-2"      // 2px

// Bold (child-friendly)
className="border-3"      // 3px (mobile)
className="border-4"      // 4px (desktop)
```

### Border Radius

```tsx
// Small
className="rounded-lg"          // 0.5rem

// Medium
className="rounded-xl"          // 0.75rem
className="sm:rounded-2xl"      // 1rem (desktop)

// Large
className="rounded-2xl"         // 1rem
className="sm:rounded-3xl"      // 1.5rem (desktop)

// Full
className="rounded-full"        // Circle/pill
```

### Border Colors

```tsx
// Success/Nature
className="border-green-200"   // Light
className="border-green-400"   // Medium
className="border-green-600"   // Dark

// Info
className="border-blue-200"

// Warning
className="border-yellow-200"

// Neutral
className="border-gray-200"
```

---

## 🌟 Shadows

### Shadow Scale

```tsx
// Subtle
className="shadow-sm"         // Card hover preview

// Standard
className="shadow-md"         // Default cards

// Emphasized
className="shadow-lg"         // Important cards

// Strong
className="shadow-xl"         // Hero sections

// Maximum
className="shadow-2xl"        // Modals, popovers
```

### Colored Shadows (for emphasis)

```tsx
// Green glow
className="shadow-lg shadow-green-200/50"

// Blue glow
className="shadow-lg shadow-blue-200/50"

// Yellow glow
className="shadow-lg shadow-yellow-200/50"
```

---

## 🎨 Component States

### Hover States

```tsx
// Cards
className="hover:shadow-2xl hover:bg-green-50 transition-all"

// Buttons
className="hover:from-green-600 hover:via-green-700 hover:to-emerald-700"

// Links
className="hover:text-green-600 transition-colors"
```

### Focus States

```tsx
// Inputs
className="focus:border-green-400 focus:ring-2 focus:ring-green-200"

// Buttons (keyboard navigation)
className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
```

### Active States

```tsx
// Buttons
className="active:scale-95"

// Links
className="active:text-green-700"
```

### Disabled States

```tsx
// Buttons
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Inputs
className="disabled:bg-gray-100 disabled:text-gray-500"
```

---

## 🌍 Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

### Focus Indicators

```tsx
// Visible focus rings
className="focus:ring-2 focus:ring-green-500 focus:ring-offset-2"

// High contrast mode support
className="outline-offset-2"
```

### Screen Reader Text

```tsx
// Visually hidden but accessible
<span className="sr-only">Screen reader text</span>

// ARIA labels
<button aria-label="Close menu">
  <X className="h-5 w-5" />
</button>
```

---

## 📦 Component Library

### Shadcn/UI Components Used

- **Layout**: Card, Separator
- **Forms**: Input, Label, Button, Checkbox, RadioGroup, Select, Textarea
- **Feedback**: Alert, Toast (Sonner), Progress, Badge
- **Overlays**: Dialog, Dropdown, Popover, Tooltip
- **Navigation**: Tabs, Breadcrumb
- **Data**: Table, Avatar
- **Advanced**: Calendar, Command, Accordion

All components are:
- ✅ Fully responsive
- ✅ Accessible (WCAG AA)
- ✅ Customizable with Tailwind
- ✅ Compatible with Framer Motion

---

## 🎯 Design Principles

### 1. **Child-Friendly**
- Rounded corners everywhere
- Bright, cheerful colors
- Playful emojis and icons
- Clear, simple language
- Large touch targets

### 2. **Nature-Themed**
- Green as primary color
- Earth tones for warmth
- Natural gradients
- Organic shapes
- Environmental imagery

### 3. **Gamified**
- Progress indicators everywhere
- Animated badges and rewards
- Leaderboards and competitions
- Points and levels
- Celebratory animations

### 4. **Accessible**
- High contrast text
- Keyboard navigation
- Screen reader support
- Touch-friendly targets
- Clear focus states

### 5. **Performant**
- Optimized images
- Lazy loading
- Code splitting
- Minimal animations on mobile
- Tree-shaken icons

---

## 📚 Resources

### Design Tools
- Figma for mockups
- Tailwind CSS for styling
- Lucide for icons
- Framer Motion for animations
- Google Fonts (Nunito)

### Inspiration
- Duolingo (gamification)
- Khan Academy (learning)
- National Geographic Kids (nature theme)
- Minecraft Education (playful design)

### Documentation
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn/UI](https://ui.shadcn.com)

---

**Last Updated:** October 28, 2025  
**Version:** 2.0  
**Maintained by:** EcoLearn Design Team
