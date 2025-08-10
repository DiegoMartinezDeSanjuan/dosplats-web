import { useEffect, useRef, useState } from 'react';

export default function PdfViewer({ url }: { url?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!url) { setLoading(false); return; }
      try {
        const pdfjsLib: any = await import('pdfjs-dist/build/pdf');
        // Usamos el worker desde CDN para evitar configuraciones extra
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.worker.min.js';

        const doc = await pdfjsLib.getDocument({ url }).promise;

        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          if (cancelled) return;
          const page = await doc.getPage(pageNum);

          // Ajuste al ancho del contenedor
          const viewport = page.getViewport({ scale: 1 });
          const maxWidth = containerRef.current.clientWidth || 900;
          const scale = maxWidth / viewport.width;
          const scaled = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.style.width = '100%';
          canvas.style.display = 'block';
          canvas.style.borderRadius = '12px';
          canvas.width = Math.floor(scaled.width);
          canvas.height = Math.floor(scaled.height);

          await page.render({ canvasContext: ctx, viewport: scaled }).promise;

          const wrapper = document.createElement('div');
          wrapper.style.margin = '0 0 16px 0';
          wrapper.appendChild(canvas);
          containerRef.current.appendChild(wrapper);
        }
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [url]);

  if (!url) return <div className="card">PDF no disponible.</div>;
  if (loading) return <div className="card">Cargando PDF…</div>;
  if (error) return <div className="card" style={{borderColor:'#7f1d1d'}}>Error: {error}</div>;

  return <div className="card" ref={containerRef} style={{ padding: 12 }} />;
}
