import SpeakerDetails from "@/components/pages/user-dashboard/users/components/SpeakerDetails";
import { UserProfileProvider } from "@/components/pages/user-dashboard/users/components/UserProfileContext";

interface SpeakerDetailsPageProps {
  params: Promise<{
    userId: string;
    speakerId: string;
  }>;
}

const SpeakerDetailsPage = async ({ params }: SpeakerDetailsPageProps) => {
  const { userId, speakerId } = await params;
  return (
    <UserProfileProvider userId={userId}>
      <SpeakerDetails speakerId={speakerId} />
    </UserProfileProvider>
  );
};

export default SpeakerDetailsPage;
