"use client";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SubscriptionPlansContainer from "@/containers/dashboard/SubscriptionPlansContainer";

export default function SubscriptionPlansPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <SubscriptionPlansContainer />
    </RoleGuard>
  );
}
