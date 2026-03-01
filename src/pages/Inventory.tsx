import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { products, stockMovements } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Warehouse, AlertTriangle, ArrowDownRight, ArrowUpRight, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const Inventory = () => {
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStock = products.filter((p) => p.status === "low-stock").length;
  const outOfStock = products.filter((p) => p.status === "out-of-stock").length;

  return (
    <Layout title="Inventory" subtitle="Track stock levels and movements">
      <div className="space-y-5 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Items in Stock"
            value={totalItems.toLocaleString()}
            icon={<Warehouse className="h-4 w-4 text-primary" />}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStock.toString()}
            change="Needs restocking"
            changeType="negative"
            icon={<AlertTriangle className="h-4 w-4 text-warning" />}
            iconBg="bg-warning/10"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStock.toString()}
            change="Order immediately"
            changeType="negative"
            icon={<TrendingDown className="h-4 w-4 text-destructive" />}
            iconBg="bg-destructive/10"
          />
        </div>

        {/* Stock Levels */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold font-heading text-foreground">Stock Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4">
            {products.map((product) => {
              const percentage = Math.min((product.quantity / (product.minStock * 3)) * 100, 100);
              return (
                <div key={product.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        {product.quantity} / {product.minStock * 3}
                      </span>
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-1.5",
                      product.status === "out-of-stock" && "[&>div]:bg-destructive",
                      product.status === "low-stock" && "[&>div]:bg-warning",
                      product.status === "in-stock" && "[&>div]:bg-success"
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Movement History */}
        <Card className="border-border shadow-xs overflow-hidden">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold font-heading text-foreground">Stock Movement History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60 border-border">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ID</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Qty</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.map((m) => (
                  <TableRow key={m.id} className="border-border/50 hover:bg-accent/50">
                    <TableCell className="text-xs font-mono text-muted-foreground">{m.id}</TableCell>
                    <TableCell className="text-sm font-medium">{m.productName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] uppercase tracking-wider rounded",
                        m.type === "in" && "text-success border-success/30",
                        m.type === "out" && "text-destructive border-destructive/30",
                        m.type === "adjustment" && "text-warning border-warning/30"
                      )}>
                        {m.type === "in" ? "Stock In" : m.type === "out" ? "Stock Out" : "Adjustment"}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "text-sm font-bold text-right",
                      m.type === "in" && "text-success",
                      m.type === "out" && "text-destructive",
                      m.type === "adjustment" && "text-warning"
                    )}>
                      {m.type === "in" ? "+" : ""}{m.quantity}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
