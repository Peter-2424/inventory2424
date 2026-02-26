import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { products, recentSales, dailySalesData, stockMovements } from "@/data/mockData";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const lowStockProducts = products.filter((p) => p.status !== "in-stock");
const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

const Index = () => {
  return (
    <Layout title="Dashboard" subtitle="Overview of your inventory and sales">
      <div className="space-y-6 animate-slide-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={products.length.toString()}
            change="+3 this week"
            changeType="positive"
            icon={<Package className="h-5 w-5 text-primary" />}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="Today's Sales"
            value="₦137,500"
            change="+12.5% vs yesterday"
            changeType="positive"
            icon={<TrendingUp className="h-5 w-5 text-success" />}
            iconBg="bg-success/10"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts.length.toString()}
            change="Requires attention"
            changeType="negative"
            icon={<AlertTriangle className="h-5 w-5 text-warning" />}
            iconBg="bg-warning/10"
          />
          <StatCard
            title="Inventory Value"
            value={`₦${(totalInventoryValue / 1000000).toFixed(1)}M`}
            change="+5.2% this month"
            changeType="positive"
            icon={<ShoppingCart className="h-5 w-5 text-info" />}
            iconBg="bg-info/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading">Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailySalesData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" tick={{ fill: 'hsl(220, 10%, 50%)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(220, 10%, 50%)' }} tickFormatter={(v) => `₦${v / 1000}k`} className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, "Sales"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220, 15%, 90%)", fontSize: "12px" }}
                  />
                  <Bar dataKey="sales" fill="hsl(24, 95%, 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.quantity} remaining</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Method</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Cashier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.slice(0, 4).map((sale) => (
                    <TableRow key={sale.id} className="border-border/30">
                      <TableCell className="text-xs font-mono text-muted-foreground">{sale.id}</TableCell>
                      <TableCell className="text-sm font-semibold">₦{sale.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sale.cashier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Stock Movements */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading">Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                      movement.type === "in" && "bg-success/10",
                      movement.type === "out" && "bg-destructive/10",
                      movement.type === "adjustment" && "bg-warning/10"
                    )}>
                      {movement.type === "in" ? (
                        <ArrowDownRight className="h-4 w-4 text-success" />
                      ) : movement.type === "out" ? (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{movement.productName}</p>
                      <p className="text-xs text-muted-foreground">{movement.note}</p>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
