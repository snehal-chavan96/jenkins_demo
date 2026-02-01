# 🎯 Navbar Behavior Guide - Quick Reference

## Authentication States

### 🔓 **NOT LOGGED IN** (Landing Page)

#### What Users See:
```
┌────────────────────────────────────┐
│ 🌱 EcoLearn    Login | Get Started │
└────────────────────────────────────┘
```

#### Elements Shown:
- ✅ EcoLearn logo (clickable → `/`)
- ✅ Login button → navigates to `/login`
- ✅ Get Started button → navigates to `/register`

#### Elements Hidden:
- ❌ Dashboard link
- ❌ Courses link
- ❌ Challenges link
- ❌ Leaderboard link
- ❌ Rewards link
- ❌ Profile avatar icon
- ❌ Eco-points counter
- ❌ Mobile menu button

---

### 🔐 **LOGGED IN AS STUDENT**

#### What Users See:
```
┌─────────────────────────────────────────────────────────┐
│ 🌱 EcoLearn | Dashboard | Courses | Challenges |       │
│ Leaderboard | Rewards | 🌿 1250 | 👤                   │
└─────────────────────────────────────────────────────────┘
```

#### Desktop Navigation:
- ✅ Dashboard → `/dashboard`
- ✅ Courses → `/courses`
- ✅ Challenges → `/challenges`
- ✅ Leaderboard → `/leaderboard`
- ✅ Rewards → `/rewards`
- ✅ Eco-points counter (shows current points)
- ✅ Profile avatar (dropdown menu)

#### Profile Dropdown Menu:
```
┌──────────────────┐
│ John Doe         │
│ john@example.com │
├──────────────────┤
│ 👤 Profile       │ ← Click → /profile
├──────────────────┤
│ 🚪 Logout        │ ← Click → Logout + redirect to /
└──────────────────┘
```

#### Mobile View:
- ✅ Hamburger menu (☰) button
- ✅ Opens drawer with all navigation links
- ✅ Includes Profile and Logout options

---

### 👨‍🏫 **LOGGED IN AS TEACHER**

#### What Users See:
```
┌──────────────────────────────────────────┐
│ 🌱 EcoLearn | Dashboard | Courses |      │
│ Leaderboard | 👤                          │
└──────────────────────────────────────────┘
```

#### Desktop Navigation:
- ✅ Dashboard → `/teacher-dashboard`
- ✅ Courses → `/courses`
- ✅ Leaderboard → `/leaderboard`
- ✅ Profile avatar (dropdown menu)

#### NOT Shown for Teachers:
- ❌ Challenges (students only)
- ❌ Rewards (students only)
- ❌ Eco-points counter (teachers don't earn points)

#### Profile Dropdown Menu:
```
┌──────────────────┐
│ Ms. Smith        │
│ smith@school.edu │
├──────────────────┤
│ 👤 Profile       │ ← Click → /profile
├──────────────────┤
│ 🚪 Logout        │ ← Click → Logout + redirect to /
└──────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (≥ 768px)
- Full navigation links visible
- Dropdown menu for profile
- No hamburger menu

### Mobile/Tablet (< 768px)

#### When NOT Logged In:
```
┌──────────────────┐
│ 🌱 EcoLearn      │
│         Login |  │
│      Get Started │
└──────────────────┘
```

#### When Logged In:
```
┌──────────────────┐
│ 🌱 EcoLearn  ☰  │
│ 🌿 1250  👤     │
└──────────────────┘

Click ☰ → Opens Side Drawer:
┌──────────────────┐
│ 🌱 EcoLearn   ✕ │
├──────────────────┤
│ 👤 John Doe      │
│ 🌿 1250 pts      │
│ ⭐ Level 5       │
├──────────────────┤
│ 🏠 Dashboard     │
│ 📚 Courses       │
│ 🎯 Challenges    │
│ 🏆 Leaderboard   │
│ 🎁 Rewards       │
│ 📊 Analytics     │
│ 👤 Profile       │
├──────────────────┤
│ 🚪 Logout        │
└──────────────────┘
```

---

## 🎬 User Actions

### Profile Avatar Click
1. Click avatar → Dropdown menu opens
2. Click "Profile" → Navigate to `/profile`
3. Click "Logout" → Logout + redirect to `/`
4. Click outside → Menu closes

### Login Flow
1. Not logged in → See "Login" button
2. Click "Login" → Navigate to `/login`
3. Enter credentials → Submit
4. Success → Redirect to dashboard
5. Navbar updates → Shows full navigation

### Logout Flow
1. Logged in → See profile avatar
2. Click avatar → Dropdown opens
3. Click "Logout" → Triggers logout
4. User logged out → Redirect to `/`
5. Navbar updates → Shows Login/Get Started

---

## 🔒 Security

### Protected Routes
When user tries to access protected pages:
- Not authenticated → Redirect to `/login`
- Authenticated → Show page normally

### Navbar Consistency
- Navbar always reflects current auth state
- No "flashing" of protected elements
- Clean transitions between states

---

## 🎨 Visual States

### Active Link Highlighting
```css
/* Current page */
background: gradient green → Shows user where they are
text: white

/* Other links */
background: transparent
text: gray
hover: light green background
```

### Hover Effects
- All clickable elements have hover state
- Subtle scale animations
- Color transitions
- Visual feedback on interaction

---

## 🧪 Testing Scenarios

### Test 1: Unauthenticated User
1. Open app (not logged in)
2. ✅ Should see: Login, Get Started
3. ✅ Should NOT see: Dashboard, Courses, Avatar
4. Click Login → Navigate to login page

### Test 2: Student Login
1. Login as student
2. ✅ Should see: Dashboard, Courses, Challenges, Leaderboard, Rewards
3. ✅ Should see: Eco-points, Profile avatar
4. Click Profile → Navigate to profile page
5. Click Logout → Redirect to home

### Test 3: Teacher Login
1. Login as teacher
2. ✅ Should see: Dashboard, Courses, Leaderboard
3. ✅ Should NOT see: Challenges, Rewards, Eco-points
4. ✅ Should see: Profile avatar
5. Profile navigation works

### Test 4: Mobile Experience
1. Open on mobile (< 768px)
2. Not logged in → No hamburger menu
3. Login → Hamburger menu appears
4. Click hamburger → Drawer opens
5. All links functional

---

## 💡 Quick Tips

### For Users
- **Profile Avatar** → Your account menu
- **Eco-points** → Your current score (students only)
- **Mobile Menu** → Tap ☰ to see all options

### For Developers
- Check `isAuthenticated` before rendering protected elements
- Use `user?.role` to customize navigation
- Always provide logout option when authenticated
- Keep mobile and desktop experiences consistent

---

## 📋 Checklist

Use this to verify navbar is working correctly:

**Unauthenticated:**
- [ ] Only Login and Get Started visible
- [ ] No protected navigation links
- [ ] No profile avatar
- [ ] No mobile menu button
- [ ] Login button works
- [ ] Get Started button works

**Authenticated (Student):**
- [ ] All student navigation visible
- [ ] Eco-points counter shows
- [ ] Profile avatar shows
- [ ] Avatar dropdown works
- [ ] Profile navigation works
- [ ] Logout works and redirects
- [ ] Mobile menu functional

**Authenticated (Teacher):**
- [ ] Teacher navigation visible
- [ ] No challenges/rewards
- [ ] No eco-points counter
- [ ] Profile avatar shows
- [ ] Profile navigation works
- [ ] Logout works and redirects
- [ ] Mobile menu functional

---

**Everything working? Great! Your navbar is production-ready! 🎉**

*EcoLearn - Smart, Secure, Student-Friendly*
