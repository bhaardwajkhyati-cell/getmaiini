import { supabase } from "@/app/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data: audits, error } = await supabase
      .from("audit")
      .select("*")
      .not("user_email", "is", null);

    if (error) throw error;

    const affected = [];

    for (const audit of audits) {
      const snapshot = audit.pricing_snapshot;
      if (!snapshot) continue;

      const changes = [];

      for (const toolId of Object.keys(snapshot)) {
        const oldPricing = snapshot[toolId];
        const newPricing = CURRENT_PRICING[toolId];
        if (!newPricing) continue;

        for (const plan of Object.keys(oldPricing)) {
          const oldPrice = oldPricing[plan];
          const newPrice = newPricing[plan];
          if (newPrice !== undefined && oldPrice !== newPrice) {
            changes.push({
              tool: toolId,
              plan,
              oldPrice,
              newPrice,
            });
          }
        }
      }

      if (changes.length > 0) {
        affected.push({ audit, changes });
      }
    }

    // Send emails to affected users
    for (const { audit, changes } of affected) {
      const changeList = changes.map(c =>
        `${c.tool} ${c.plan}: $${c.oldPrice} → $${c.newPrice}/seat`
      ).join("\n");

      await resend.emails.send({
        from: "GetMaini <onboarding@resend.dev>",
        to: audit.user_email,
        subject: "Your AI spend audit is out of date — pricing has changed",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#07071a;color:#fff;padding:32px;border-radius:16px;">
            <h1 style="color:#22c55e;font-size:22px;">Pricing has changed on your AI stack</h1>
            <p style="color:#aaa;">Your GetMaini audit was created with old pricing. Here's what changed:</p>
            
            <div style="background:#0f1f0f;border:1px solid #22c55e33;border-radius:12px;padding:16px;margin:20px 0;">
              ${changes.map(c => `
                <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #1a2a1a;">
                  <strong style="color:#22c55e;">${c.tool} — ${c.plan}</strong><br/>
                  <span style="color:#aaa;">Was $${c.oldPrice}/seat → Now $${c.newPrice}/seat</span>
                </div>
              `).join("")}
            </div>

            <p style="color:#aaa;">Your previous savings estimate may no longer be accurate.</p>
            
            <a href="https://getmaiini.vercel.app/audit" 
               style="display:inline-block;background:#22c55e;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-top:16px;">
              Re-run my audit with new pricing ↗
            </a>

            <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1a2a1a;">
              <p style="color:#444;font-size:12px;">A free tool by <a href="https://credex.rocks" style="color:#22c55e;">Credex</a></p>
            </div>
          </div>
        `,
      });
    }

    return Response.json({
      checked: audits.length,
      affected: affected.length,
      changes: affected.map(a => ({
        auditId: a.audit.id,
        email: a.audit.user_email,
        changes: a.changes,
      })),
    });

  } catch (error) {
    console.error("Detect changes error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}