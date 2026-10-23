import { RoleGuard } from "@/components/auth/RoleGuard";
import IndividualBoxDetailsContainer from "@/containers/dashboard/admin/individual/IndividualBoxDetailsContainer";

export default async function IndividualBoxDetailsPage({
  params
}: {
  params: Promise<{ boxId: string }>;
}) {
  const { boxId } = await params;

  return (
    <RoleGuard allow={["admin"]}>
      <IndividualBoxDetailsContainer key={boxId} boxId={boxId} />
    </RoleGuard>
  );
}
