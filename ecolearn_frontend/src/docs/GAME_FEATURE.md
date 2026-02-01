# 🎮 Eco Placement Challenge - Game Feature Documentation

## Overview

A new interactive drag-and-drop game has been added to the **Challenges** section of EcoLearn. Students can now enjoy a fun, time-based puzzle game where they strategically place eco-themed objects on a 5×5 grid to maximize their environmental impact score.

---

## 🎯 Game Concept

**Eco Placement Challenge** is a 2-minute timed game where players:
1. Drag eco-themed objects from a panel
2. Drop them into a 5×5 grid
3. Earn points based on object values
4. Race against the clock to maximize their score

---

## 🎨 Game Features

### **Main Game Components**

#### 1. **Top Bar**
- **Title**: "Eco Placement Challenge" with animated sparkles icon
- **Timer**: 2-minute countdown (turns red when ≤ 10 seconds)
- **Score Display**: Real-time score counter

#### 2. **Game Grid (Left Section)**
- **5×5 Grid**: 25 cells for placing objects
- **Visual States**:
  - Empty cells: Light border, transparent background
  - Hovered cells (during drag): Green border, green background
  - Filled cells: White background with placed object and points
- **Grid Size**: Each cell is 80×80px
- **Background**: Soft green/emerald gradient

#### 3. **Objects Panel (Right Section)**
- **30 Eco Objects**: Randomly generated from 8 object types
- **Object Cards**: Colorful gradient backgrounds
- **Scrollable Panel**: 600px height with custom scrollbar
- **Draggable**: Only during active gameplay

#### 4. **Bottom Controls**
- **Start Game**: Large green button to begin
- **Reset Game**: Available during gameplay (red outline)
- **Play Again**: Appears after game ends
- **Submit Score**: Disabled state (future feature)

---

## 🌱 Eco Objects & Point Values

| Object | Icon | Points | Color Gradient | Strategy |
|--------|------|--------|----------------|----------|
| **Tree** | 🌳 | +10 | Green | Maximum points! |
| **Recycling Centre** | ♻️ | +10 | Emerald | Maximum points! |
| **Garden** | 🌸 | +8 | Pink | High value |
| **Solar Panel** | ☀️ | +7 | Orange | Good points |
| **Bus** | 🚌 | +6 | Yellow | Public transport |
| **Building** | 🏢 | +5 | Slate | Neutral |
| **Bike** | 🚲 | +4 | Blue | Eco-friendly transport |
| **Car** | 🚗 | -2 | Red | **PENALTY!** Avoid! |

### **Maximum Possible Score**: 250 points
- 25 cells × 10 points (all Trees/Recycling Centres)
- Realistic high score: 150-200 points

---

## 🎮 Gameplay Mechanics

### **Game States**

#### **1. Idle State**
- **Display**: Instructions and "Start Game" button
- **Grid**: Empty, not interactive
- **Objects**: Visible but not draggable
- **UI**: Shows "How to Play" section

#### **2. Playing State**
- **Timer**: Counting down from 2:00
- **Grid**: Interactive, accepts drops
- **Objects**: Fully draggable
- **Score**: Updates in real-time
- **Controls**: "Reset Game" button available

#### **3. Ended State**
- **Display**: "Game Over!" message with final score
- **Grid**: Frozen with final placements
- **Objects**: No longer draggable
- **Controls**: "Play Again" and "Submit Score" buttons

---

## 🎯 Drag & Drop Behavior

### **Drag Start**
1. User clicks and holds an object card
2. Object becomes semi-transparent
3. Cursor changes to "grabbing"
4. Game must be in "playing" state

### **Drag Over Grid**
1. Hovered cell highlights (green border + background)
2. Ghost preview of object appears in cell
3. Occupied cells cannot be hovered

### **Drop**
1. Object places in cell with animation (scale + rotate)
2. Points immediately added to score
3. Object removed from available objects panel
4. Cell becomes occupied (cannot be replaced)

### **Drag Constraints**
- Only works during "playing" state
- Cannot drag if game is idle or ended
- Cannot drop on occupied cells
- Objects disappear after placement

---

## 🎨 Visual Design

### **Color Scheme**
- **Primary**: Green, Emerald (eco-theme)
- **Secondary**: Blue, Purple, Pink
- **Accent**: Orange, Yellow
- **Warnings**: Red (timer, car penalty)

### **Animations**

#### **Object Placement**
```css
scale: 0 → 1
rotate: -180° → 0°
duration: 0.3s
```

#### **Hover Effects**
```css
scale: 1 → 1.05
translateY: 0 → -2px
```

#### **Timer Warning**
```css
/* When ≤ 10 seconds */
animation: pulse infinite
color: red
```

#### **Icon Animations**
- Sparkles: Rotate + Scale loop
- Game Icon: Wiggle rotation

---

## 📱 Responsive Design

### **Desktop (≥ 1024px)**
- Grid and panel side-by-side
- Full 5×5 grid visible
- Objects panel: 2 columns
- Optimal experience

### **Tablet (768px - 1023px)**
- Grid stacks above panel
- 5×5 grid maintained
- Objects panel: 2 columns
- Scrollable sections

### **Mobile (< 768px)**
- Single column layout
- Grid size adapts (smaller cells)
- Objects panel: 2 columns
- Touch-optimized drag/drop

---

## 🎓 Educational Value

### **Learning Objectives**
1. **Environmental Awareness**: Recognize eco-friendly vs. harmful objects
2. **Decision Making**: Strategic placement under time pressure
3. **Resource Management**: Limited space, maximize impact
4. **Sustainability**: Understand point values = environmental impact

### **Skills Developed**
- Quick thinking
- Spatial reasoning
- Environmental literacy
- Time management
- Strategic planning

---

## 🔧 Technical Implementation

### **State Management**
```typescript
const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
const [score, setScore] = useState(0);
const [grid, setGrid] = useState<GridCell[][]>([]);
const [availableObjects, setAvailableObjects] = useState<Object[]>([]);
const [draggedObject, setDraggedObject] = useState<Object | null>(null);
const [hoveredCell, setHoveredCell] = useState<{row, col} | null>(null);
```

### **Grid Structure**
```typescript
type GridCell = {
  row: number;
  col: number;
  object: EcoObject | null;
};

// 5×5 grid = 25 cells
const grid: GridCell[][] = [
  [cell, cell, cell, cell, cell],
  [cell, cell, cell, cell, cell],
  [cell, cell, cell, cell, cell],
  [cell, cell, cell, cell, cell],
  [cell, cell, cell, cell, cell]
];
```

### **Timer Logic**
```typescript
useEffect(() => {
  if (gameState === 'playing' && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [gameState, timeLeft]);
```

---

## 🚀 How to Access

### **From Challenges Page**
1. Navigate to **Challenges** section
2. Look for the **"Eco Placement Challenge"** card (first card, purple/pink theme)
3. Click **"Play Now!"** button
4. Game opens in full screen

### **Visual Indicator**
- Card has **"NEW!"** badge
- Purple/pink gradient background
- Game controller icon (🎮)
- Animated wiggling icon

---

## 🎮 Game Flow

### **Complete Game Flow**
```
1. User clicks "Play Now!" on challenge card
   ↓
2. Game screen loads (full screen)
   ↓
3. User sees idle state with instructions
   ↓
4. User clicks "Start Game"
   ↓
5. Timer starts (2:00), objects become draggable
   ↓
6. User drags objects onto grid
   ↓
7. Score updates with each placement
   ↓
8. Timer counts down
   ↓
9. Timer reaches 0:00
   ↓
10. Game ends, final score displayed
    ↓
11. User can "Play Again" or "Submit Score"
    ↓
12. Click "Back to Challenges" to exit
```

---

## 📊 Scoring System

### **Point Calculation**
```typescript
// Each object has a point value
const objectPoints = {
  tree: 10,
  recycle: 10,
  garden: 8,
  solar: 7,
  bus: 6,
  building: 5,
  bike: 4,
  car: -2  // Penalty!
};

// Score updates immediately on placement
score += placedObject.points;
```

### **Score Tiers**
- **0-50 points**: Beginner 🌱
- **51-100 points**: Good Start 🌿
- **101-150 points**: Eco Warrior 🌳
- **151-200 points**: Planet Protector 🌍
- **201-250 points**: Master Environmentalist 🏆

---

## 🎨 UI Components Used

### **Shadcn/UI**
- ✅ `Card`, `CardContent`, `CardHeader`
- ✅ `Button`
- ✅ `Badge`

### **Lucide Icons**
- ✅ `TreeDeciduous`, `Building2`, `Bike`, `Bus`, `Car`
- ✅ `Sun`, `Flower2`, `Recycle`
- ✅ `Timer`, `Trophy`, `Play`, `RotateCcw`, `Sparkles`, `Gamepad2`

### **Motion (Framer Motion)**
- ✅ Animations for object placement
- ✅ Hover effects
- ✅ Timer pulse
- ✅ Icon rotations

---

## 🐛 Known Limitations & Future Enhancements

### **Current Limitations**
1. Objects cannot be removed once placed
2. No undo functionality
3. Grid is 5×5 (fixed size)
4. 30 objects (randomly generated)
5. Submit score is UI-only (not connected to backend)

### **Future Enhancements**
1. **Difficulty Levels**:
   - Easy: 3×3 grid, 3 minutes
   - Medium: 5×5 grid, 2 minutes (current)
   - Hard: 7×7 grid, 1 minute

2. **Power-Ups**:
   - Time freeze (add 30 seconds)
   - Double points (next 3 placements)
   - Remove object (undo placement)

3. **Leaderboard Integration**:
   - Save scores to backend
   - Global leaderboard
   - Personal best tracking

4. **Achievements**:
   - First game completed
   - Score 100+ points
   - No car placements (eco-purist)
   - Fill entire grid

5. **Multiplayer Mode**:
   - Two players compete on same screen
   - Turn-based placement
   - Highest score wins

6. **Daily Challenges**:
   - Specific object requirements
   - Bonus points for patterns
   - Limited object types

---

## 🧪 Testing Checklist

### **Functional Testing**
- [ ] Game starts when clicking "Start Game"
- [ ] Timer counts down correctly
- [ ] Objects are draggable only during gameplay
- [ ] Drag & drop works correctly
- [ ] Grid cells accept only one object
- [ ] Score updates correctly
- [ ] Game ends when timer reaches 0
- [ ] "Play Again" resets everything
- [ ] "Back to Challenges" returns to challenge list

### **UI/UX Testing**
- [ ] All animations work smoothly
- [ ] Hover states are visible
- [ ] Timer turns red at 10 seconds
- [ ] Objects have correct colors
- [ ] Grid cells highlight on hover
- [ ] Responsive on mobile/tablet/desktop

### **Edge Cases**
- [ ] Dragging outside grid (should not place)
- [ ] Dropping on occupied cell (should reject)
- [ ] Timer reaches 0 mid-drag (should cancel)
- [ ] Resetting game mid-play (should work)
- [ ] No objects left (game continues)

---

## 📝 Code Location

### **File Structure**
```
/src/
  └── components/
      └── games/
          └── EcoPlacementGame.tsx  ← Main game component

/pages/
  └── Challenges.tsx  ← Integration point
```

### **Integration Code**
```typescript
// In Challenges.tsx
import { EcoPlacementGame } from '../components/games/EcoPlacementGame';

const [showGame, setShowGame] = useState(false);

// Show game when clicked
if (showGame) {
  return <EcoPlacementGame />;
}

// Game card in challenges grid
<Button onClick={() => setShowGame(true)}>
  Play Now!
</Button>
```

---

## 🎉 Success Metrics

### **Engagement**
- Average game duration: ~2 minutes
- Completion rate: Target 80%+
- Replay rate: Target 50%+ play again

### **Learning Impact**
- Increased awareness of eco-friendly choices
- Understanding of environmental impact scores
- Strategic thinking development

### **User Satisfaction**
- Fun and engaging gameplay
- Clear visual feedback
- Appropriate difficulty level
- Smooth user experience

---

## 🌟 Summary

The **Eco Placement Challenge** successfully combines:
- ✅ **Education**: Environmental awareness through gameplay
- ✅ **Entertainment**: Fun, addictive game mechanics
- ✅ **Engagement**: Time-pressure creates excitement
- ✅ **Visual Design**: Playful, nature-themed UI
- ✅ **Accessibility**: Easy to learn, responsive design

**Perfect for the EcoLearn platform's goal of making environmental education fun and interactive for students ages 8-16!**

---

**Game is ready to play! 🎮🌱**

*EcoLearn - Save the Planet, One Game at a Time!*
