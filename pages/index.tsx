import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PdfViewer from '@/components/PdfViewer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { supabaseServer } from '@/lib/supabaseServer';

type Props = {
  url: string | null;
  name: string | null;
  error?: string | null;
};

export default function Home({ url, name, error }: Props) {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="container" style={{ display: 'grid', gap: '1rem' }}>
        <p className="muted">{t('tagline')}</p>
        <h2>
          {t('latest_menu')}
          {name ? ` · ${name}` : ''}
        </h2>

        {error && (
          <div className="card" style={{ borderColor: '#7f1d1d' }}>
            Error: {error}
          </div>
        )}

        {url ? (
          <>
            <div className="muted" style={{ display: 'flex', gap: '1rem' }}>
              <a href={url} target="_blank" rel="noreferrer">
                {t('open_new_tab')}
              </a>
              <a
                href={url}
                download={name || 'menu.pdf'}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                {t('download')} {name || 'menu.pdf'}
              </a>
            </div>
            <PdfViewer url={url} name={name || 'menu.pdf'} />
          </>
        ) : (
          <div className="card">{t('no_menu')}</div>
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  const BUCKET = process.env.SUPABASE_BUCKET || 'menus';
  const EXPIRY = parseInt(process.env.SIGNED_URL_EXPIRY || '86400', 10);

  let url: string | null = null;
  let name: string | null = null;
  let error: string | null = null;

  try {
    const { data, error: listErr } = await supabaseServer
      .storage
      .from(BUCKET)
      .list('', { limit: 100, sortBy: { column: 'updated_at', order: 'desc' } });

    if (listErr) throw listErr;

    const pdfs = (data || []).filter(
      (it: any) =>
        typeof it?.name === 'string' && it.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfs.length) {
      pdfs.sort((a: any, b: any) => {
        const ua = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const ub = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        if (ub !== ua) return ub - ua;
        return b.name.localeCompare(a.name);
      });

      const latest = pdfs[0];
      const { data: signed, error: signErr } = await supabaseServer
        .storage
        .from(BUCKET)
        .createSignedUrl(latest.name, EXPIRY);

      if (signErr) throw signErr;

      url = signed?.signedUrl || null;
      name = latest.name || null;
    }
  } catch (e: any) {
    error = e?.message || 'Server error';
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      url,
      name,
      error,
    },
  };
}
