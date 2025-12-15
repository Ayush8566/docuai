import React, { useState } from "react";
import api from "../api/api";
import MonacoEditorWrapper from "../components/MonacoEditorWrapper";
import MermaidDiagram from "../components/MermaidDiagram";

export default function Home() {
  const [docs, setDocs] = useState("// Click Generate to create docs...");
  const [loading, setLoading] = useState(false);

  async function generateDocs() {
    setLoading(true);
    try {
      const dummy = [
        {
          path: "src/App.jsx",
          code: "export default function App() { return <div/> }",
        },
      ];

      const res = await api.post("/api/docs/generate", {
        repoSummary: dummy,
      });

      setDocs(res.data.documentation);
    } catch (error) {
      setDocs("// Error generating documentation");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold">AI Auto Documentation</h1>
        <button
          onClick={generateDocs}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          {loading ? "Generating..." : "Generate Docs"}
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white/10 rounded-xl p-4">
          <h2 className="text-xl mb-2">Generated Documentation</h2>
          <MonacoEditorWrapper value={docs} />
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h2 className="text-xl mb-2">Architecture Diagram</h2>
          <MermaidDiagram
            chart={`graph LR; A[Frontend]-->B[Backend]; B-->C[OpenAI];`}
          />
        </div>
      </section>
    </div>
  );
}
