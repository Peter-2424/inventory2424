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
    <div className="glass-card rounded-xl p-5 stat-glow transition-transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold font-heading text-foreground mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconBg || "bg-primary/10")}>
          {icon}
        </div>
      </div>
    </div>
  );
}
