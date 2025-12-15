import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart }) {
  const ref = useRef();
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.render('chart', chart, svg => { ref.current.innerHTML = svg; });
  }, [chart]);
  return <div ref={ref} />;
}