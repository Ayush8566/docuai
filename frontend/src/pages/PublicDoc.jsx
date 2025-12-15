import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PublicDoc() {
  const { publicId } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/docs/public/${publicId}`)
      .then((r) => r.json())
      .then(setDoc);
  }, []);

  if (!doc) return <div className="p-10">Loading…</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{doc.repoName}</h1>
      <ReactMarkdown>{doc.documentation}</ReactMarkdown>
    </main>
  );
}
