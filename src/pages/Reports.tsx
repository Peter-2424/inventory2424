import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { dailySalesData, categorySalesData, products, recentSales } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PIE_COLORS = [
  "hsl(24, 95%, 53%)",
  "hsl(168, 60%, 42%)",
  "hsl(262, 60%, 55%)",
  "hsl(340, 65%, 55%)",
  "hsl(45, 93%, 47%)",
];

const monthlyData = [
  { month: "Sep", revenue: 2100000 },
  { month: "Oct", revenue: 2400000 },
  { month: "Nov", revenue: 1950000 },
  { month: "Dec", revenue: 3100000 },
  { month: "Jan", revenue: 2700000 },
  { month: "Feb", revenue: 2850000 },
];

const Reports = () => {
  const totalRevenue = recentSales.reduce((acc, s) => acc + s.total, 0);

  return (
    <Layout title="Reports" subtitle="Sales analytics and insights">
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="weekly" className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs h-7">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs h-7">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-7">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3.5 w-3.5 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₦${(totalRevenue / 1000).toFixed(0)}K`}
            change="+18.2% vs last week"
            changeType="positive"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="Total Transactions"
            value={recentSales.length.toString()}
            change="+5 today"
            changeType="positive"
            icon={<ShoppingBag className="h-5 w-5 text-accent" />}
            iconBg="bg-accent/10"
          />
          <StatCard
            title="Avg. Order Value"
            value={`₦${Math.round(totalRevenue / recentSales.length).toLocaleString()}`}
            change="+3.1%"
            changeType="positive"
            icon={<TrendingUp className="h-5 w-5 text-success" />}
            iconBg="bg-success/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12 }} tickFormatter={(v) => `₦${v / 1000000}M`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220, 15%, 90%)", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(24, 95%, 53%)" strokeWidth={2.5} dot={{ fill: "hsl(24, 95%, 53%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-heading">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categorySalesData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categorySalesData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="font-semibold">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Report */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold font-heading">Low Stock Report</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 border-border/50">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Product</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Current</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Min Required</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Deficit</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Reorder Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.filter(p => p.status !== "in-stock").map((p) => (
                  <TableRow key={p.id} className="border-border/30">
                    <TableCell className="text-sm font-medium">{p.name}</TableCell>
                    <TableCell className="text-sm text-right font-bold text-destructive">{p.quantity}</TableCell>
                    <TableCell className="text-sm text-right">{p.minStock}</TableCell>
                    <TableCell className="text-sm text-right font-semibold text-warning">{Math.max(0, p.minStock - p.quantity)}</TableCell>
                    <TableCell className="text-sm text-right">₦{((p.minStock - p.quantity) * p.costPrice).toLocaleString()}</TableCell>
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

export default Reports;
