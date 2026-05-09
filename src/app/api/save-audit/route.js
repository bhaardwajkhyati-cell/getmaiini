import { supabase } from "@/app/lib/supabase";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const { audit } = await request.json();

    const id = nanoid(8);

    const { error } = await supabase.from("audit").insert({
      id,
      results: audit.results,
      total_current_spend: audit.totalCurrentSpend,
      total_savings: audit.totalSavings,
      total_annual_savings: audit.totalAnnualSavings,
      is_high_savings: audit.isHighSavings,
    });

    if (error) throw error;

    return Response.json({ id });

  } catch (error) {
    console.error("Save audit error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}