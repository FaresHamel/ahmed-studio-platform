import { RoleGuard } from "@/components/auth/RoleGuard";
import UserManagementContainer from "@/containers/dashboard/UserManagementContainer";

export const metadata = { title: "User Management | Ahmed Studio" };

export default function UserManagementPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <UserManagementContainer />
    </RoleGuard>
  );
}
