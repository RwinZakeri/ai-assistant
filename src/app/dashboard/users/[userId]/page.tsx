import UserProfile from "@/components/pages/user-dashboard/users/components/UserProfile";

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const { userId } = await params;
  return <UserProfile userId={userId} />;
};

export default UserProfilePage;
