import AddOrEditSpeaker from "@/components/pages/user-dashboard/smart-speakers/add-or-edit-speaker";

const SpeakerDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <AddOrEditSpeaker speakerId={Number(slug)} />;
};

export default SpeakerDetail;
