import { getDashboardMetrics } from "@/features/dashboard/queries/get-metrics";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return <DashboardContent metrics={metrics} />;
}
