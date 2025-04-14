
import React from 'react';
import { 
  Lock, 
  Globe, 
  Zap, 
  Cpu, 
  FileText, 
  LayoutGrid, 
  Image, 
  Calculator,
  BookOpen
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="bg-secondary/30 border border-border rounded-lg p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export const FeaturesGrid = () => {
  const features = [
    {
      icon: <Lock className="h-5 w-5 text-primary" />,
      title: "Privacy First",
      description: "All processing happens in your browser. Your data never leaves your device."
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Lightning Fast",
      description: "No server requests mean instant results for all your tools."
    },
    {
      icon: <Globe className="h-5 w-5 text-primary" />,
      title: "Works Offline",
      description: "Use our tools anytime, even without an internet connection."
    },
    {
      icon: <Cpu className="h-5 w-5 text-primary" />,
      title: "Resource Efficient",
      description: "Optimized performance with minimal browser resources."
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Wide Range of Tools",
      description: "From developers to designers, we have tools for everyone."
    },
    {
      icon: <LayoutGrid className="h-5 w-5 text-primary" />,
      title: "Customizable",
      description: "Personalize your workflow with customizable tools."
    },
    {
      icon: <Image className="h-5 w-5 text-primary" />,
      title: "Media Tools",
      description: "Process images and other media files without uploading them."
    },
    {
      icon: <Calculator className="h-5 w-5 text-primary" />,
      title: "Calculators & Converters",
      description: "Comprehensive suite of calculation and conversion tools."
    }
  ];

  return (
    <div className="py-16 bg-background" id="features-section">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-3">Why Choose ZeroKit?</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          Privacy-focused tools that put you in control of your data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;
