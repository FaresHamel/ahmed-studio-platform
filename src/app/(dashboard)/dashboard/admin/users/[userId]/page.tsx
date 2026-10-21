import UserAccountDetailsContainer from "@/containers/dashboard/admin/users/UserAccountDetailsContainer";

export default async function UserAccountDetailsPage({ params }: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserAccountDetailsContainer userId={userId} />;
}
