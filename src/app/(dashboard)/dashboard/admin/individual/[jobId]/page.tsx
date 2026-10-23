import { RoleGuard } from "@/components/auth/RoleGuard";
import IndividualJobDetailsContainer from "@/containers/dashboard/admin/individual/IndividualJobDetailsContainer";

export default async function IndividualJobDetailsPage({
  params
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return (
    <RoleGuard allow={["admin"]}>
      <IndividualJobDetailsContainer key={jobId} jobId={jobId} />
    </RoleGuard>
  );
}
