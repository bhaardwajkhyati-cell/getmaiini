# TESTS.md

## Test Suite — Audit Engine

All tests cover `src/app/audit/auditEngine.js`

### How to run:
```bash
npm test
```

### Test file location:
`src/app/audit/auditEngine.test.js`

---

## Test 1 — Team plan with 1 seat flagged as overkill
**File:** `src/app/audit/auditEngine.test.js`
**What it covers:** When a user is on a Team plan with only 1 seat,
the engine should flag it as overkill and recommend downgrading to Pro.
**Expected:** savings > 0, status === "savings"

## Test 2 — Seats exceeding team size flagged
**File:** `src/app/audit/auditEngine.test.js`
**What it covers:** When a user has more seats than their team size,
the engine should recommend reducing seats to match team size.
**Expected:** savings > 0, recommendation mentions reducing seats

## Test 3 — Coding tool overlap detected
**File:** `src/app/audit/auditEngine.test.js`
**What it covers:** When a user pays for multiple coding tools
(e.g. Cursor + Copilot + Windsurf) with coding as primary use case,
the engine should flag overlap.
**Expected:** status === "warning" for coding tools

## Test 4 — Optimal spend returns no savings
**File:** `src/app/audit/auditEngine.test.js`
**What it covers:** When a user is on a right-sized plan with correct
seat count matching team size, the engine should return status === "optimal"
and savings === 0.
**Expected:** status === "optimal", savings === 0

## Test 5 — Total savings calculated correctly
**File:** `src/app/audit/auditEngine.test.js`
**What it covers:** The total savings returned by runAudit should equal
the sum of individual tool savings.
**Expected:** totalSavings === sum of all result.savings

---

## Running the tests

```bash
npm test
```

Expected output:
```
PASS src/app/audit/auditEngine.test.js
  Audit Engine
    ✓ flags team plan with 1 seat as overkill
    ✓ flags seats exceeding team size
    ✓ detects coding tool overlap
    ✓ returns optimal for right-sized spend
    ✓ calculates total savings correctly
```