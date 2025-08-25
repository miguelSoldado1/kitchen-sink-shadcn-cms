import React from "react";
import { PageHeader, PageLayout } from "@/components/page-layout";

const TITLE = "Profile";
const DESCRIPTION = "Make changes to your profile here.";

export default function ProfilePage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <section className="container space-y-6 rounded-xl border p-6"></section>
    </PageLayout>
  );
}
