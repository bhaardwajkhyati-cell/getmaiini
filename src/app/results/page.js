"use client";
import { useEffect, useState } from "react";
import Link from "next/link";



export default function Results() {
  const [audit, setAudit] = useState(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [shareId, setShareId] = useState("");
  useEffect(() => {
  const stored = localStorage.getItem("auditResult");
  if (stored) {
    const parsed = JSON.parse(stored);
    setAudit(parsed);
    fetchAISummary(parsed);
    saveAudit(parsed);
  }
}, []);

  async function fetchAISummary(auditData) {
  try {
    const res = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audit: auditData }),
    });
    const data = await res.json();
    console.log("AI summary response:", data);
    setAiSummary(data.summary);
  } catch (e) {
    console.error("AI summary error:", e);
  }
}

async function saveAudit(auditData) {
  try {
    const res = await fetch("/api/save-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audit: auditData }),
    });
    const data = await res.json();
    if (data.id) setShareId(data.id);
  } catch (e) {
    console.error("Save audit error:", e);
  }
}



  async function sendReport() {
    if (!email) return;
    setSending(true);
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audit }),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  }

  if (!audit) return (
    <main className="min-h-screen bg-[#07071a] flex items-center justify-center">
      <p className="text-green-400">Loading your audit...</p>
    </main>
    
  );

  return (
    <main className="min-h-screen bg-[#07071a] text-white relative overflow-hidden">

      {/* Stars */}
      <div className="fixed inset-0 z-0">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-green-300 opacity-20"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-green-900">
        <Link href="/">
          <span className="text-xl font-medium text-green-400 cursor-pointer">Getmaiini</span>
        </Link>
        <Link href="/audit">
          <button className="text-sm text-green-400 hover:text-green-300 transition-colors">← Edit audit</button>
        </Link>
      </nav>

      <section className="relative z-10 max-w-2xl mx-auto px-8 py-16">

        {/* Hero savings */}
        <div className="text-center mb-12">
          <p className="text-sm text-green-400 uppercase tracking-widest mb-3">Your potential savings</p>
          <div className="text-6xl font-medium text-green-400 mb-2">
            ${audit.totalSavings}<span className="text-2xl">/mo</span>
          </div>
          <div className="text-lg text-green-400">${audit.totalAnnualSavings} saved per year</div>
          <div className="text-sm text-green-400 mt-2">Current spend: ${audit.totalCurrentSpend}/mo</div>
        </div>

        {/* Credex CTA for high savings */}
        {audit.isHighSavings && (
          <div style={{
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}>
            <p className="text-sm text-green-500 uppercase tracking-widest mb-2">💰 High savings detected</p>
            <h3 className="text-lg font-medium text-white mb-2">You're leaving ${audit.totalSavings}/mo on the table</h3>
            <p className="text-sm text-green-400 mb-4">Credex can get you the same AI tools at up to 40% off retail price.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              <button className="bg-green-700 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                Book a free Credex consultation ↗
              </button>
            </a>
          </div>
        )}

        {/* Per tool breakdown */}
        <div className="mb-8">
          <p className="text-sm text-green-400 uppercase tracking-widest mb-4">Per-tool breakdown</p>
          <div className="flex flex-col gap-4">
            {audit.results.map((tool, index) => (
              <div key={index} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: "1rem",
                padding: "1.25rem",
              }}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-base font-medium text-white">{tool.name}</span>
                    <span className="text-sm text-green-500 ml-2">{tool.plan} · {tool.seats} seat(s)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">${tool.currentSpend}/mo</div>
                    {tool.savings > 0 && (
                      <div className="text-sm text-green-400">Save ${tool.savings}/mo</div>
                    )}
                  </div>
                </div>
                <div className={`text-sm mt-2 px-3 py-2 rounded-lg ${
                  tool.status === "optimal"
                    ? "bg-green-900/20 text-green-400"
                    : tool.status === "warning"
                    ? "bg-green-900/20 text-green-500"
                    : "bg-green-900/30 text-green-400"
                }`}>
                  {tool.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Credex branding — always shown */}
        <div style={{
          background: "rgba(34,197,94,0.03)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}>
          <p className="text-sm text-green-500 mb-1">Powered by Credex</p>
          <p className="text-sm text-green-400 mb-3">Credex sells discounted AI credits — Cursor, Claude, ChatGPT and more — at up to 40% off retail.</p>
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-400 underline hover:text-green-300 transition-colors">
            Learn more at credex.rocks ↗
          </a>
        </div>

        {/* AI Summary */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}>
          <p className="text-sm text-green-400 uppercase tracking-widest mb-3">✦ AI Summary</p>
          {aiSummary ? (
            <p className="text-base text-green-300 leading-relaxed">{aiSummary}</p>
          ) : (
            <p className="text-base text-green-700">Generating your personalized summary...</p>
          )}
        </div>         

        {/* Email capture */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}>
          <h3 className="text-base font-medium text-white mb-1">Get this report in your inbox</h3>
          <p className="text-sm text-green-400 mb-4">We'll email you the full audit and notify you when new savings apply to your stack.</p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 bg-white/[0.05] border border-green-500/60 rounded-lg px-3 py-2 text-base text-white placeholder-green-900 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={sendReport}
              disabled={sending || sent}
              className=" w-full bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-base transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] disabled:opacity-50"
            >
              {sent ? "Sent ✓" : sending ? "Sending..." : "Send report"}
            </button>
          </div>
        </div>

        
         {/* Share URL */}
        <div className="bg-white/[0.02] border border-green-900/40 rounded-lg px-4 py-3">
          <p className="text-xs text-green-700 uppercase tracking-widest mb-2">Share your audit</p>
          <p className="text-sm text-green-500 font-mono mb-3" style={{wordBreak: "break-all"}}>
            {         shareId ? `getmaiini.vercel.app/share/${shareId}` : "Generating link..."}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(`https://getmaiini.vercel.app/share/${shareId}`)}
            disabled={!shareId}
            className="w-full text-sm text-green-500 border border-green-800 px-3 py-2 rounded hover:border-green-500 transition-colors disabled:opacity-50"
          >
            Copy link
          </button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

    </main>
  );
}