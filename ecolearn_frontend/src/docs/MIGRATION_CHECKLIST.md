# ✅ Migration Checklist - EcoLearn Restructuring

Use this checklist to track your progress during the restructuring process.

## 📋 Pre-Migration

- [ ] Read `/RESTRUCTURING_SUMMARY.md`
- [ ] Read `/RESTRUCTURING_COMPLETE.md`
- [ ] Backup existing project manually (optional - script does this)
- [ ] Commit all current changes to git

## 🚀 Migration Steps

### Option A: Automated (Recommended)

- [ ] Make script executable: `chmod +x restructure.sh`
- [ ] Run restructuring script: `./restructure.sh`
- [ ] Review script output for any errors
- [ ] Verify backup was created in `backups/` folder

### Option B: Manual

- [ ] Create `/src` directory structure
- [ ] Move all UI components to `/src/components/ui/`
- [ ] Move common components to `/src/components/common/`
- [ ] Move figma components to `/src/components/figma/`
- [ ] Move all pages to `/src/pages/`
- [ ] Move context to `/src/context/`
- [ ] Move services to `/src/services/`
- [ ] Move styles to `/src/styles/`
- [ ] Move documentation to `/docs/`
- [ ] Remove Dockerfile/ folder with .tsx files
- [ ] Clean up old empty directories

## 🔧 Post-Migration Updates

### Update Import Paths in Pages
Go through each file in `/src/pages/` and update imports:

- [ ] Landing.tsx
  ```typescript
  // Update imports
  import { Navbar } from '../components/common/Navbar';
  import { Button } from '../components/ui/button';
  import { ImageWithFallback } from '../components/figma/ImageWithFallback';
  ```

- [ ] Login.tsx
- [ ] Register.tsx
- [ ] StudentDashboard.tsx
- [ ] TeacherDashboard.tsx
- [ ] Courses.tsx
- [ ] Challenges.tsx
- [ ] Leaderboard.tsx
- [ ] Rewards.tsx
- [ ] Analytics.tsx
- [ ] Profile.tsx

### Update Import Paths in Context

- [ ] AuthContext.tsx
  ```typescript
  // Add type imports
  import { User, LoginCredentials, RegisterData, AuthContextType } from '../types';
  ```

### Update Import Paths in Services

- [ ] api.ts
  ```typescript
  // Add type imports if needed
  import { User, Course, Challenge } from '../types';
  ```

### Verify UI Components (No changes needed)
- [ ] All `/src/components/ui/` files should work as-is
- [ ] No import path updates needed for these

## 🧪 Testing Phase

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Test all pages load correctly:
  - [ ] Landing page (`/`)
  - [ ] Login page (`/login`)
  - [ ] Register page (`/register`)
  - [ ] Student Dashboard (`/dashboard`)
  - [ ] Teacher Dashboard (`/teacher-dashboard`)
  - [ ] Courses page (`/courses`)
  - [ ] Challenges page (`/challenges`)
  - [ ] Leaderboard (`/leaderboard`)
  - [ ] Rewards (`/rewards`)
  - [ ] Analytics (`/analytics`)
  - [ ] Profile (`/profile`)

- [ ] Test authentication flow
  - [ ] Login as student
  - [ ] Login as teacher
  - [ ] Logout
  - [ ] Protected routes redirect correctly

- [ ] Test navigation
  - [ ] Desktop navigation works
  - [ ] Mobile navigation drawer works
  - [ ] All links navigate correctly

- [ ] Test responsive design
  - [ ] Mobile (< 640px)
  - [ ] Tablet (640px - 1024px)
  - [ ] Desktop (> 1024px)

- [ ] Check browser console
  - [ ] No error messages
  - [ ] No warning messages
  - [ ] No import errors

- [ ] Test components
  - [ ] Loader animation works
  - [ ] Empty states display correctly
  - [ ] Error states display correctly
  - [ ] All UI components function properly

## 🏗️ Build & Production

- [ ] Run production build: `npm run build`
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Preview production build: `npm run preview`
- [ ] Production build works correctly

### Docker Testing (Optional)

- [ ] Build Docker image: `docker build -t ecolearn .`
- [ ] Run Docker container: `docker run -p 3000:80 ecolearn`
- [ ] Test in browser: `http://localhost:3000`
- [ ] Docker Compose: `docker-compose up -d`
- [ ] Verify all services running

## 📝 Final Steps

- [ ] Update package.json scripts if needed
- [ ] Update tsconfig.json with path aliases (optional)
- [ ] Update vite.config.ts with path aliases (optional)
- [ ] Review and update .gitignore
- [ ] Remove old backup folders (keep one recent backup)
- [ ] Commit restructured code to git
- [ ] Update team documentation
- [ ] Notify team members of new structure

## 🎉 Completion Verification

### Code Quality
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All imports resolve correctly
- [ ] Build size is reasonable
- [ ] Hot reload works in development

### Functionality
- [ ] All features work as before
- [ ] Authentication works
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls work (or ready for backend)

### Structure
- [ ] All files in correct locations
- [ ] No orphaned files
- [ ] Documentation organized
- [ ] Configuration files at root
- [ ] No misplaced folders

## 📊 Success Metrics

After completion, you should have:

✅ Clean, organized folder structure  
✅ Centralized type definitions  
✅ Proper separation of concerns  
✅ Easy-to-navigate codebase  
✅ Production-ready architecture  
✅ Scalable foundation  
✅ Better developer experience  
✅ Team-friendly structure  

---

## 🆘 Troubleshooting

### Common Issues

**"Cannot find module" errors**
- ✅ Check import paths match new structure
- ✅ Verify file was moved to correct location
- ✅ Check for typos in import paths

**TypeScript errors**
- ✅ Ensure types are imported from `/src/types`
- ✅ Check tsconfig.json includes `/src`
- ✅ Run `npm install` again

**Pages not rendering**
- ✅ Check `/src/App.tsx` routes
- ✅ Verify page imports in App.tsx
- ✅ Check browser console for errors

**Build fails**
- ✅ Clear node_modules and reinstall
- ✅ Check for missing dependencies
- ✅ Verify all imports are correct

---

## 📞 Need Help?

1. Check `/RESTRUCTURING_COMPLETE.md` for detailed guidance
2. Review error messages carefully
3. Verify file locations match new structure
4. Test in small increments
5. Keep a backup until fully verified

---

**Time Estimate:** 15-30 minutes (automated) | 1-2 hours (manual)

**Difficulty:** Easy (with script) | Medium (manual)

**Impact:** High - Sets foundation for future development

---

*Happy Restructuring! 🌱*
