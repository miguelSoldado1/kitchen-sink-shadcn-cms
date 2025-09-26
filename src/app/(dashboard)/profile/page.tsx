import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProfileEditPage } from "@/components/profile/profile-edit-page";

const TITLE = "Profile";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default function ProfilePage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <ProfileEditPage />
    </PageLayout>
  );
}
