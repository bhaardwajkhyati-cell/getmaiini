"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07071a] text-white relative overflow-hidden">
      
      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-300 opacity-40"
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
      <nav className="relative z-10 flex justify-between items-center px-4 py-3 border-b border-green-900">
        <span className="text-xl font-medium text-green-400">GetMaini</span>
        <Link href = "/audit"><button className="bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs md:text-sm md:px-5 whitespace-nowrap transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
          Audit my spend ↗
        </button></Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-8 py-28 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-green-900/40 border border-green-700/40 rounded-full text-green-300 mb-8">
          ✦ Free AI spend audit — no login needed
        </div>
        <section className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
          Find out where your <br />
          <span className="text-green-400">AI budget is leaking</span>
        </section>
        <p className="text-lg text-green-200/60 leading-relaxed mb-10 max-w-lg mx-auto">
          Most startups overpay on AI tools without realising it. Get a free
          2-minute audit — see exactly what to cut, downgrade, or switch.
        </p>
        <Link href = "/audit"><button className="bg-green-700 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]">
          Audit my AI spend — it's free ↗
        </button></Link>
        <p className="text-xs text-green-900 mt-4">
          No signup required · Results in under 2 minutes
        </p>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 pb-16 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] border border-green-900/50 rounded-xl p-4 text-center">
            <div className="text-xl font-medium text-green-400">$480</div>
            <div className="text-xs text-green-800 mt-1">avg monthly savings</div>
          </div>
          <div className="bg-white/[0.03] border border-green-900/50 rounded-xl p-4 text-center">
            <div className="text-xl font-medium text-green-400">8</div>
            <div className="text-xs text-green-800 mt-1">AI tools audited</div>
          </div>
          <div className="bg-white/[0.03] border border-green-900/50 rounded-xl p-4 text-center">
            <div className="text-xl font-medium text-green-400">2 min</div>
            <div className="text-xs text-green-800 mt-1">to complete audit</div>
          </div>
        </div>
      </section>      

      {/* Tools Section */}
      <section className="relative z-10 px-8 py-20 border-t border-green-900/40 max-w-2xl mx-auto w-full">
        <p className="text-xs text-green-800 uppercase tracking-widest mb-6">Tools we audit</p>
        <div className="flex flex-wrap gap-3">
          {["Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API", "OpenAI API", "Gemini", "Windsurf"].map((tool) => (
            <span key={tool} className="text-sm px-4 py-2 bg-green-900/20 border border-green-800/30 rounded-lg text-green-300">
              ✦ {tool}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-8 py-20 border-t border-green-900/40 max-w-2xl mx-auto w-full">
        <p className="text-xs text-green-800 uppercase tracking-widest mb-8">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Enter your tools", desc: "Tell us which AI tools you pay for, which plan, and how many seats." },
            { step: "02", title: "Get your audit", desc: "We instantly analyse your spend — what to cut, downgrade, or switch." },
            { step: "03", title: "Save money", desc: "Share your report and unlock real savings through Credex if needed." },
          ].map((s) => (
            <div key={s.step} className="bg-white/[0.02] border border-green-900/30 rounded-xl p-5">
              <div className="text-xs text-green-600 font-medium mb-3">Step {s.step}</div>
              <div className="text-sm font-medium text-green-100 mb-2">{s.title}</div>
              <div className="text-xs text-green-800 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-8 py-28 text-center border-t border-green-900/40">
        <h2 className="text-3xl font-medium text-white mb-4">Stop guessing. Start saving.</h2>
        <p className="text-sm text-green-800 mb-8">Free forever. No account needed. Takes 2 minutes.</p>
        <Link href= "audit"><button className="bg-green-700 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]">
          Run my free audit ↗
        </button></Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-5 border-t border-green-900/40 flex justify-between items-center">
        <span className="text-sm font-medium text-green-400">GetMaini</span>
        <span className="text-xs text-green-900">A free tool by Credex · credex.rocks</span>
      </footer>

    </main>
  );
}