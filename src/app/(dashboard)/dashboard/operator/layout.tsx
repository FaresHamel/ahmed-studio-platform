import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function OperatorLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allow={["operator"]}>{children}</RoleGuard>;
}
