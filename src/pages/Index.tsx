import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { dailySalesData } from "@/data/mockData";
import { useProducts, useSales, useStockMovements } from "@/hooks/useFirestore";
import {
  Package, TrendingUp, AlertTriangle, ShoppingCart, ArrowUpRight, ArrowDownRight,
  RefreshCw, Eye, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const { products } = useProducts();
  const { sales: recentSales } = useSales();
  const { movements: stockMovements } = useStockMovements();

  const lowStockProducts = products.filter((p) => p.status !== "in-stock");
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.success("Dashboard refreshed"); }, 800);
  };

  return (
    <Layout title="Dashboard" subtitle="Overview of your inventory and sales">
      <div className="space-y-5 animate-slide-in">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Last updated: Feb 25, 2025 · 2:45 PM</p>
          <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={handleRefresh}>
            <RefreshCw className={cn("h-3 w-3 mr-1.5", refreshing && "animate-spin")} /> Refresh
          </Button>
        </div>

        {/* Stats Grid - Clickable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/products")}>
            <StatCard title="Total Products" value={products.length.toString()} change="+3 this week" changeType="positive" icon={<Package className="h-4 w-4 text-primary" />} iconBg="bg-primary/10" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/reports")}>
            <StatCard title="Today's Sales" value="₦137,500" change="+12.5% vs yesterday" changeType="positive" icon={<TrendingUp className="h-4 w-4 text-success" />} iconBg="bg-success/10" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/inventory")}>
            <StatCard title="Low Stock Items" value={lowStockProducts.length.toString()} change="Requires attention" changeType="negative" icon={<AlertTriangle className="h-4 w-4 text-warning" />} iconBg="bg-warning/10" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/reports")}>
            <StatCard title="Inventory Value" value={`₦${(totalInventoryValue / 1000000).toFixed(1)}M`} change="+5.2% this month" changeType="positive" icon={<ShoppingCart className="h-4 w-4 text-info" />} iconBg="bg-info/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 border-border shadow-xs">
            <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold font-heading text-foreground">Weekly Sales</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => navigate("/reports")}>
                View Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailySalesData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} tickFormatter={(v) => `₦${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, "Sales"]} contentStyle={{ borderRadius: "4px", border: "1px solid hsl(214, 18%, 86%)", fontSize: "11px", boxShadow: "0 2px 8px hsl(0 0% 0% / 0.08)" }} />
                  <Bar dataKey="sales" fill="hsl(210, 79%, 46%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold font-heading flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" /> Stock Alerts
              </CardTitle>
              <Badge variant="destructive" className="text-[10px] h-5">{lowStockProducts.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2.5 rounded bg-secondary/60 border border-border/50 cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => navigate("/inventory")}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.quantity} remaining · Min: {product.minStock}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full h-7 text-[11px] text-primary" onClick={() => navigate("/inventory")}>
                View All Stock Levels <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Sales */}
          <Card className="border-border shadow-xs overflow-hidden">
            <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold font-heading text-foreground">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => navigate("/reports")}>
                View All <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/60 border-border">
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Method</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.slice(0, 5).map((sale) => (
                    <TableRow key={sale.id} className="border-border/50 hover:bg-secondary/30 cursor-pointer" onClick={() => navigate("/reports")}>
                      <TableCell className="text-xs font-mono text-muted-foreground">{sale.id}</TableCell>
                      <TableCell className="text-sm font-semibold">₦{sale.total.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px] rounded">{sale.paymentMethod}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[10px] rounded",
                          sale.status === "completed" && "text-success border-success/30",
                          sale.status === "refunded" && "text-destructive border-destructive/30",
                          sale.status === "pending" && "text-warning border-warning/30"
                        )}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Stock Movements */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold font-heading text-foreground">Recent Stock Movements</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => navigate("/inventory")}>
                View All <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {stockMovements.slice(0, 5).map((movement) => (
                <div key={movement.id} className="flex items-center gap-3 p-2.5 rounded bg-secondary/40 border border-border/50 cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => navigate("/inventory")}>
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded shrink-0",
                    movement.type === "in" && "bg-success/10",
                    movement.type === "out" && "bg-destructive/10",
                    movement.type === "adjustment" && "bg-warning/10"
                  )}>
                    {movement.type === "in" ? (
                      <ArrowDownRight className="h-3.5 w-3.5 text-success" />
                    ) : movement.type === "out" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{movement.productName}</p>
                    <p className="text-[11px] text-muted-foreground">{movement.note}</p>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    movement.type === "in" && "text-success",
                    movement.type === "out" && "text-destructive",
                    movement.type === "adjustment" && "text-warning"
                  )}>
                    {movement.type === "in" ? "+" : ""}{movement.quantity}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
