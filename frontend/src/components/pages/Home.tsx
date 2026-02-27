'use client';

import { Atom, Zap, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from './home/HeroSection';
import FeaturesSection from './home/FeaturesSection';
import ExampleSection from './home/ExampleSection';
import CTASection from './home/CTASection';

const Home = () => {
  const t = useTranslations('home');

  const features = [
    {
      icon: Atom,
      title: t('features.dynkin.title'),
      description: t('features.dynkin.description'),
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
    {
      icon: Users,
      title: t('features.educational.title'),
      description: t('features.educational.description'),
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <HeroSection
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            buttonText={t('hero.cta')}
            buttonLink="/calculator"
          />
          <FeaturesSection features={features} />
          <ExampleSection />
          <CTASection
            title={t('cta.title')}
            description={t('cta.description')}
            buttonText={t('cta.button')}
            buttonLink="/calculator"
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
