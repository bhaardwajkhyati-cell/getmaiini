
## What this PR does
Adds a "Re-audit on Pricing Change" system to GetMaiini. When AI tool pricing changes, users who previously ran an audit are automatically notified by email with a one-click link to see a diff of their old vs new audit.

## Why
Stale audits are worse than no audit. A user who ran an audit when Cursor was $20/seat and now sees $25/seat gets wrong savings estimates. This feature keeps audits live and accurate.

## How it works
1. Every audit saves to Supabase with the user's email and a pricing snapshot at time of audit
2. /api/detect-changes scans all stored audits, compares their pricing snapshot against current pricing, and flags audits where any price has changed
3. Affected users receive an email via Resend listing what changed and a direct link to /reaudit?id=AUDIT_ID
4. /reaudit shows a side-by-side diff: previous audit on the left, updated audit on the right, with changed tools highlighted

## What I cut
- Automatic scheduling (Vercel Cron) — detect-changes must be triggered manually via POST /api/detect-changes. The logic is complete but a scheduler would add 2-3 hours of setup risk. Value/effort ratio didn't fit in 36h.
- Email to all users — Resend free tier restricts sending to only the account owner's verified email (bhaardwajkhyati@gmail.com). To send to any user, domain verification at resend.com/domains is required. The email logic, templates, and triggering are fully built — only the sending restriction is a free tier limitation, not a code gap.
- Diff of AI recommendations — currently shows price changes and spend differences. A full recommendation diff would need another pass.

## How to test it manually
1. Run an audit at getmaiini.vercel.app/audit and enter your email on the results page
2. Check Supabase — confirm your row has user_email and pricing_snapshot filled
3. Temporarily change a price in /api/detect-changes (e.g. Cursor Pro from 20 to 25)
4. POST /api/detect-changes
5. Check inbox — email arrives with what changed and a re-run link
6. Click the link — opens /reaudit?id=YOUR_ID showing old vs new audit side by side

## What's tested
- save-audit saves email and pricing snapshot correctly (verified in Supabase)
- detect-changes correctly identifies price differences between snapshot and current pricing
- Email sends successfully via Resend to verified email
- /reaudit page loads audit by ID, detects changes, renders diff view
- Vercel deployment passes build

## Open questions / risks
- detect-changes needs a scheduler in production — currently manual trigger only
- Resend free tier limits sending to verified owner email only — domain verification needed for production use
