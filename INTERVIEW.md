# USER_INTERVIEWS.md

## Interview 1

**Name:** Hriday Mahajan
**Role:** Student, runs side projects
**Company stage:** Pre-revenue side project

**How the interview happened:**
Shared the app link on WhatsApp and asked for honest feedback.
They used the app and shared screenshots of their experience.

**Direct quotes:**
- "Smoothness of web like loading screen to user actions was quite good"
- "Overall expenditure telling is also good"
- "Jb more than one free tools select hore h AI k to sbka data yellow m same dera h ye jo explain ni hora properly"

**The most surprising thing they said:**
They suggested showing alternative AI tools based on use case —
"agar alternative of AI according to their use case hoga toh
personalized experience hoga and jyada value add hogi." I had not
thought about recommending specific alternatives by use case — the
current engine only flags overlap, it does not suggest what to switch to.

**What it changed about my design:**
Identified a real bug — when multiple free tools are selected, all
show the same yellow warning with ~$0 savings which is confusing and
unhelpful. Need to suppress overlap warnings when spend is $0.
Also noted that showing specific alternative recommendations by use
case would make the audit much more valuable.

---

## Interview 2

**Name:** Krishna Gupta
**Role:** Student, uses AI tools for assignments and projects
**Company stage:** Individual user

**How the interview happened:**
Shared the app and asked for feedback in person at college.

**Direct quotes:**
- "It looks really clean and the galaxy theme is cool"
- "I didn't know I could be overpaying on AI tools"
- "The share link feature is nice — I would share this with my friends"

**The most surprising thing they said:**
They were surprised the tool existed at all — "I just pay whatever
ChatGPT charges and never think about it." This confirmed the core
insight that most people don't audit their AI spend because they
don't know they should.

**What it changed about my design:**
Made me realize the landing page should more explicitly say WHO
this is for. Adding "perfect for students and small teams" would
help individual users feel included.

---

## Interview 3

**Name:** Safal Sharma
**Role:** Student, freelance developer
**Company stage:** Individual freelancer

**How the interview happened:**
Brief conversation at college. Showed them the app and asked questions.

**Direct quotes:**
- "This seems more useful for companies than for individual developers"
- "I only pay $20 for ChatGPT Plus — there's not much to audit there"
- "If I had a team I would definitely use this"

**The most surprising thing they said:**
They pointed out that the tool is primarily beneficial for companies
and teams, not individual users. A solo developer paying $20/mo for
one tool has almost nothing to audit. This is an important insight —
the target user really is a CTO or engineering manager with multiple
tools and multiple seats, not a solo developer.

**What it changed about my design:**
This validated the GTM strategy of targeting CTOs and engineering
managers specifically. It also made me consider adding a message for
individual users who complete an audit with no savings — something like
"You're spending efficiently! This tool is most powerful for teams
with 3+ AI tools."