"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

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

function ReauditPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [oldAudit, setOldAudit] = useState(null);
  const [changes, setChanges] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchAudit() {
      const { data, error } = await supabase
        .from("audit")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) { setNotFound(true); return; }

      setOldAudit(data);

      const snapshot = data.pricing_snapshot;
      if (!snapshot) return;

      const detected = [];
      for (const toolId of Object.keys(snapshot)) {
        const oldPricing = snapshot[toolId];
        const newPricing = CURRENT_PRICING[toolId];
        if (!newPricing) continue;
        for (const plan of Object.keys(oldPricing)) {
          const oldPrice = oldPricing[plan];
          const newPrice = newPricing[plan];
          if (newPrice !== undefined && oldPrice !== newPrice) {
            detected.push({ tool: toolId, plan, oldPrice, newPrice });
          }
        }
      }
      setChanges(detected);
    }

    if (id) fetchAudit();
  }, [id]);

  if (notFound) return (
    <main className="min-h-screen bg-[#07071a] flex flex-col items-center justify-center gap-4">
      <p className="text-green-400 text-lg">Audit not found.</p>
      <Link href="/audit">
        <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm">Run a new audit ↗</button>
      </Link>
    </main>
  );

  if (!oldAudit) return (
    <main className="min-h-screen bg-[#07071a] flex items-center justify-center">
      <p className="text-green-400">Loading audit...</p>
    </main>
  );

  const savingsDelta = 0;

  return (
    <main className="min-h-screen bg-[#07071a] text-white relative overflow-hidden">

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

      <nav className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-green-900">
        <Link href="/"><span className="text-xl font-medium text-green-400 cursor-pointer">GetMaiini</span></Link>
        <Link href="/audit">
          <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all">Run new audit ↗</button>
        </Link>
      </nav>

      <section className="relative z-10 max-w-3xl mx-auto px-8 py-16">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 mb-6">
            ⚡ Pricing has changed — here's your updated audit
          </div>
          {changes.length === 0 && (
            <p className="text-green-400">No pricing changes detected — your audit is still accurate.</p>
          )}
        </div>

        {changes.length > 0 && (
          <div className="mb-10">
            <p className="text-sm text-green-400 uppercase tracking-widest mb-4">What changed</p>
            <div className="flex flex-col gap-3">
              {changes.map((c, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <span className="text-white font-medium capitalize">{c.tool}</span>
                    <span className="text-green-600 text-sm ml-2">{c.plan}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-red-400 line-through">${c.oldPrice}/seat</span>
                    <span className="text-green-400">→</span>
                    <span className="text-green-300">${c.newPrice}/seat</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="text-sm text-green-400 uppercase tracking-widest mb-4">Audit comparison</p>
          <div className="grid grid-cols-2 gap-4">

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: "1rem", padding: "1.25rem" }}>
              <p className="text-xs text-red-400 uppercase tracking-widest mb-4">Previous audit</p>
              <div className="text-3xl font-medium text-red-400 mb-1">${oldAudit.total_savings}<span className="text-base">/mo</span></div>
              <p className="text-xs text-green-600 mb-4">potential savings</p>
              {oldAudit.results?.map((tool, i) => (
                <div key={i} className="mb-3 pb-3 border-b border-white/5 last:border-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{tool.name}</span>
                    <span className="text-red-400">${tool.currentSpend}/mo</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">{tool.recommendation}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "1rem", padding: "1.25rem" }}>
              <p className="text-xs text-green-400 uppercase tracking-widest mb-4">Updated audit</p>
              <div className="text-3xl font-medium text-green-400 mb-1">${oldAudit.total_savings}<span className="text-base">/mo</span></div>
              <p className="text-xs text-green-600 mb-4">potential savings</p>
              {oldAudit.results?.map((tool, i) => {
                const toolId = tool.name?.toLowerCase();
                const newPrice = CURRENT_PRICING[toolId]?.[tool.plan];
                const priceChanged = newPrice !== undefined && newPrice !== (tool.currentSpend / tool.seats);
                return (
                  <div key={i} className="mb-3 pb-3 border-b border-green-900/30 last:border-0">
                    <div className="flex justify-between text-sm">
                      <span className={`${priceChanged ? 'text-green-300 font-medium' : 'text-white'}`}>{tool.name}</span>
                      <span className="text-green-400">${newPrice !== undefined ? newPrice * tool.seats : tool.currentSpend}/mo</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">{tool.recommendation}</p>
                    {priceChanged && <p className="text-xs text-green-400 mt-1">⚡ Price updated</p>}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        <div className="text-center">
          <Link href="/audit">
            <button className="bg-green-700 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
              Re-run full audit with new pricing ↗
            </button>
          </Link>
        </div>

      </section>
    </main>
  );
}

export default function ReauditPageWrapper() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#07071a] flex items-center justify-center">
        <p className="text-green-400">Loading audit...</p>
      </main>
    }>
      <ReauditPage />
    </Suspense>
  );
}