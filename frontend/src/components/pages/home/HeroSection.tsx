import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const HeroSection = ({ title, subtitle, buttonText, buttonLink }: HeroSectionProps) => {
  return (
    <div className="text-center py-20">
      <div className="text-5xl font-bold text-slate-900 mb-6">{title}</div>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>
      <Link
        href={buttonLink}
        className="inline-block bg-slate-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-800 transition"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default HeroSection;
