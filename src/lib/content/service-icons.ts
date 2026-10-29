import {
  Camera,
  CreditCard,
  Cpu,
  FileText,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Monitor,
  Package,
  Palette,
  PenTool,
  Printer,
  Share2,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Icons the admin can pick for a service card.
export const serviceIcons: Record<string, { label: string; icon: LucideIcon }> = {
  palette: { label: "Palette", icon: Palette },
  "credit-card": { label: "Card", icon: CreditCard },
  megaphone: { label: "Megaphone", icon: Megaphone },
  "file-text": { label: "Document", icon: FileText },
  share: { label: "Social Share", icon: Share2 },
  cpu: { label: "AI / Chip", icon: Cpu },
  package: { label: "Package", icon: Package },
  layers: { label: "Layers", icon: Layers },
  "pen-tool": { label: "Pen Tool", icon: PenTool },
  printer: { label: "Printer", icon: Printer },
  camera: { label: "Camera", icon: Camera },
  monitor: { label: "Monitor", icon: Monitor },
  image: { label: "Image", icon: ImageIcon },
  shirt: { label: "Apparel", icon: Shirt },
  sparkles: { label: "Sparkles", icon: Sparkles },
};

export function getServiceIcon(key: string): LucideIcon {
  return serviceIcons[key]?.icon ?? Sparkles;
}
