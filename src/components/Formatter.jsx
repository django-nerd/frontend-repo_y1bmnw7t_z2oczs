import React, { useMemo, useState } from "react";
import Header from "./Header";

const lineOptions = [
  { label: "Single", value: 1.0 },
  { label: "1.15", value: 1.15 },
  { label: "1.5", value: 1.5 },
  { label: "Double", value: 2.0 },
];

const fonts = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Georgia",
  "Garamond",
  "Helvetica",
  "Cambria",
];

export default function Formatter({ session, onLogout }) {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [text, setText] = useState(`# Title\n\n## Subtitle\n\nParagraph text goes here. Add more lines.\n\n### Subheading\n\nAnother paragraph.`);
  const [font, setFont] = useState(fonts[0]);
  const [fontGlobal, setFontGlobal] = useState(12);
  const [fontPara, setFontPara] = useState(12);
  const [h1, setH1] = useState(24);
  const [h2, setH2] = useState(18);
  const [h3, setH3] = useState(14);
  const [line, setLine] = useState(1.15);
  const [margins, setMargins] = useState({ top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 });
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => !text.trim(), [text]);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const payload = {
        text,
        font_family: font,
        font_size_global: Number(fontGlobal),
        font_size_paragraph: Number(fontPara),
        h1_size: Number(h1),
        h2_size: Number(h2),
        h3_size: Number(h3),
        line_spacing: Number(line),
        margin_top_mm: Number(margins.top),
        margin_bottom_mm: Number(margins.bottom),
        margin_left_mm: Number(margins.left),
        margin_right_mm: Number(margins.right),
      };

      const res = await fetch(`${backend}/generate-docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to generate file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formatted_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || "Error generating document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header email={session.email} onLogout={onLogout} />
      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        <section className="md:col-span-1 space-y-3">
          <label className="block text-sm">Raw text</label>
          <textarea
            className="w-full h-[420px] p-3 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs text-slate-400">
            Use #, ##, ### for headings. Empty lines create new paragraphs.
          </p>
        </section>

        <section className="md:col-span-1">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4">
            <div>
              <label className="block text-sm mb-1">Font</label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700"
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Global font size</label>
                <input type="number" value={fontGlobal} onChange={(e) => setFontGlobal(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
              </div>
              <div>
                <label className="block text-sm mb-1">Paragraph size</label>
                <input type="number" value={fontPara} onChange={(e) => setFontPara(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">H1 size</label>
                <input type="number" value={h1} onChange={(e) => setH1(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
              </div>
              <div>
                <label className="block text-sm mb-1">H2 size</label>
                <input type="number" value={h2} onChange={(e) => setH2(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
              </div>
              <div>
                <label className="block text-sm mb-1">H3 size</label>
                <input type="number" value={h3} onChange={(e) => setH3(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Line spacing</label>
              <select value={line} onChange={(e) => setLine(e.target.value)} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700">
                {lineOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["top","bottom","left","right"]).map((k) => (
                <div key={k}>
                  <label className="block text-sm mb-1">{k} (mm)</label>
                  <input type="number" value={margins[k]} onChange={(e) => setMargins({ ...margins, [k]: e.target.value })} className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700" />
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              disabled={loading || disabled}
              className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white font-medium"
            >
              {loading ? "Generating..." : "Generate DOCX"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
