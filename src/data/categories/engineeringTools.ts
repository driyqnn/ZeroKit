
import {
  Activity,
  Atom,
  Gauge,
  Lightbulb,
  PlugZap,
  Recycle,
  Ruler,
  Sigma,
  Waves,
  Wrench,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

interface Category {
  title: string;
  tools: Tool[];
}

export const engineeringTools: Category = {
  title: "Engineering Tools",
  tools: [
    {
      icon: Ruler,
      title: "Stress Calculator",
      description: "Calculate stress and strain in structural elements with common engineering formulas.",
      slug: "stress-calculator",
      isPopular: true,
    },
    {
      icon: Gauge,
      title: "Load Simulator",
      description: "Simulate load distribution and calculate structural requirements for beams and columns.",
      slug: "load-simulator",
      isNew: true,
    },
    {
      icon: PlugZap,
      title: "Circuit Analyzer",
      description: "Analyze electrical circuits with Ohm's law, Kirchhoff's laws, and other electrical principles.",
      slug: "circuit-analyzer",
      isNew: true,
    },
    {
      icon: Waves,
      title: "Fluid Dynamics Calculator",
      description: "Calculate fluid flow, pressure drop, and other hydraulic parameters for engineering applications.",
      slug: "fluid-dynamics-calculator",
      isNew: true,
    },
    {
      icon: Recycle,
      title: "Thermodynamics Assistant",
      description: "Calculate heat transfer, energy conversion, and thermal efficiency for engineering systems.",
      slug: "thermodynamics-assistant",
      isNew: true,
    },
    {
      icon: Sigma,
      title: "Force Calculator",
      description: "Calculate forces, moments, and equilibrium conditions for mechanical engineering applications.",
      slug: "force-calculator",
      isNew: true,
    },
  ],
};
