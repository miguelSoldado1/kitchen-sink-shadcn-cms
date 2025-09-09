import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProfileEditPage } from "@/components/profile/profile-edit-page";

const TITLE = "Profile";
const DESCRIPTION = "Make changes to your profile here.";

export default function ProfilePage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <ProfileEditPage />
    </PageLayout>
  );
}
