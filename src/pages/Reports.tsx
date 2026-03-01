import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { dailySalesData, categorySalesData, products, recentSales } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PIE_COLORS = [
  "hsl(210, 79%, 46%)",
  "hsl(152, 60%, 40%)",
  "hsl(40, 90%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(200, 80%, 50%)",
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
      <div className="space-y-5 animate-slide-in">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="weekly" className="w-auto">
            <TabsList className="h-8 bg-secondary">
              <TabsTrigger value="daily" className="text-[11px] h-7">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-[11px] h-7">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-[11px] h-7">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₦${(totalRevenue / 1000).toFixed(0)}K`}
            change="+18.2% vs last week"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4 text-primary" />}
            iconBg="bg-primary/10"
          />
          <StatCard
            title="Total Transactions"
            value={recentSales.length.toString()}
            change="+5 today"
            changeType="positive"
            icon={<ShoppingBag className="h-4 w-4 text-info" />}
            iconBg="bg-info/10"
          />
          <StatCard
            title="Avg. Order Value"
            value={`₦${Math.round(totalRevenue / recentSales.length).toLocaleString()}`}
            change="+3.1%"
            changeType="positive"
            icon={<TrendingUp className="h-4 w-4 text-success" />}
            iconBg="bg-success/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-border shadow-xs">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold font-heading text-foreground">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} tickFormatter={(v) => `₦${v / 1000000}M`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "4px", border: "1px solid hsl(214, 18%, 86%)", fontSize: "11px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(210, 79%, 46%)" strokeWidth={2} dot={{ fill: "hsl(210, 79%, 46%)", r: 3.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold font-heading text-foreground">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value">
                    {categorySalesData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} contentStyle={{ borderRadius: "4px", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categorySalesData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
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
        <Card className="border-border shadow-xs overflow-hidden">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold font-heading text-foreground">Low Stock Report</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60 border-border">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Current</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Min Required</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Deficit</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Reorder Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.filter(p => p.status !== "in-stock").map((p) => (
                  <TableRow key={p.id} className="border-border/50 hover:bg-accent/50">
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
