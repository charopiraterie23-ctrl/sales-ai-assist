
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
};

export default DashboardLoading;
