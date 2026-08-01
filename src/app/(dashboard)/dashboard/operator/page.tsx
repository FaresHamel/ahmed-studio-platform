"use client";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuthStore } from "@/store/auth.store";

export default function OperatorDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <RoleGuard allow={["operator"]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Operator Dashboard</h1>
        <p className="mt-2 text-gray-500">
          Welcome, {user?.name ?? user?.email}
        </p>
      </div>
    </RoleGuard>
  );
}
