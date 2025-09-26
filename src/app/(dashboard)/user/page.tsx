import { Suspense } from "react";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { UserCreateForm } from "@/components/user/user-create-form";
import { UserTable } from "@/components/user/user-table";
import { checkReadPermission } from "@/server/auth-permissions";

const TITLE = "Users";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function UsersPage() {
  await checkReadPermission("/sign-in");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}>
        <UserCreateForm />
      </PageHeader>
      <Suspense>
        <UserTable />
      </Suspense>
    </PageLayout>
  );
}
