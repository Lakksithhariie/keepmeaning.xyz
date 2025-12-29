"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function ZenEditor() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeVibe = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[80vh] w-full max-w-6xl mx-auto p-4">
      {/* LEFT: The Zen Writer */}
      <div className={`transition-all duration-500 ${result ? "w-full md:w-1/2" : "w-full md:w-2/3 mx-auto"}`}>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full flex flex-col shadow-xl backdrop-blur-sm">
            <textarea
            className="w-full flex-grow bg-transparent text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
            placeholder="Start writing your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-mono">{text.length} chars</span>
            <button
              onClick={analyzeVibe}
              disabled={loading || text.length === 0}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-slate-800 disabled:opacity-50 transition-all font-semibold text-sm"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Check Vibe"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: The Vibe Result (Only appears after analysis) */}
      {result && (
        <div className="w-full md:w-1/2 animate-in fade-in slide-in-from-right duration-500">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl h-full overflow-y-auto">
            
            {/* Vibe Score Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Current Vibe</h3>
                <p className="text-3xl font-black text-slate-900 mt-1">{result.vibe}</p>
              </div>
              <div className="flex flex-col items-end">
                 <div className="text-4xl font-black text-indigo-600">{result.score}/10</div>
              </div>
            </div>

            <p className="text-slate-600 italic border-l-4 border-indigo-500 pl-4 py-1 mb-8">
              "{result.summary}"
            </p>

            {/* Suggestions List */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Suggested Tweaks
              </h4>
              {result.suggestions?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-red-500 line-through text-sm mb-1 opacity-60">{item.original}</div>
                  <div className="text-green-600 font-bold text-lg mb-2">{item.better}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wide mb-1">Why?</div>
                  <div className="text-sm text-slate-700">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}