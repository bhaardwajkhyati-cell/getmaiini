
## Round 2 Reflection

### 1. What was the most uncomfortable trade-off you made because of the time pressure?
I chose not to implement a proper scheduling system for detect-changes. Instead of a true cron job running automatically, the endpoint needs to be triggered manually via POST /api/detect-changes. I cut this because setting up Vercel Cron or GitHub Actions would have taken 2-3 hours and risked breaking the deployment. The trade-off: the core logic is correct and testable, but it isn't running on a schedule in production. I documented this clearly rather than pretending it works automatically.

### 2. If we extended the deadline by another 24 hours, what's the first thing you'd do?
Set up Vercel Cron to call /api/detect-changes every 24 hours automatically. This is the single biggest gap between what I built and what the spec asked for. The detection and email logic is complete — it just needs a scheduler to trigger it without manual intervention.

### 3. Looking back at your Round 1 codebase as a now-experienced user of it, what's one thing your Round 1 self made harder for your Round 2 self?
The audit results were stored without a consistent tool ID system. Tool names like "Cursor", "cursor", and "GitHub Copilot" appear inconsistently across the codebase, making it hard to reliably match stored audit results against the pricing snapshot. I had to add lowercase normalization in multiple places. Round 1 me should have defined a canonical tool ID enum from the start.
