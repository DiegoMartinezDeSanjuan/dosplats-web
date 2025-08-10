// components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ background: '#800000', padding: '1rem', color: 'white', textAlign: 'center', marginTop: '2rem' }}>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} Dos Plats - Lleida</p>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>Web en Español, Català e English</p>
    </footer>
  );
}
