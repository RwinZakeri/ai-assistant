import SingleSmartSpeakerPage from "@/components/pages/website/speaker/single";

interface SmartSpeakerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SmartSpeakerPage = async ({ params }: SmartSpeakerPageProps) => {
  const { id } = await params;
  const speakerId = parseInt(id, 10);
  return <SingleSmartSpeakerPage speakerId={speakerId} />;
};

export default SmartSpeakerPage;
