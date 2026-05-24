import UserDashboardSidebard from "@/components/layouts/user-dashboard/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserDashboardSidebard />
      <div className="h-screen w-full overflow-y-auto flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
