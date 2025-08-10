type Props = { url?: string|null };

export default function PdfViewer({ url }: Props) {
  if (!url) {
    return <div className="card" style={{textAlign:'center', padding:'3rem'}}>PDF not found.</div>;
  }
  return (
    <div className="card">
      <iframe
        src={url}
        style={{ width: '100%', height: '80vh', border: 0, borderRadius: 12 }}
        title="Menu PDF"
      />
    </div>
  );
}
