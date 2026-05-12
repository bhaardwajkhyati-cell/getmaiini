# PROMPTS.md

## AI Summary Prompt

### The prompt I wrote:

### Why I wrote it this way:

I gave it a specific role — "financial advisor specializing in AI
tool costs" — because generic assistant prompts give generic output.
Giving it a specific expert persona made the tone more confident
and specific.

I said "be honest — if they're spending well, say so" because
without this instruction the AI tends to always find something
to criticize even when the spend is optimal. I did not want fake
savings being suggested.

I said "do not use bullet points" because the summary appears
inside a card on the results page. Bullet points would break
the visual layout.

I said "end with one actionable next step" to make sure the
summary was useful and not just descriptive.

### What I tried that did not work:

My first version just said "write a brief summary of this audit."
The output was too generic — things like "your team uses several
AI tools" with no specific numbers or insights.

My second version did not include "do not use bullet points" and
the AI returned a bulleted list which completely broke the UI card.

My third version used the full prompt above and produced good
output when the API was working.

### Why I fell back to a template:

I attempted to use the Gemini API with these models:
- gemini-2.0-flash → 429 Too Many Requests, free tier limit 0
- gemini-1.5-flash-latest → 404 Not Found
- gemini-1.0-pro → 404 Not Found

The Anthropic API requires a minimum $5 credit purchase which
was not available during the assignment week.

The fallback template I built uses the real audit numbers and
covers both scenarios — high savings and optimal spending.
It is less personalized than a real LLM response but it
always works, never fails, and never hallucinates savings numbers.

### What I would use in production:

claude-haiku-20240307 via the Anthropic API at $0.25 per million
input tokens. A full day of 1000 audit summaries at roughly
500 tokens each would cost approximately $0.13. The API route
is already built and the prompt is ready — it just needs a
funded API key to switch from fallback to real AI.

The prompt would stay exactly the same. The infrastructure
change is one line — replacing the fallback return with
an actual API call.