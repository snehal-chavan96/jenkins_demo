# EcoLearn - Required Dependencies

## Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "motion": "^11.x",
    "lucide-react": "^0.x",
    "sonner": "^2.0.3",
    "react-hook-form": "^7.55.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.x",
    "@types/react-dom": "^18.3.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

## Installation Commands

### Using npm
```bash
npm install react react-dom react-router-dom motion lucide-react
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss
```

### Using yarn
```bash
yarn add react react-dom react-router-dom motion lucide-react
yarn add -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss
```

### Using pnpm
```bash
pnpm add react react-dom react-router-dom motion lucide-react
pnpm add -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss
```

## Import Syntax

### Motion (Framer Motion)
```typescript
import { motion } from 'motion/react';
```

### React Hook Form (with specific version)
```typescript
import { useForm } from 'react-hook-form@7.55.0';
```

### Sonner (with specific version)
```typescript
import { toast } from 'sonner@2.0.3';
```

### Lucide Icons
```typescript
import { Leaf, Award, BookOpen } from 'lucide-react';
```

### React Router
```typescript
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
```

## Shadcn/UI Components

The project uses shadcn/ui components located in `/components/ui`. These are already included in the project and don't require additional installation.

## Notes

- All dependencies are configured to work in the Figma Make environment
- Some packages require specific version imports (noted above)
- For other packages, use standard import syntax without version numbers
- The project is optimized for React 18+ features
