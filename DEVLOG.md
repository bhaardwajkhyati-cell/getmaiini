## Day 1 - 06-05-2026

**Hours worked: ** 2

**What I did:** Read and analyzed the full assignment brief. 
Understood the product — an AI spend audit tool (GetMaini) 
that helps startups find overspend on AI tools. Researched 
the name, planned the app structure, and set up GitHub repo.

**What I learned:** This is more of a product/entrepreneurial 
challenge than a coding one. The DEVLOG and git history are 
as important as the code itself.


**Plan for tomorrow:** Begin setting up the project and start coding.

## Day 2 — 2026-05-07

**Hours worked:** 6

**What I did:** Built the core pages of GetMaini. Created the galaxy-themed landing page with animated stars, green glow effects and floating card animations. Built the full audit form with tool selection dropdowns, custom +/− seat counters, team size input and use case selector. Created the audit engine logic in auditEngine.js that calculates savings based on plan fit, seat count vs team size, and tool overlap. Built the results page showing per-tool breakdown, savings summary, Credex branding, and email capture. Integrated Resend for transactional emails — users can now get their audit report sent to their inbox. Fixed multiple issues including Tailwind v4 compatibility bug, useState hook placement errors, and input sizing inconsistencies.

**What I learned:** Next.js App Router is very similar to React but server components require "use client" for any interactivity. Tailwind v4 has a known bug with native bindings on Linux — downgrading to v3.4.1 fixed it. useState must always be inside the component function body, never in JSX or outside the component.


**Plan for tomorrow:** **Plan for tomorrow:** Continue building remaining features.
