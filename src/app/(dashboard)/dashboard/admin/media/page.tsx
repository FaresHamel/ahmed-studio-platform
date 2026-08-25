"use client";
import { RoleGuard } from "@/components/auth/RoleGuard";
import MembershipStatusContainer from "@/containers/dashboard/MembershipStatusContainer";

export default function MediaPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <MembershipStatusContainer />
    </RoleGuard>
  );
}
