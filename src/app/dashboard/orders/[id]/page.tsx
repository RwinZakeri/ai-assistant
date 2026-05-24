import OrderDetailsPage from "@/components/pages/user-dashboard/orders/[id]";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailsPage orderId={id} />;
}
