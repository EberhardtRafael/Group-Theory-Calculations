import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8 py-16">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center p-6">
          <div className="flex justify-center mb-4">
            <feature.icon className="w-12 h-12 text-slate-700" />
          </div>
          <div className="text-xl font-semibold mb-3">{feature.title}</div>
          <p className="text-slate-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;
