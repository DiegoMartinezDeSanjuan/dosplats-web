// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ background: '#800000', padding: '1rem', color: 'white' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Dos Plats</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/">Inicio</Link>
          <Link href="/upload">Subir Menú</Link>
        </div>
      </nav>
    </header>
  );
}
