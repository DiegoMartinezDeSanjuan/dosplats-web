// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dos Plats - Men� del D�a</title>
        <meta name="description" content="Consulta el men� del d�a de Dos Plats en Lleida" />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Bienvenido a Dos Plats</h1>
        <p>Aqu� podr�s ver el men� del d�a en PDF y descargarlo.</p>
      </main>
    </>
  );
}
