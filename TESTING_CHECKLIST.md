# Testing Checklist - Hybrid AI System

## Before You Start
- [ ] Backend running (`npm start` in `/server`)
- [ ] Frontend running (`npm run dev` in `/client`)
- [ ] Browser open to `http://localhost:5173`
- [ ] Chat widget visible (bottom right)
- [ ] Browser console open (F12)

---

## 🧪 Test Cases

### Test 1: COUNT_CERTIFICATES Intent
**Query**: "How many certificates?"

**Expected**:
- Response: "X" (just a number)
- Speed: <50ms
- No AI call

**Check**:
- [ ] Response is just a number
- [ ] Response appears instantly
- [ ] No network request in Network tab
- [ ] Console shows no errors

---

### Test 2: LIST_CERTIFICATES Intent
**Query**: "List certificates"

**Expected**:
- Response: Bulleted list of certificate titles
- Speed: <50ms
- Format: "• Title (Level)"
- No AI call

**Check**:
- [ ] Shows all certificates
- [ ] Format is clean and readable
- [ ] Response instant
- [ ] No network request

---

### Test 3: CHECK_CERTIFICATE Intent
**Query**: "Do I have SQL certificate?"

**Expected**:
- Response: "Yes" or "No"
- Speed: <50ms
- Searches certificate database
- No AI call

**Check**:
- [ ] Response is accurate (check certificates list)
- [ ] Response is instant
- [ ] Single word response
- [ ] No network request

---

### Test 4: CONTACT_INFO Intent
**Query**: "What's your email?"

**Expected**:
- Response: "Email: X@Y.com | GitHub: username"
- Speed: <10ms
- No AI call

**Check**:
- [ ] Shows actual email from database
- [ ] Shows actual GitHub from database
- [ ] Format includes both separated by |
- [ ] Ultra-fast response
- [ ] No network request

---

### Test 5: NAME_INFO Intent
**Query**: "What's your name?"

**Expected**:
- Response: "Rohan V" (exact name from DB)
- Speed: <10ms
- No AI call

**Check**:
- [ ] Shows correct name
- [ ] Just the name, no extra text
- [ ] Ultra-fast response
- [ ] No network request

---

### Test 6: SKILLS_INFO Intent
**Query**: "What skills do you have?"

**Expected**:
- Response: "React, Node.js, MongoDB, ..." (comma-separated)
- Speed: <50ms
- No AI call

**Check**:
- [ ] Shows all skills
- [ ] Comma-separated format
- [ ] No extra explanations
- [ ] Instant response
- [ ] No network request

---

### Test 7: PROJECTS_INFO Intent
**Query**: "List your projects"

**Expected**:
- Response: Bulleted list of project titles
- Speed: <50ms
- No AI call

**Check**:
- [ ] Shows all projects
- [ ] Bulleted format
- [ ] Clean presentation
- [ ] Instant response
- [ ] No network request

---

### Test 8: UNKNOWN Intent (AI Fallback)
**Query**: "Tell me about machine learning"

**Expected**:
- Response: "I don't have that information." (or similar)
- Speed: ~500ms (AI takes time)
- AI is called
- Network request visible

**Check**:
- [ ] Response mentions not having info
- [ ] Takes ~500ms (not instant)
- [ ] Network tab shows API request
- [ ] No error in console
- [ ] Response is concise (not verbose)

---

## 🔍 Console Debugging

### Enable Debug Logging
Add this to `FloatingChatbot.jsx` in `handleSend()` function right after fetching data:

```javascript
console.log("=== MESSAGE DEBUG ===");
console.log("Message:", content);
console.log("Portfolio Data:", portfolioData);
const logicResult = IntentDetectionService.handleLogicFirst(content, portfolioData);
console.log("Detected Intent:", IntentDetectionService.detectIntent(content));
console.log("Logic Result:", logicResult);
console.log("Fallback to AI?", logicResult.fallbackToAI);
```

### What to Look For in Console
```
=== MESSAGE DEBUG ===
Message: How many certificates?
Portfolio Data: {site: {...}, skills: [...], projects: [...], certificates: [...]}
Detected Intent: COUNT_CERTIFICATES
Logic Result: {response: "5", fallbackToAI: false}
Fallback to AI? false
```

---

## ⚡ Performance Testing

### Measure Response Times

**Quick test** - Use browser DevTools Timing:
1. Open chat
2. Open DevTools Console
3. Type: `console.time("query"); /* send message */; console.timeEnd("query");`
4. Check output

**Expected times**:
- COUNT, LIST, CHECK, NAME: **5-20ms**
- CONTACT, SKILLS, PROJECTS: **10-30ms**
- UNKNOWN (AI): **400-600ms**

**Pass if**:
- [ ] Logic intents under 50ms
- [ ] AI fallback under 700ms
- [ ] Consistent responses

---

## 🐛 Troubleshooting

### Issue: Response is slow (>100ms) but should be instant

**Debug**:
- [ ] Check intent detection in console
- [ ] Is intent = "UNKNOWN"? (should be specific intent)
- [ ] Network tab - is there API call? (should be none)
- [ ] Browser performance - check CPU usage

**Fix**:
- [ ] Review intent patterns in `intentDetectionService.js`
- [ ] Check if intent detection regex matching correctly
- [ ] Toggle cache in browser

---

### Issue: Response is wrong or incomplete

**Debug**:
- [ ] Check console for "Logic Result"
- [ ] Verify response text matches handler output
- [ ] Check database - does data exist?
- [ ] Look for any error messages

**Fix**:
- [ ] Verify API endpoints returning data
- [ ] Check certificate/skill/project database
- [ ] Restart both frontend and backend

---

### Issue: AI fallback not working (unknown queries stuck)

**Debug**:
- [ ] Check Network tab - is API request made?
- [ ] Check console for API errors
- [ ] Is backend running?
- [ ] Check response status code

**Fix**:
- [ ] Restart backend server
- [ ] Check OPENAI_API_KEY is set
- [ ] Verify `/api/chat` endpoint working
- [ ] Check system prompt in `aiService.js`

---

### Issue: Certificates not showing (CHECK intent broken)

**Debug**:
- [ ] Check if `setCertificates` runs on mount
- [ ] Network tab - is `/api/certificates` called?
- [ ] Is response 200?
- [ ] Check console for fetch errors

**Fix**:
- [ ] Verify backend has certificates endpoint
- [ ] Check database has certificates
- [ ] Restart frontend (clear React state)
- [ ] Check API response format matches

---

## ✅ Final Validation

### Pre-Deployment Checklist

- [ ] All 8 intents tested and passing
- [ ] Response times meet expectations
- [ ] No console errors
- [ ] No network failures
- [ ] Fallback to AI works
- [ ] Error messages are helpful
- [ ] Data is accurate (matches DB)
- [ ] Formatting is clean
- [ ] Both servers running stable

### Performance Metrics to Record

```
Test Type          | Expected | Actual | Pass?
---------------------------------------------------
COUNT_CERTIFICATES | < 20ms   | ___ms  | [ ]
LIST_CERTIFICATES  | < 50ms   | ___ms  | [ ]
CHECK_CERTIFICATE  | < 30ms   | ___ms  | [ ]
CONTACT_INFO       | < 10ms   | ___ms  | [ ]
NAME_INFO          | < 10ms   | ___ms  | [ ]
SKILLS_INFO        | < 30ms   | ___ms  | [ ]
PROJECTS_INFO      | < 50ms   | ___ms  | [ ]
UNKNOWN (AI)       | <700ms   | ___ms  | [ ]
```

---

## 🎯 Success Criteria

System passes if:
- ✅ All 8 intents detected correctly
- ✅ Logic responses instant (<50ms)
- ✅ AI fallback works ~500ms
- ✅ No hallucinations in responses
- ✅ Data matches portfolio database
- ✅ No console errors
- ✅ Graceful error handling
- ✅ Clean response formatting

---

## 📸 Screenshots to Capture

If any issues, capture:
1. Full chat conversation
2. Browser console (errors)
3. Network tab (API calls)
4. DevTools Performance timeline
5. Database/API response

---

## 🚀 Deployment Readiness

After all tests pass:
- [ ] Code ready for production
- [ ] Performance validated
- [ ] Error handling verified
- [ ] Documentation complete
- [ ] Team trained on system
- [ ] Monitoring set up
- [ ] Rollback plan ready

**System is production-ready when all items checked ✅**

---

## 📞 Quick Reference

### Intent Pattern Matching
- "How many" → COUNT
- "List" → LIST
- "[name] certificate?" → CHECK
- "Email", "Contact" → CONTACT
- "Name", "Who" → NAME
- "Skills", "Tech" → SKILLS
- "Projects", "Built" → PROJECTS
- Everything else → UNKNOWN

### API Endpoints Used
- `GET /api/certificates` - Certificate data
- `GET /api/skills` - Skill data
- `GET /api/projects` - Project data
- `GET /api/site` - Site info (email, name, etc.)
- `POST /api/chat` - AI fallback

### Performance Targets
- Logic handlers: **<50ms target** (10-40ms typical)
- AI fallback: **~500ms** (400-700ms range)
- Combined system: **50x faster** on average

---

**Test Date**: _______
**Tester**: _______
**Status**: READY ✅
