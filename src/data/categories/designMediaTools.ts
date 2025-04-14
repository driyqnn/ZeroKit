import {
  Image,
  FileImage,
  PaintBucket,
  Brush,
  QrCode,
  Palette,
  PenTool,
  Type,
  Scissors,
  MonitorPlay,
  AlignJustify,
  CircleDot,
  HexagonIcon,
  CalendarClock,
  Calendar,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface Category {
  title: string;
  tools: Tool[];
}

export const designMediaTools: Category = {
  title: "Design & Media Tools",
  tools: [
    {
      icon: Image,
      title: "Image Compressor",
      description:
        "Compress and optimize images without losing quality, preserving your privacy.",
      slug: "image-compressor",
      isPopular: true,
    },
    {
      icon: FileImage,
      title: "Metadata Remover",
      description:
        "Remove metadata from images and files to protect your privacy.",
      slug: "metadata-remover",
      isPopular: true,
    },
    {
      icon: PaintBucket,
      title: "Color Palette Generator",
      description:
        "Generate harmonious color schemes for your design projects.",
      slug: "color-palette-generator",
    },
    {
      icon: QrCode,
      title: "QR Code Generator",
      description:
        "Create custom QR codes for websites, text, contact info, and more.",
      slug: "qr-code-generator",
    },
    {
      icon: Palette,
      title: "CSS Gradient Generator",
      description: "Create beautiful CSS gradients with a visual editor.",
      slug: "css-gradient-generator",
    },
    {
      icon: CircleDot,
      title: "Contrast Checker",
      description: "Check color contrast for accessibility and readability.",
      slug: "contrast-checker",
    },
    {
      icon: PenTool,
      title: "Drawing Board",
      description: "Simple drawing tool for quick sketches and diagrams.",
      slug: "drawing-board",
    },
    {
      icon: HexagonIcon,
      title: "Hex Color Converter",
      description: "Convert between HEX, RGB, HSL, and other color formats.",
      slug: "hex-color-converter",
      isNew: true,
    },
    {
      icon: Calendar,
      title: "Invoice Generator",
      description: "Create professional invoices with custom templates.",
      slug: "invoice-generator",
    },
  ],
};
