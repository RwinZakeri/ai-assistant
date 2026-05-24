"use client";

import { useState } from "react";
import { AdminDashboardService } from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import { useQuery } from "@tanstack/react-query";
import HeaderDashboard from "../../components/HeaderDashboard";
import UserProfileBannerSkeleton from "./skeletons/UserProfileBannerSkeleton";
import ProfileBanner from "../../components/ProfileBanner";
import NavigationTabs from "../../components/NavigationTabs";
import UserProfileFormFields from "./UserProfileFormFields";
import SpeakersTable from "./SpeakersTable";
import VoiceAssistantsTable from "./VoiceAssistantsTable";
import WalletCard from "./WalletCard";
import PaymentHistoryTable from "./PaymentHistoryTable";
import SupportTicketsTable from "./SupportTicketsTable";
import QuestionsTable from "./QuestionsTable";
import type { UserProfileProps } from "./types";
import { UserProfileProvider } from "./UserProfileContext";

const UserProfile = ({ userId }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState("profile");

  const numericUserId = Number(userId) || 0;
  const { data: pictureResponse, isLoading: isLoadingPicture } = useQuery({
    queryKey: [ReactQuery.selectedUserProfilePicture, numericUserId],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetselecteduserprofilepictureGet(
        numericUserId
      ),
    enabled: numericUserId > 0,
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <UserProfileFormFields />
            </div>
          </div>
        );
      case "speakers":
        return <SpeakersTable />;
      case "voice-assistants":
        return <VoiceAssistantsTable />;
      case "wallet":
        return <WalletCard />;
      case "payments":
        return <PaymentHistoryTable />;
      case "support":
        return <SupportTicketsTable />;
      case "questions":
        return <QuestionsTable />;
      default:
        return null;
    }
  };

  return (
    <UserProfileProvider userId={userId}>
      <HeaderDashboard label="جزئیات کاربر">
        <div className="flex flex-col gap-6">
          {isLoadingPicture ? (
            <UserProfileBannerSkeleton />
          ) : (
            <ProfileBanner
              profilePictureData={pictureResponse || undefined}
              backgroundImage="url('/images/profiledashboardbanner.png')"
            />
          )}

          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {renderTabContent()}
        </div>
      </HeaderDashboard>
    </UserProfileProvider>
  );
};

export default UserProfile;
