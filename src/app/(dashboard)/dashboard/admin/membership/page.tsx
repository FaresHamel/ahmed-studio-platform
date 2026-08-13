"use client";
import { RoleGuard } from "@/components/auth/RoleGuard";
import MembershipStatusContainer from "@/containers/dashboard/MembershipStatusContainer";

export default function MembershipStatusPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <MembershipStatusContainer />
    </RoleGuard>
  );
}
