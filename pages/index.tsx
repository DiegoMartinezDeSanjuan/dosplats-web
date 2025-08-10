import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PdfViewer from '@/components/PdfViewer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');
  const [url, setUrl] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/latestMenu');
        const data = await res.json();
        if (res.ok) setUrl(data.url);
        else setError(data.error || 'Error');
      } catch (e:any) {
        setError(e?.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="container" style={{display:'grid', gap:'1rem'}}>
        <p className="muted">{t('tagline')}</p>
        <h2>{t('latest_menu')}</h2>
        {loading ? <div className="card">{t('loading')}</div> : (url ? <PdfViewer url={url}/> : <div className="card">{t('no_menu')}</div>)}
        {error && <div className="card" style={{borderColor:'#7f1d1d'}}>Error: {error}</div>}
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60
  };
}
