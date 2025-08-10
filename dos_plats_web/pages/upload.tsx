// pages/upload.tsx
import { useState } from 'react';

export default function UploadMenu() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    alert(`Archivo listo para subir: ${file.name}`);
    // Aqu� luego conectaremos con Supabase para guardar el PDF
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Subir Men� del D�a</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" style={{ display: 'block', marginTop: '1rem' }}>
          Subir PDF
        </button>
      </form>
    </main>
  );
}
