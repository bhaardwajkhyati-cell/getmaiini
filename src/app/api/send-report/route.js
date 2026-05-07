import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, audit } = await request.json();

    const toolRows = audit.results.map(tool => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #1a2a1a;">${tool.name}</td>
        <td style="padding:8px;border-bottom:1px solid #1a2a1a;">${tool.plan}</td>
        <td style="padding:8px;border-bottom:1px solid #1a2a1a;">$${tool.currentSpend}/mo</td>
        <td style="padding:8px;border-bottom:1px solid #1a2a1a;color:${tool.savings > 0 ? '#22c55e' : '#666'};">
          ${tool.savings > 0 ? `Save $${tool.savings}/mo` : "Optimal"}
        </td>
      </tr>
      <tr>
        <td colspan="4" style="padding:8px;font-size:13px;color:#666;border-bottom:1px solid #1a2a1a;">
          ${tool.recommendation}
        </td>
      </tr>
    `).join("");

    await resend.emails.send({
      from: "GetMaini <onboarding@resend.dev>",
      to: email,
      subject: `Your AI Spend Audit — $${audit.totalSavings}/mo potential savings`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#07071a;color:#fff;padding:32px;border-radius:16px;">
          <h1 style="color:#22c55e;font-size:24px;margin-bottom:8px;">GetMaini Audit Report</h1>
          <p style="color:#666;margin-bottom:24px;">Here's your personalized AI spend audit.</p>
          
          <div style="background:#0f1f0f;border:1px solid #22c55e33;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Potential Monthly Savings</p>
            <p style="color:#22c55e;font-size:48px;font-weight:500;margin:8px 0;">$${audit.totalSavings}</p>
            <p style="color:#666;">$${audit.totalAnnualSavings} saved per year</p>
            <p style="color:#444;font-size:13px;">Current spend: $${audit.totalCurrentSpend}/mo</p>
          </div>

          <h2 style="color:#fff;font-size:16px;margin-bottom:16px;">Per-tool breakdown</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="color:#22c55e;font-size:12px;text-transform:uppercase;">
                <th style="padding:8px;text-align:left;">Tool</th>
                <th style="padding:8px;text-align:left;">Plan</th>
                <th style="padding:8px;text-align:left;">Spend</th>
                <th style="padding:8px;text-align:left;">Action</th>
              </tr>
            </thead>
            <tbody>${toolRows}</tbody>
          </table>

          ${audit.totalSavings >= 500 ? `
          <div style="background:#0f1f0f;border:1px solid #22c55e55;border-radius:12px;padding:24px;text-align:center;margin-top:24px;">
            <p style="color:#22c55e;font-size:14px;font-weight:500;">You're leaving $${audit.totalSavings}/mo on the table</p>
            <p style="color:#666;font-size:13px;margin:8px 0 16px;">Credex can get you the same AI tools at up to 40% off retail price.</p>
            <a href="https://credex.rocks" style="background:#22c55e;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">Book a free Credex consultation</a>
          </div>` : ""}

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1a2a1a;text-align:center;">
            <p style="color:#444;font-size:12px;">A free tool by <a href="https://credex.rocks" style="color:#22c55e;">Credex</a> · credex.rocks</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}