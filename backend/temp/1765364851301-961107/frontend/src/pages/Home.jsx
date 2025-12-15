import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditorWrapper from '../components/MonacoEditorWrapper';
import MermaidDiagram from '../components/MermaidDiagram';

export default function Home() {
  const [docs, setDocs] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const dummy = [{ path: 'src/App.jsx', code: '<div />' }];
      const res = await axios.post('http://localhost:4000/api/docs/generate', { repoSummary: dummy });
      setDocs(res.data.documentation);
    } catch {
      setDocs('// error generating docs');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex justify-between py-6">
        <h1 className="text-3xl font-bold">AI Auto-Documentation</h1>
        <button className="px-4 py-2 rounded-xl bg-indigo-600" onClick={generate}>
          {loading ? 'Generating...' : 'Generate Docs'}
        </button>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-6 rounded-xl">
          <MonacoEditorWrapper value={docs || '// Documentation will appear here'} />
        </div>
        <div className="bg-white/10 p-6 rounded-xl">
          <MermaidDiagram chart={`graph LR; A-->B;`} />
        </div>
      </section>
    </div>
  );
}