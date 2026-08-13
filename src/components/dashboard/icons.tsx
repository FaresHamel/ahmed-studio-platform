import {
  LayoutGrid,
  Users,
  CreditCard,
  Image as ImageIcon,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  Search
} from "lucide-react";
import { NavItem } from "@/lib/nav-config";

export const NAV_ICONS: Record<NavItem["icon"], React.ElementType> = {
  overview: LayoutGrid,
  users: Users,
  membership: CreditCard,
  media: ImageIcon,
  subscription: Layers,
  storage: BarChart3,
  settings: Settings
};

export { LogOut, Search };
