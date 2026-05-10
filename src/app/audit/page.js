"use client";
import { useState } from "react";
import Link from "next/link";
import { runAudit } from "./auditEngine";
import { useRouter } from "next/navigation";

const TOOLS = [
  { id: "cursor", name: "Cursor", plans: ["Hobby (Free)", "Pro ($20/seat)", "Business ($40/seat)", "Enterprise"] },
  { id: "copilot", name: "GitHub Copilot", plans: ["Individual ($10/seat)", "Business ($19/seat)", "Enterprise ($39/seat)"] },
  { id: "claude", name: "Claude", plans: ["Free", "Pro ($20/seat)", "Max ($100/seat)", "Team ($30/seat)", "Enterprise", "API Direct"] },
  { id: "chatgpt", name: "ChatGPT", plans: ["Free", "Plus ($20/seat)", "Team ($30/seat)", "Enterprise", "API Direct"] },
  { id: "gemini", name: "Gemini", plans: ["Free", "Pro ($20/seat)", "Ultra ($30/seat)", "API Direct"] },
  { id: "anthropic", name: "Anthropic API", plans: ["API Direct"] },
  { id: "openai", name: "OpenAI API", plans: ["API Direct"] },
  { id: "windsurf", name: "Windsurf", plans: ["Free", "Pro ($15/seat)", "Teams ($35/seat)"] },
];

const selectClass = "appearance-none bg-white/[0.05] border border-green-500/60 hover:border-green-400 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded-lg px-3 text-sm text-white w-full transition-all duration-200 h-[42px] cursor-pointer";

const counterClass  = "flex items-center justify-between bg-white/[0.05] border border-green-500/60 rounded-lg px-3 w-full h-[42px]";

function Counter({ value, onChange }) {
  return (
    <div className={counterClass}>
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="text-green-400 hover:text-green-300 font-bold text-base w-5 text-center transition-colors"
      >−</button>
      <span className="text-white text-sm">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="text-green-400 hover:text-green-300 font-bold text-base w-5 text-center transition-colors"
      >+</button>
    </div>
  );
}

export default function Audit() {
    const router = useRouter();
  const [selectedTools, setSelectedTools] = useState([
    { toolId: "cursor", plan: "Pro ($20/seat)", seats: 1 },
  ]);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState("coding");
   const [auditResult, setAuditResult] = useState(null);

  function addTool() {
    setSelectedTools([...selectedTools, { toolId: "claude", plan: "Pro ($20/seat)", seats: 1 }]);
  }

  function removeTool(index) {
    setSelectedTools(selectedTools.filter((_, i) => i !== index));
  }

  function updateTool(index, field, value) {
    const updated = [...selectedTools];
    updated[index][field] = value;
    if (field === "toolId") {
      updated[index].plan = TOOLS.find(t => t.id === value).plans[0];
    }
    setSelectedTools(updated);
  }

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

      {/* Ambient glow blobs */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-64 h-64 bg-green-400/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-green-900">
        <Link href="/">
          <span className="text-xl font-medium text-green-400 cursor-pointer">GetMaini</span>
        </Link>
      </nav>

      {/* Form */}
      <section className="relative z-10 max-w-2xl mx-auto px-8 py-16">

        {/* Centered heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 mb-6">
            ✦ Free audit — no login needed
          </div>
          <h1 className="text-4xl font-medium text-white mb-3">Audit your AI spend</h1>
          <p className="text-sm text-green-700">Tell us what you pay for and we'll find where you're overspending.</p>
        </div>

        {/* Floating bubble card */}
        <div style={{
          animation: "float 6s ease-in-out infinite",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 0 40px rgba(34,197,94,0.07), 0 0 80px rgba(34,197,94,0.04), inset 0 0 40px rgba(34,197,94,0.02)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>

          {/* Tool rows */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <span className="text-xs text-green-700 uppercase tracking-widest">Tool</span>
              <span className="text-xs text-green-700 uppercase tracking-widest">Plan</span>
              <span className="text-xs text-green-700 uppercase tracking-widest">Seats</span>
            </div>

            {selectedTools.map((entry, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-center">
               <div className = "relative">
                <label className="text-xs text-green-700 uppercase tracking-widest mb-1 block md:hidden">Tool</label>
                <select
                  value={entry.toolId}
                  onChange={(e) => updateTool(index, "toolId", e.target.value)}
                  className={selectClass}
                >
                  {TOOLS.map(t => (
                    <option key={t.id} value={t.id} className="bg-[#07071a]">{t.name}</option>
                  ))}
                </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none text-xs">▼</div>
                </div>

               <div className="relative">
                <label className="text-xs text-green-700 uppercase tracking-widest mb-1 block md:hidden">Plan</label>
                <select
                  value={entry.plan}
                  onChange={(e) => updateTool(index, "plan", e.target.value)}
                  className={selectClass}
                >
                  {TOOLS.find(t => t.id === entry.toolId).plans.map(p => (
                    <option key={p} value={p} className="bg-[#07071a]">{p}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none text-xs">▼</div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <label className="text-xs text-green-700 uppercase tracking-widest mb-1 block md:hidden">Seats</label>
                  <Counter
                    value={entry.seats}
                    onChange={(val) => updateTool(index, "seats", val)}
                  />
                  {selectedTools.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-green-900 hover:text-red-400 text-lg transition-colors flex-shrink-0"
                    >✕</button>
                  )}
                </div>

              </div>
            ))}

            <button
              onClick={addTool}
              className="w-full mt-2 py-2 border border-dashed border-green-700/50 rounded-lg text-sm text-green-700 hover:text-green-400 hover:border-green-500 transition-all duration-200"
            >
              + Add another tool
            </button>
          </div>

          {/* Team info */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-green-900/30 mb-8">
            <div>
              <label className="text-xs text-green-700 uppercase tracking-widest mb-2 block">Team size</label>
              <Counter value={teamSize} onChange={setTeamSize} />
            </div>
            <div>
              <label className="text-xs text-green-700 uppercase tracking-widest mb-2 block">Primary use case</label>
              <div className="relative">
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className={selectClass}
              >
                <option value="coding" className="bg-[#07071a]">Coding</option>
                <option value="writing" className="bg-[#07071a]">Writing</option>
                <option value="research" className="bg-[#07071a]">Research</option>
                <option value="data" className="bg-[#07071a]">Data</option>
                <option value="mixed" className="bg-[#07071a]">Mixed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none text-xs">▼</div>
             </div>
            </div>
          </div>

          {/* Submit */}
          <button onClick = {() => {
            const result = runAudit(selectedTools, teamSize, useCase);
            localStorage.setItem("auditResult", JSON.stringify(result));
            router.push("/results")
          }}
          className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)]">
            Run my audit ↗
          </button>

        </div>
      </section>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

    </main>
  );
}