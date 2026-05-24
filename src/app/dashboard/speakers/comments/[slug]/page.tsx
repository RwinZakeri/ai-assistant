"use client";

import SpeakerComments from "@/components/pages/user-dashboard/smart-speakers/comments";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const CommentsPage = () => {
  const params = useParams();

  const speakerId = useMemo(() => {
    const speakerId = params?.slug ? Number(params.slug) : null;

    const id = Number(params.slug);
    return Number.isFinite(id) ? id : null;
  }, [params]);

  if (!speakerId) {
    return null;
  }

  return <SpeakerComments speakerId={speakerId} />;
};

export default CommentsPage;
