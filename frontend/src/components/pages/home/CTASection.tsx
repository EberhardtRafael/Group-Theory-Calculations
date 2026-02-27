import Link from 'next/link';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const CTASection = ({ title, description, buttonText, buttonLink }: CTASectionProps) => {
  return (
    <div className="text-center py-16">
      <div className="text-3xl font-bold mb-4">{title}</div>
      <p className="text-slate-600 mb-6">{description}</p>
      <Link
        href={buttonLink}
        className="inline-block bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default CTASection;
