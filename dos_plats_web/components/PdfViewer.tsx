// components/PdfViewer.tsx
interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div style={{ width: '100%', height: '80vh', marginTop: '1rem' }}>
      <iframe
        src={url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Menú del día"
      />
    </div>
  );
}
