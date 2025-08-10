import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

export default function Upload() {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<File | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [status, setStatus] = useState<'idle'|'working'|'ok'|'unauthorized'|'error'>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus('working');
    setErrMsg(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('adminKey', adminKey);

    try {
      const res = await fetch('/api/uploadMenu', { method: 'POST', body: fd });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok) {
        setStatus('ok');
      } else if (res.status === 401) {
        setStatus('unauthorized');
      } else {
        setStatus('error');
        setErrMsg(data?.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err?.message || 'Network error');
    }
  };

  return (
    <>
      <Head><title>{t('upload')} · Dos Plats</title></Head>
      <Header />
      <main className="container">
        <form onSubmit={onSubmit} className="card" encType="multipart/form-data" style={{display:'grid', gap:'.75rem'}}>
          <label>
            {t('choose_file')}
            <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} required/>
          </label>
          <label>
            {t('admin_key')}
            <input type="password" value={adminKey} onChange={e=>setAdminKey(e.target.value)} required/>
          </label>
          <button className="button" type="submit" disabled={status==='working'}>
            {status==='working' ? 'Subiendo…' : t('submit')}
          </button>

          {status==='ok' && <div>{t('success')}</div>}
          {status==='unauthorized' && <div>{t('wrong_key')}</div>}
          {status==='error' && <div>⚠️ {errMsg}</div>}
        </form>
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
  };
}
