import React, { Suspense } from "react";
import { FileExplorer } from "@/components/file/file-explorer";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { checkReadPermission } from "@/server/auth-permissions";

const TITLE = "Files";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function FilePage() {
  await checkReadPermission("/sign-in");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <Suspense>
        <FileExplorer />
      </Suspense>
    </PageLayout>
  );
}
