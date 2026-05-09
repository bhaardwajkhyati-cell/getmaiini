import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { audit } = await request.json();

    const fallback = `Your AI stack is currently costing $${audit.totalCurrentSpend}/mo across ${audit.results.length} tool(s). ${
      audit.totalSavings > 0
        ? `Our audit identified $${audit.totalSavings}/mo in potential savings — that's $${audit.totalAnnualSavings} back in your budget every year. The biggest opportunity is consolidating overlapping tools that serve similar purposes for your team. Consider reviewing which tools your team actually uses daily before your next billing cycle.`
        : `You're spending efficiently across your current tools — no major overlaps or oversized plans detected. Your AI spend looks right-sized for your team. Keep monitoring as your team grows to ensure plans stay optimized.`
    }`;

    return Response.json({ summary: fallback });

  } catch (error) {
    console.error("Summary error:", error);
    return Response.json({ summary: "Unable to generate summary at this time." });
  }
}