'use client';

import { Atom } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const NAV_LINKS = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/calculator', labelKey: 'nav.calculator' },
  {
    href: 'https://github.com/your-username/group-theory-calculator',
    labelKey: 'nav.github',
    external: true,
  },
];

const Header = () => {
  const t = useTranslations('header');

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Atom className="w-8 h-8 text-slate-700" />
          <span className="text-xl font-bold text-slate-900">{t('title')}</span>
        </Link>

        <div className="flex space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-slate-900 transition font-medium"
              {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
