import {
  Sparkles, Mail, Inbox, FileText, Users, UserCheck, Headphones, Workflow,
  BarChart3, BookOpen, Bot, Database, Calendar, Clock, ShieldCheck, Lock,
  Server, Cpu, Network, Zap, Phone, MessageSquare, Search, TrendingUp,
  CheckCircle2, FileSearch, Scale, Building2, Truck, HeartPulse, Home,
  HardHat, UtensilsCrossed, ShoppingCart, Briefcase, Banknote, ClipboardList,
  Receipt, CalendarClock, GraduationCap, Target, LineChart, Boxes, Plug,
  Globe, RefreshCw, AlarmClock, PhoneCall, FileCheck2, Brain, Layers,
  Settings, Gauge, Rocket, Building, Stethoscope, Gavel, KeyRound, Mailbox,
  MapPin, EyeOff,
  type LucideIcon,
} from "lucide-react";

/** Curated icon registry — only these icons are bundled (tree-shaken). */
export const iconMap = {
  Sparkles, Mail, Inbox, FileText, Users, UserCheck, Headphones, Workflow,
  BarChart3, BookOpen, Bot, Database, Calendar, Clock, ShieldCheck, Lock,
  Server, Cpu, Network, Zap, Phone, MessageSquare, Search, TrendingUp,
  CheckCircle2, FileSearch, Scale, Building2, Truck, HeartPulse, Home,
  HardHat, UtensilsCrossed, ShoppingCart, Briefcase, Banknote, ClipboardList,
  Receipt, CalendarClock, GraduationCap, Target, LineChart, Boxes, Plug,
  Globe, RefreshCw, AlarmClock, PhoneCall, FileCheck2, Brain, Layers,
  Settings, Gauge, Rocket, Building, Stethoscope, Gavel, KeyRound, Mailbox,
  MapPin, EyeOff,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = iconMap[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden />;
}
