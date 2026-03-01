import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBg?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded p-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold font-heading text-foreground mt-0.5">{value}</p>
          {change && (
            <p className={cn(
              "text-[11px] mt-0.5 font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("flex items-center justify-center w-9 h-9 rounded", iconBg || "bg-primary/10")}>
          {icon}
        </div>
      </div>
    </div>
  );
}
