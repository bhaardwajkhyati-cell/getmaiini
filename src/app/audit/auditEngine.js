const PRICING = {
  cursor: {
    "Hobby (Free)": 0,
    "Pro ($20/seat)": 20,
    "Business ($40/seat)": 40,
    "Enterprise": 40,
  },
  copilot: {
    "Individual ($10/seat)": 10,
    "Business ($19/seat)": 19,
    "Enterprise ($39/seat)": 39,
  },
  claude: {
    "Free": 0,
    "Pro ($20/seat)": 20,
    "Max ($100/seat)": 100,
    "Team ($30/seat)": 30,
    "Enterprise": 30,
    "API Direct": 0,
  },
  chatgpt: {
    "Free": 0,
    "Plus ($20/seat)": 20,
    "Team ($30/seat)": 30,
    "Enterprise": 30,
    "API Direct": 0,
  },
  gemini: {
    "Free": 0,
    "Pro ($20/seat)": 20,
    "Ultra ($30/seat)": 30,
    "API Direct": 0,
  },
  anthropic: { "API Direct": 0 },
  openai: { "API Direct": 0 },
  windsurf: {
    "Free": 0,
    "Pro ($15/seat)": 15,
    "Teams ($35/seat)": 35,
  },
};

const TOOL_NAMES = {
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  anthropic: "Anthropic API",
  openai: "OpenAI API",
  windsurf: "Windsurf",
};

const CODING_TOOLS = ["cursor", "copilot", "windsurf"];
const AI_CHAT_TOOLS = ["claude", "chatgpt", "gemini"];

export function runAudit(selectedTools, teamSize, useCase) {
  const results = [];
  let totalCurrentSpend = 0;
  let totalSavings = 0;

  // detect overlaps
  const codingToolsUsed = selectedTools.filter(t => CODING_TOOLS.includes(t.toolId));
  const chatToolsUsed = selectedTools.filter(t => AI_CHAT_TOOLS.includes(t.toolId));

  selectedTools.forEach((entry) => {
    const pricePerSeat = PRICING[entry.toolId]?.[entry.plan] ?? 0;
    const currentSpend = pricePerSeat * entry.seats;
    totalCurrentSpend += currentSpend;

    let recommendation = "";
    let savings = 0;
    let status = "optimal"; // optimal | warning | savings

    const name = TOOL_NAMES[entry.toolId];

    // Rule 1: Paying for team plan with very few seats
    if (entry.plan.includes("Team") && entry.seats <= 2) {
      const individualPrice = PRICING[entry.toolId]?.["Pro ($20/seat)"] ?? 20;
      const newSpend = individualPrice * entry.seats;
      savings = currentSpend - newSpend;
      recommendation = `Team plan for ${entry.seats} seat(s) is overkill. Downgrade to Pro and save $${savings}/mo.`;
      status = "savings";
    }

    // Rule 2: Paying for more seats than team size
    else if (entry.seats > teamSize) {
      const newSpend = pricePerSeat * teamSize;
      savings = currentSpend - newSpend;
      recommendation = `You have ${entry.seats} seats but only ${teamSize} team members. Reduce to ${teamSize} seats and save $${savings}/mo.`;
      status = "savings";
    }

    // Rule 3: Coding tool overlap
    else if (CODING_TOOLS.includes(entry.toolId) && codingToolsUsed.length > 1 && useCase === "coding") {
      savings = Math.round(currentSpend * 0.5);
      recommendation = `You're paying for ${codingToolsUsed.length} coding tools. Consider keeping only one. Could save ~$${savings}/mo.`;
      status = "warning";
    }

    // Rule 4: AI chat overlap
    else if (AI_CHAT_TOOLS.includes(entry.toolId) && chatToolsUsed.length > 1) {
      savings = Math.round(currentSpend * 0.4);
      recommendation = `You're paying for ${chatToolsUsed.length} AI chat tools with overlapping capabilities. Consider consolidating. Could save ~$${savings}/mo.`;
      status = "warning";
    }

    // Rule 5: Already optimal
    else {
      recommendation = `Your ${name} plan looks right-sized for your team. You're spending well here.`;
      status = "optimal";
    }

    totalSavings += savings;

    results.push({
      toolId: entry.toolId,
      name,
      plan: entry.plan,
      seats: entry.seats,
      currentSpend,
      savings,
      recommendation,
      status,
    });
  });

  return {
    results,
    totalCurrentSpend,
    totalSavings,
    totalAnnualSavings: totalSavings * 12,
    isHighSavings: totalSavings >= 500,
  };
}