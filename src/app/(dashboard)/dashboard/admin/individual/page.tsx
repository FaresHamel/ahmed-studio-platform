import { RoleGuard } from "@/components/auth/RoleGuard";
import IndividualJobsContainer from "@/containers/dashboard/admin/individual/IndividualJobsContainer";

export default function IndividualPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <IndividualJobsContainer />
    </RoleGuard>
  );
}
