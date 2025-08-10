// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dos Plats - Menú del Día</title>
        <meta name="description" content="Consulta el menú del día de Dos Plats en Lleida" />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Bienvenido a Dos Plats</h1>
        <p>Aquí podrás ver el menú del día en PDF y descargarlo.</p>
      </main>
    </>
  );
}
