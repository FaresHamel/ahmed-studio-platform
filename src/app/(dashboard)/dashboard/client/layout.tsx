import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allow={["client"]}>{children}</RoleGuard>;
}
