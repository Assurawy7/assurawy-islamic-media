import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
type Props = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string;
  color?: string;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  color = "bg-emerald-600",
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        {change && (
          <span className="mt-2 inline-block text-xs font-semibold text-emerald-600">
            {change}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`rounded-xl p-3 text-white ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}