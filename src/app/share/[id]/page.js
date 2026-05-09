"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default function SharePage() {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchAudit() {
      const { data, error } = await supabase
        .from("audit")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setAudit({
        results: data.results,
        totalCurrentSpend: data.total_current_spend,
        totalSavings: data.total_savings,
        totalAnnualSavings: data.total_annual_savings,
        isHighSavings: data.is_high_savings,
      });
    }

    if (id) fetchAudit();
  }, [id]);

  if (notFound) return (
    <main className="min-h-screen bg-[#07071a] flex flex-col items-center justify-center gap-4">
      <p className="text-green-400 text-lg">Audit not found.</p>
      <Link href="/audit">
        <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm">
          Run your own audit ↗
        </button>
      </Link>
    </main>
  );

  if (!audit) return (
    <main className="min-h-screen bg-[#07071a] flex items-center justify-center">
      <p className="text-green-400">Loading audit...</p>
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

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-green-900">
        <Link href="/">
          <span className="text-xl font-medium text-green-400 cursor-pointer">GetMaini</span>
        </Link>
        <Link href="/audit">
          <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            Run your own audit ↗
          </button>
        </Link>
      </nav>

      <section className="relative z-10 max-w-2xl mx-auto px-8 py-16">

        {/* Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 mb-6">
            ✦ Shared AI Spend Audit
          </div>
        </div>

        {/* Hero savings */}
        <div className="text-center mb-12">
          <p className="text-sm text-green-400 uppercase tracking-widest mb-3">Potential savings found</p>
          <div className="text-6xl font-medium text-green-400 mb-2">
            ${audit.totalSavings}<span className="text-2xl">/mo</span>
          </div>
          <div className="text-lg text-green-400">${audit.totalAnnualSavings} saved per year</div>
          <div className="text-sm text-green-600 mt-2">Current spend: ${audit.totalCurrentSpend}/mo</div>
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
                    ? "bg-yellow-900/20 text-yellow-500"
                    : "bg-green-900/30 text-green-400"
                }`}>
                  {tool.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credex branding */}
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

        {/* Run own audit CTA */}
        <div className="text-center">
          <p className="text-sm text-green-600 mb-4">Want to audit your own AI spend?</p>
          <Link href="/audit">
            <button className="bg-green-700 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
              Run my free audit ↗
            </button>
          </Link>
        </div>

      </section>

    </main>
  );
}