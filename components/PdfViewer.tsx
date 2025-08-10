import { useEffect, useRef, useState, useCallback } from 'react';

type Props = { url?: string | null; name?: string | null };

// Visor PDF sin barra de herramientas, con zoom/paginación y botón Descargar
export default function PdfViewer({ url, name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pdf, setPdf] = useState<any>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);

  const [scale, setScale] = useState(1);
  const [fitWidth, setFitWidth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar documento
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!url) { setLoading(false); return; }
      try {
        const pdfjsLib: any = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

        const doc = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;

        setPdf(doc);
        setPageCount(doc.numPages);
        setPage(1);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [url]);

  // Render de una página al canvas
  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current || !containerRef.current) return;

    const pdfPage = await pdf.getPage(page);
    const viewport1 = pdfPage.getViewport({ scale: 1 });

    let s = scale;
    if (fitWidth) {
      const maxW = containerRef.current.clientWidth || 900;
      s = maxW / viewport1.width;
    }
    const viewport = pdfPage.getViewport({ scale: s });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
  }, [pdf, page, scale, fitWidth]);

  useEffect(() => { renderPage(); }, [renderPage]);
  useEffect(() => {
    if (!fitWidth) return;
    const onResize = () => renderPage();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitWidth, renderPage]);

  const zoomIn  = () => { setFitWidth(false); setScale(s => Math.min(s + 0.2, 4)); };
  const zoomOut = () => { setFitWidth(false); setScale(s => Math.max(s - 0.2, 0.4)); };
  const fit     = () => { setFitWidth(true); setScale(1); };
  const prev    = () => setPage(p => Math.max(1, p - 1));
  const next    = () => setPage(p => Math.min(pageCount, p + 1));

  if (!url) return <div className="card">PDF no disponible.</div>;
  if (loading) return <div className="card">Cargando PDF…</div>;
  if (error) return <div className="card" style={{borderColor:'#7f1d1d'}}>Error: {error}</div>;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{
        display:'flex', gap:8, alignItems:'center', justifyContent:'space-between',
        marginBottom:12, flexWrap:'wrap'
      }}>
        {/* Navegación */}
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button className="button" onClick={prev}  disabled={page<=1}  style={{padding:'6px 10px'}}>◀</button>
          <span className="muted">Página {page} / {pageCount}</span>
          <button className="button" onClick={next}  disabled={page>=pageCount} style={{padding:'6px 10px'}}>▶</button>
        </div>

        {/* Zoom y Descargar */}
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button className="button" onClick={zoomOut} style={{padding:'6px 10px'}}>−</button>
          <span className="muted">{fitWidth ? 'Ajustado al ancho' : `${Math.round(scale*100)}%`}</span>
          <button className="button" onClick={zoomIn}  style={{padding:'6px 10px'}}>+</button>
          <button className="button" onClick={fit}     style={{padding:'6px 10px'}}>Ajustar</button>
          <a
            className="button"
            href={url}
            download={name || undefined}
            target="_blank"
            rel="noreferrer"
            style={{padding:'6px 10px', textDecoration:'none', display:'inline-flex', alignItems:'center'}}
            title="Descargar PDF"
          >
            Descargar
          </a>
        </div>
      </div>

      <div ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ width:'100%', height:'auto', borderRadius:12, display:'block', background:'#fff' }}
        />
      </div>
    </div>
  );
}
