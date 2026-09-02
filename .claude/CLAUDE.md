# 🤖 Claude Code - Project Rules & Guidelines

**Project**: E-commerce Platform  
**Created**: 2026-09-02  
**Purpose**: Clear rules to keep Claude Code execution consistent and independent of conversation context

---

## 🎯 Core Rules

### RULE 1: Always Use Workflow System for Task Coordination
**Severity**: CRITICAL  
**When**: After completing any stage/page implementation

When Claude finishes implementing a page or feature:
1. ✅ Update `.claude/workflow.yml` with completion status
2. ✅ Ask user for next decision using **WORKFLOW DECISION FORMAT** (see below)
3. ❌ NEVER ask "what page should we do next?" in conversational format
4. ❌ NEVER proceed to next task without explicit workflow decision

**Why**: Workflow system exists to be independent of conversation context. If ignored, defeats the purpose.

**Example - WRONG:**
```
"Which page do you want to implement next - Cart, Checkout, or Search?"
```

**Example - RIGHT:**
```
✅ cart_page implementation COMPLETE

What's your next decision?

WORKFLOW DECISION

STAGE: [checkout_page | profile_page | orders_pages]
ACTION: START
PRIORITY: [HIGH | NORMAL | LOW]
COMMENT: [optional]

---
```

---

### RULE 2: Workflow Decision Format is Mandatory
**Severity**: CRITICAL  
**When**: Asking user for next action on workflow stages

ANY time transitioning between workflow stages, use this format:

```
WORKFLOW DECISION

STAGE: <stage_name>
ACTION: START | COMPLETE | VERIFY | UNBLOCK
PRIORITY: HIGH | NORMAL | LOW
COMMENT: <optional context>

---
```

Don't improvise. Don't ask casually. Use exact format above.

---

### RULE 3: Keep PROJECT_STATUS.md Updated After Every Major Change
**Severity**: HIGH  
**When**: After completing a page/feature or resolving blockers

After each implementation:
- [ ] Update completion percentage
- [ ] Update page status (✅/⏳/🔵)
- [ ] Add commit info
- [ ] Update progress bar
- [ ] Note any blockers resolved

This is the single source of truth for project state.

---

### RULE 4: All Features Must Have Types (100% TypeScript Strict)
**Severity**: HIGH  
**When**: Writing frontend or backend code

- No `any` types
- All function parameters typed
- All return types explicit
- Strict mode enabled in tsconfig.json
- Build must pass before committing

---

### RULE 5: API Integration Must Match Real Backend Schema
**Severity**: CRITICAL  
**When**: Using types in components

Don't invent types. Check actual backend response:
- Read response types from Prisma schema
- Match CartItem structure exactly (product_id, not product.id)
- Verify API contract before implementing components

If types don't match → fix types, not components.

---

### RULE 6: Commit After Every Feature Completion
**Severity**: HIGH  
**When**: A feature/page is 100% done

Format:
```
feat(frontend|backend): clear description

Detailed bullet points about what was implemented
- Feature 1
- Feature 2

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

Never accumulate uncommitted changes across multiple features.

---

### RULE 7: Always Build Before Claiming "Done"
**Severity**: HIGH  
**When**: Implementing a feature

Required steps:
1. ✅ Implement feature
2. ✅ Fix all TypeScript errors
3. ✅ Run `npm run build` (must pass)
4. ✅ Verify no type errors
5. Then: Create commit

If build fails → NOT DONE.

---

## 🔍 Workflow Reference

### Current Workflow Stages
```
cart_page .................... ✅ COMPLETE
search_page .................. READY (blockers resolved)
collection_page .............. READY (depends on search)
product_detail_upgrade ....... READY
checkout_page ................ READY
profile_page ................. READY
orders_pages ................. READY
```

### Blockers Status
```
✅ RESOLVED:
  - backend_api_categories
  - backend_api_products_filters
  - backend_api_related_products
  - auth_system

❌ NONE ACTIVE
```

### Decision Format (Copy & Paste)
```
WORKFLOW DECISION

STAGE: <page_name>
ACTION: START
PRIORITY: HIGH
COMMENT: 

---
```

---

## 📋 Checklist Before Claiming Feature "COMPLETE"

- [ ] Code written
- [ ] All TypeScript types correct
- [ ] No `any` types
- [ ] API integration matches backend schema
- [ ] `npm run build` passes
- [ ] No console errors
- [ ] Components properly exported
- [ ] Commit made with clear message
- [ ] PROJECT_STATUS.md updated
- [ ] workflow.yml updated
- [ ] Ready for next decision (using format)

---

## 🚨 Failure Modes to Avoid

❌ **Ignore workflow.yml** - Use it for every major decision  
❌ **Ask vague questions** - Use WORKFLOW DECISION format  
❌ **Skip builds** - Always build before "done"  
❌ **Use `any` types** - TypeScript strict always  
❌ **Invent API types** - Match backend schema exactly  
❌ **Accumulate commits** - One feature = one commit  
❌ **Forget to update PROJECT_STATUS.md** - Keep it current  

---

## 📞 When In Doubt

> "What should I do next?"

Answer: **Check workflow.yml → Ask for WORKFLOW DECISION → Follow format above**

Not a question for the user to answer casually - it's a structured request using the established format.

---

**Last Review**: 2026-09-02  
**Next Review**: After next page completion  
**Owner**: Claude Code (AI Agent)
