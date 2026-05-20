import { Ga_Maamli } from 'next/font/google';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, auditId, changedTools } = await request.json();

    const toolList = changedTools.map(t => 
      `<li><b>${t.name}</b>: was $${t.oldPrice}/seat → now $${t.newPrice}/seat</li>`
    ).join('');

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bhaardwajkhyati@gmail.com',
      subject: '⚠️ Your AI tool audit is outdated — pricing changed',
      html: `
        <h2>Pricing has changed for tools in your audit</h2>
        <p>The following tools have updated their pricing:</p>
        <ul>${toolList}</ul>
        <p>Your previous recommendation may no longer be accurate.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reaudit?id=${auditId}" 
           style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">
          Re-run my audit →
        </a>
        <p style="margin-top:24px;color:#666;font-size:12px">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?id=${auditId}">Unsubscribe</a>
        </p>
      `
    });

    if (error) throw error;

    return Response.json({ ok: true });

  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}