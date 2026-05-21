import { supabase } from "@/app/lib/supabase";
import { nanoid } from "nanoid";

const CURRENT_PRICING = {
  cursor: { "Hobby (Free)": 0, "Pro ($20/seat)": 20, "Business ($40/seat)": 40, "Enterprise": 40 },
  copilot: { "Individual ($10/seat)": 10, "Business ($19/seat)": 19, "Enterprise ($39/seat)": 39 },
  claude: { "Free": 0, "Pro ($20/seat)": 20, "Max ($100/seat)": 100, "Team ($30/seat)": 30, "Enterprise": 30, "API Direct": 0 },
  chatgpt: { "Free": 0, "Plus ($20/seat)": 20, "Team ($30/seat)": 30, "Enterprise": 30, "API Direct": 0 },
  gemini: { "Free": 0, "Pro ($20/seat)": 20, "Ultra ($30/seat)": 30, "API Direct": 0 },
  anthropic: { "API Direct": 0 },
  openai: { "API Direct": 0 },
  windsurf: { "Free": 0, "Pro ($15/seat)": 15, "Teams ($35/seat)": 35 },
};

export async function POST(request) {
  try {
    const { audit, email } = await request.json();

    const id = nanoid(8);

    const { error } = await supabase.from("audit").insert({
      id,
      results: audit.results,
      total_current_spend: audit.totalCurrentSpend,
      total_savings: audit.totalSavings,
      total_annual_savings: audit.totalAnnualSavings,
      is_high_savings: audit.isHighSavings,
      user_email: email || null,
      pricing_snapshot: CURRENT_PRICING,
    });

    if (error) throw error;

    return Response.json({ id });

  } catch (error) {
    console.error("Save audit error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}