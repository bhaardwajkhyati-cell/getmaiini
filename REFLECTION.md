# REFLECTION.md

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was the Tailwind CSS v4 native binding error on Linux.
After setting up Next.js with the default create-next-app command, Tailwind
v4 was installed automatically. When I ran npm run dev I got this error:
"Cannot find native binding. Cannot find module @tailwindcss/oxide-linux-x64-gnu"

My hypotheses were:

First I thought node_modules were corrupted so I tried
rm -rf node_modules && npm install. That did not fix it.

Then I thought the postcss config was wrong so I checked
postcss.config.mjs but it looked fine.

Then I searched the exact error message online and found a GitHub issue
confirming Tailwind v4 has a known bug with optional dependencies on
Linux environments like GitHub Codespaces.

What finally worked was downgrading to Tailwind v3.4.1 by running
npm install tailwindcss@3.4.1, updating globals.css to use
@tailwind base, @tailwind components, @tailwind utilities directives,
and creating a proper tailwind.config.js with the correct content paths.

This took about 2 hours to debug and fix. The lesson was to always check
if a package has known bugs before assuming the problem is in my code.

## 2. A decision I reversed mid-week

I initially planned to use plain React with Vite because I was already
comfortable with it from previous projects. I started setting it up on
Day 1 but quickly ran into problems.

I realized shareable URLs with dynamic routing would need React Router
set up manually. Open Graph tags for link previews would be very hard
without server side rendering. And I would need a separate Express server
just for the API routes to save emails and audits.

I reversed this decision on Day 1 and switched to Next.js. It cost about
30 minutes to redo the setup but saved me many hours later. The dynamic
route for /share/[id] was literally just creating a folder with square
brackets — something that would have taken much longer with React Router.

The lesson was that being comfortable with a tool is not always the best
reason to use it. Sometimes spending 30 minutes learning something new
saves you hours later.

## 3. What I would build in week 2

In week 2 I would focus on these things:

Better audit intelligence — right now the audit engine uses hardcoded
rules based on plan names and seat counts. In week 2 I would add a
question asking how many hours per day each person uses the tool. This
would make recommendations much more accurate. Someone using Cursor 8
hours a day is getting much more value than someone using it 30 minutes
a day.

Real AI summary — the infrastructure for calling an AI API is already
built. With a funded Anthropic API key I would replace the templated
fallback with real claude-haiku summaries. The prompt is already written
and tested, it just needs credits to run.

User accounts — right now audits are anonymous. In week 2 I would add
optional accounts so users can save their audit history and track
savings over time. This would also give Credex better lead data.

Mobile improvements — the form works on mobile but the counter buttons
are small and hard to tap. Week 2 would include a proper mobile redesign
of the audit form.

## 4. How I used AI tools

I used Claude on claude.ai as my main coding assistant throughout the week.

What I used it for:
I used Claude to write boilerplate code for Next.js pages and API routes.
When I got error messages I did not understand I pasted them into Claude
and asked for explanations. Claude helped me write these markdown files
by giving me structure and suggestions. It also suggested the galaxy theme
color palette and the floating card animation.

What I did not trust it with:
I did not trust Claude with the audit engine logic. The pricing rules and
savings calculations I wrote myself after checking each vendor's actual
pricing page. If I had let Claude write the pricing data it would likely
be outdated or wrong since AI training data has a cutoff date.

I also did not trust Claude with final design decisions. It suggested
patterns but I made all visual choices myself.

One specific time AI was wrong:
Claude told me to use gemini-1.5-flash as the model name for the Gemini
API. This returned a 404 not found error. I then tried gemini-2.0-flash
which existed but hit free tier quota limits immediately. I had to debug
this myself by reading the Google AI Studio documentation and trying
multiple model names. Claude's knowledge of the exact current Gemini
model names was outdated.

## 5. Self rating

| Dimension | Rating | Reason |
|-----------|--------|--------|

|Discipline  | 7/10 | I committed code every day and kept the DEVLOG honest. I could have started the user interviews earlier in the week instead of leaving them late. |

|Code quality| 6/10 | The code works and is readable. But I did not use TypeScript which would have caught several bugs earlier. Some code is repeated across pages that should be extracted into shared components. |

|Design sense| 9/10 | The galaxy theme makes the product memorable and different from typical SaaS tools. The floating card on the audit form is a nice touch. The results page is clean and easy to scan.|

|Problem solving | 7/10 | I debugged the Tailwind v4 issue by forming hypotheses and testing them. I found workarounds for the Gemini API limits. I kept moving forward when blocked instead of getting stuck. |

| Entrepreneurial thinking | 5/10 | I struggled with business terminology like CAC, LTV and ARR — these are new concepts for me. I also did not do user interviews early enough in the week which is a gap. |