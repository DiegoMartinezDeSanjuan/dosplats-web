import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, asPath } = router;
  const locales = ['es','ca','en'];

  return (
    <header className="container" style={{paddingTop:'1.25rem'}}>
      <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
        <Image src="/logo.svg" alt="Dos Plats" width={120} height={32} />
        <span className="brand">Dos Plats</span>
      </div>
      <nav style={{display:'flex', alignItems:'center', gap:'.75rem'}}>
        <Link className="button" href="/upload">{t('upload')}</Link>
        <div className="lang">
          <span className="muted">{t('language')}:</span>
          {locales.map(l => (
            <Link key={l} href={asPath} locale={l}>
              {l.toUpperCase()}{l===locale?'':' '}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
