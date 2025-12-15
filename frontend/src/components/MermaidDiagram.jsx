import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart }) {
  const ref = useRef();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });

    try {
      mermaid.render("diagram", chart, (svg) => {
        ref.current.innerHTML = svg;
      });
    } catch (err) {
      ref.current.innerHTML = `<pre>${err.message}</pre>`;
    }
  }, [chart]);

  return <div ref={ref}></div>;
}
