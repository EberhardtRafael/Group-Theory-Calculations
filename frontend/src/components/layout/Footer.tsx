'use client';

import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">{t('copyright', { year })}</p>
      </div>
    </footer>
  );
};

export default Footer;
