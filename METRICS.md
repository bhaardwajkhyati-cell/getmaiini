# METRICS.md

## North Star Metric

**Audits completed per week**

Why: An audit completed means a user got value from the tool.
It is the moment Credex gets a potential lead. Everything else
— traffic, shares, email captures — flows from this number.
DAU would be wrong here because users audit once per quarter,
not daily. Audit completions directly measure whether the tool
is doing its job.

## 3 Input Metrics That Drive the North Star

**1. Landing page → audit form conversion rate**
Target: >35%
Why: If people land but don't start the audit, the hero copy or
CTA is failing. This is the first gate.

**2. Audit form → results completion rate**
Target: >80%
Why: If people start but don't finish, the form is too long or
confusing. Currently the form is one page with one button — should
be high.

**3. Share URL click-through rate**
Target: >10% of completed audits get the share link opened
Why: This is the viral loop. Every share is a free acquisition.
If nobody shares, growth depends entirely on paid/organic traffic.

## What I'd Instrument First

1. Mixpanel or PostHog event on audit form submission
2. Event on results page load (confirms redirect worked)
3. Event on email capture submission
4. Event on share link copy button click
5. Event on Credex consultation button click

These 5 events cover the entire funnel from audit → lead → revenue.

## What Number Triggers a Pivot Decision

If audit completion rate drops below 20% for two consecutive weeks,
the form is too complex and needs to be simplified — possibly
reducing to just 3 fields (tool, plan, seats) with team size
inferred from seats.

If share URL click-through stays below 2% for a month, the viral
loop is not working and distribution needs to shift entirely to
paid/organic SEO rather than word of mouth.