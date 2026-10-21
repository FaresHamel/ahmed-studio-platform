import { RoleGuard } from "@/components/auth/RoleGuard";
import CustomerDetailsContainer from "@/containers/dashboard/admin/customers/CustomerDetailsContainer";

export default async function CustomerDetailsPage({
  params
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  return (
    <RoleGuard allow={["admin"]}>
      <CustomerDetailsContainer customerId={customerId} />
    </RoleGuard>
  );
}
