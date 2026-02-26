import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "in-stock" | "low-stock" | "out-of-stock" | "active" | "inactive";
}

const statusConfig = {
  "in-stock": { label: "In Stock", className: "bg-success/10 text-success border-success/20" },
  "low-stock": { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
  "out-of-stock": { label: "Out of Stock", className: "bg-destructive/10 text-destructive border-destructive/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5", config.className)}>
      {config.label}
    </Badge>
  );
}
