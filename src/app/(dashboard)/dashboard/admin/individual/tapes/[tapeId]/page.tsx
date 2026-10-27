import { RoleGuard } from "@/components/auth/RoleGuard";
import IndividualTapeDetailsContainer from "@/components/dashboard/individual/IndividualTapeDetailsContainer";

export default async function IndividualTapePage({
  params
}: {
  params: Promise<{ tapeId: string }>;
}) {
  const { tapeId } = await params;

    return (
    <RoleGuard allow={["admin"]}>
       <IndividualTapeDetailsContainer tapeId={tapeId} />
     </RoleGuard>
     )
}
