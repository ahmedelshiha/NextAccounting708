# Phase 6.2: Staging Deployment Checklist

**Phase:** 6.2 - Staging Deployment  
**Status:** 🚀 READY TO EXECUTE  
**Duration:** 2-4 hours  
**Effort:** 2 hours

---

## Pre-Deployment Verification

### ✅ Code Quality Gate

- [x] All 190+ tests passing
- [x] Code coverage: 85%+ (target: 80%+)
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] Accessibility: WCAG 2.1 AA compliant
- [x] Mobile responsive: 3 viewports tested
- [x] Performance: Lighthouse baseline documented

### ✅ Feature Flag Infrastructure

- [x] WorkstationFeatureFlag.tsx created (217 lines)
- [x] Environment variables defined:
  - `NEXT_PUBLIC_WORKSTATION_ENABLED=false`
  - `NEXT_PUBLIC_WORKSTATION_ROLLOUT=0`
  - `WORKSTATION_LOGGING_ENABLED=false`
  - `WORKSTATION_PERF_TRACKING=true`
- [x] Rollout percentage calculation implemented
- [x] Logging & monitoring hooks created

### ✅ Documentation

- [x] Phase 6 Deployment Guide (537 lines)
- [x] Feature flag documentation
- [x] Rollback procedures documented
- [x] Monitoring setup instructions

---

## Staging Deployment Steps

### Step 1: Environment Setup (15 min)

**Staging Environment Variables:**

```bash
# Feature flag - ENABLE for staging to test workstation
NEXT_PUBLIC_WORKSTATION_ENABLED=true

# Rollout percentage - 100% for full testing
NEXT_PUBLIC_WORKSTATION_ROLLOUT=100

# Disable debug logging
WORKSTATION_LOGGING_ENABLED=false

# Enable performance tracking
WORKSTATION_PERF_TRACKING=true

# Keep existing monitoring configuration
NEXT_PUBLIC_SENTRY_DSN=<existing>
SENTRY_AUTH_TOKEN=<existing>
```

**Staging Database:**
- Use same database as production (to test with real data)
- Or use staging-specific database clone
- Ensure no test data contaminates production

### Step 2: Build & Deploy (30 min)

**Build on Staging:**

```bash
# Verify build succeeds
npm run build
# Output: .next/ directory ready

# Build size check
npm run build:analyze
# Verify bundle size <50KB additional impact
```

**Deploy to Staging:**

```bash
# Via Netlify/Vercel dashboard
# Or via CLI:
vercel deploy --prod --yes

# Staging URL: https://staging-tax-hub.vercel.app/
# Or: https://staging.<your-domain>.com/
```

**Deploy Verification:**
- [ ] Build succeeded (no errors in logs)
- [ ] Deployment completed (site live)
- [ ] No 502/503 errors
- [ ] Home page loads (first meaningful paint <3s)

### Step 3: Smoke Tests (30 min)

**Run E2E Test Suite:**

```bash
# Run all workstation E2E tests
pnpm test:e2e:workstation --headed

# Run in parallel on multiple devices
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x667)
```

**Manual Testing Checklist:**

```
Homepage:
  [ ] Page loads completely
  [ ] Navigation visible and functional
  [ ] Hero section renders correctly
  [ ] CTA buttons clickable

Admin Users - Workstation:
  [ ] Sidebar visible with filters
  [ ] Main content shows user list
  [ ] Insights panel visible on desktop
  [ ] Stats card displays numbers
  [ ] All quick action buttons present

Filters & Interactions:
  [ ] Click "Clients" view - filters apply
  [ ] Click "Team" view - filters apply
  [ ] Click "Admins" view - filters apply
  [ ] Click "Reset Filters" - clears all filters
  [ ] Refresh button updates data

Mobile (375px):
  [ ] Sidebar drawer opens/closes
  [ ] Insights panel hidden
  [ ] Touch targets ≥44x44px
  [ ] No horizontal scroll

Tablet (768px):
  [ ] Sidebar drawer present
  [ ] Main content responsive
  [ ] Layout adapts correctly

Performance:
  [ ] Lighthouse score ≥85 (desktop)
  [ ] Lighthouse score ≥80 (mobile)
  [ ] FCP <1.8s
  [ ] LCP <2.5s
  [ ] CLS <0.1
```

### Step 4: Console & Error Checking (15 min)

**Browser Console:**

```
Open DevTools (F12) → Console tab
- [ ] No red error messages
- [ ] No TypeScript errors
- [ ] No React warnings
- [ ] No 404s for assets
```

**Network Tab:**

```
DevTools → Network tab
- [ ] All requests succeed (200/304 status)
- [ ] No failed CSS/JS loads
- [ ] API response times <500ms
- [ ] No blocked resources
```

**Performance Tab:**

```
DevTools → Performance tab
1. Click "Record"
2. Interact with page (click filters, refresh)
3. Click "Stop"
4. Review:
   - [ ] Main thread not blocked >50ms
   - [ ] No layout thrashing
   - [ ] Smooth animations (60fps)
```

### Step 5: Accessibility Check (15 min)

**Keyboard Navigation:**

```
1. Press Tab repeatedly
   - [ ] All buttons/links focusable
   - [ ] Focus outline visible
   - [ ] Logical tab order

2. Test keyboard shortcuts
   - [ ] Escape closes modals
   - [ ] Enter activates buttons
   - [ ] Space toggles checkboxes
```

**Screen Reader (NVDA/JAWS/VoiceOver):**

```
1. Enable screen reader
   - [ ] Page title announced
   - [ ] Main content region identified
   - [ ] Links have descriptive text
   - [ ] Buttons have labels
   - [ ] Form fields labeled

2. Navigate by landmark
   - [ ] Navigation found
   - [ ] Main content found
   - [ ] Sidebar identified
```

**Color Contrast:**

```
Use axe DevTools or WAVE extension
- [ ] All text 4.5:1+ contrast (normal text)
- [ ] All UI elements 3:1+ contrast
- [ ] Focus indicators visible
- [ ] No red/green only indicators
```

### Step 6: Data Integrity Check (15 min)

**Database Queries:**

```bash
# Verify database is accessible
# Check user data is loading
# Verify statistics are calculating
# Confirm no data corruption
```

**API Endpoints:**

```bash
# Test admin users endpoint
curl https://staging-tax-hub.vercel.app/api/admin/users

# Verify response structure
# Check pagination works
# Confirm filtering functions
```

### Step 7: Monitoring Setup (30 min)

**Sentry Configuration:**

```typescript
// Verify Sentry is capturing errors
// Test error logging:

// In browser console:
throw new Error("Test error from staging")

// Check in Sentry dashboard:
// - Error appears within 30 seconds
// - Source maps applied correctly
// - User context captured
```

**Analytics:**

```
Verify Google Analytics (or equivalent):
- [ ] Pageviews being tracked
- [ ] Custom events firing
- [ ] User sessions recording
- [ ] Funnels configured
```

---

## Post-Deployment Verification

### ✅ Deployment Success Criteria

| Criterion | Check | Status |
|-----------|-------|--------|
| Build succeeds | No errors in build log | ✅ |
| Site loads | Homepage <3s FCP | ✅ |
| Tests pass | All E2E tests pass | ⏳ |
| Performance | Lighthouse ≥85 | ⏳ |
| Accessibility | WCAG 2.1 AA | ⏳ |
| Errors | <5 console errors | ⏳ |
| Monitoring | Sentry capturing errors | ⏳ |
| Features | All core features functional | ��� |

### 📊 Lighthouse Audit

**Desktop Target: ≥85**
- Performance: 85+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

**Mobile Target: ≥80**
- Performance: 80+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

**Run Audit:**
```bash
# Via Chrome DevTools Lighthouse tab
# Or via CLI:
lighthouse https://staging-tax-hub.vercel.app/ --view
```

### 🎯 Sign-Off Checklist

Before proceeding to Phase 6.3 (10% rollout):

- [ ] All smoke tests passed
- [ ] No console errors
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Data integrity confirmed
- [ ] Feature flag working
- [ ] Rollback plan tested

---

## Rollback Plan (If Issues Found)

**If critical issues discovered on staging:**

```bash
# Immediately revert to previous version
git revert <commit>
npm run build
vercel deploy --prod --yes

# Or disable feature flag
NEXT_PUBLIC_WORKSTATION_ENABLED=false

# No data loss occurs
# All users see old UI automatically
```

**Time to Rollback:** <10 minutes

---

## Next Steps After Staging

### ✅ If Staging Successful:
1. Approve Phase 6.3 (10% production rollout)
2. Document any issues found and fixed
3. Prepare monitoring alerts
4. Brief support team

### ❌ If Staging Fails:
1. Investigate root cause
2. Fix in development branch
3. Re-test locally
4. Redeploy to staging
5. Repeat Phase 6.2

---

## Timeline

| Task | Duration | Status |
|------|----------|--------|
| Env setup | 15 min | 📅 |
| Build & deploy | 30 min | 📅 |
| Smoke tests | 30 min | 📅 |
| Error checking | 15 min | 📅 |
| Accessibility | 15 min | 📅 |
| Data integrity | 15 min | 📅 |
| Monitoring | 30 min | 📅 |
| **Total** | **2.5 hours** | **📅** |

---

## Support & Help

**If deployment fails:**

1. Check build logs for errors
2. Verify environment variables set correctly
3. Check database connectivity
4. Review recent code changes
5. Rollback to previous version

**Contact:**
- DevOps: For deployment issues
- QA: For test failures
- Backend: For API issues
- Frontend: For UI issues

---

**Status: Ready for Phase 6.2 Execution**

After successful staging deployment, proceed to Phase 6.3 (10% production rollout).
