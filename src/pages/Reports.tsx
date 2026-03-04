import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { dailySalesData, categorySalesData } from "@/data/mockData";
import { useProducts, useSales } from "@/hooks/useFirestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PIE_COLORS = [
  "hsl(210, 79%, 46%)", "hsl(152, 60%, 40%)", "hsl(40, 90%, 50%)",
  "hsl(280, 60%, 55%)", "hsl(200, 80%, 50%)",
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
  const { products } = useProducts();
  const { sales: recentSales } = useSales();
  const totalRevenue = recentSales.reduce((acc, s) => acc + s.total, 0);
  const [reportTab, setReportTab] = useState("overview");
  const [salesPage, setSalesPage] = useState(1);
  const salesPerPage = 5;

  const totalSalesPages = Math.ceil(recentSales.length / salesPerPage);
  const paginatedSales = recentSales.slice((salesPage - 1) * salesPerPage, salesPage * salesPerPage);

  return (
    <Layout title="Reports" subtitle="Sales analytics and insights">
      <div className="space-y-5 animate-slide-in">
        {/* Main Report Tabs */}
        <Tabs value={reportTab} onValueChange={setReportTab}>
          <div className="flex items-center justify-between">
            <TabsList className="h-9 bg-card border border-border rounded p-0.5">
              <TabsTrigger value="overview" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">Overview</TabsTrigger>
              <TabsTrigger value="sales" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">Sales History</TabsTrigger>
              <TabsTrigger value="inventory" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">Inventory Report</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select defaultValue="this-week">
                <SelectTrigger className="w-36 h-8 text-xs bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success("Report exported to CSV")}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success("PDF generated")}>
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" /> PDF
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-5 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Total Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}K`} change="+18.2% vs last week" changeType="positive" icon={<DollarSign className="h-4 w-4 text-primary" />} iconBg="bg-primary/10" />
              <StatCard title="Total Transactions" value={recentSales.length.toString()} change="+5 today" changeType="positive" icon={<ShoppingBag className="h-4 w-4 text-info" />} iconBg="bg-info/10" />
              <StatCard title="Avg. Order Value" value={`₦${Math.round(totalRevenue / recentSales.length).toLocaleString()}`} change="+3.1%" changeType="positive" icon={<TrendingUp className="h-4 w-4 text-success" />} iconBg="bg-success/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

              <Card className="border-border shadow-xs">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-sm font-semibold font-heading text-foreground">Sales by Category</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value">
                        {categorySalesData.map((_, index) => (<Cell key={index} fill={PIE_COLORS[index]} />))}
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

            {/* Weekly Sales Bar */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-semibold font-heading text-foreground">Daily Sales This Week</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailySalesData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 13%, 50%)', fontSize: 11 }} tickFormatter={(v) => `₦${v / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, "Sales"]} contentStyle={{ borderRadius: "4px", border: "1px solid hsl(214, 18%, 86%)", fontSize: "11px" }} />
                    <Bar dataKey="sales" fill="hsl(210, 79%, 46%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales History Tab */}
          <TabsContent value="sales" className="space-y-4 mt-4">
            <Card className="border-border shadow-xs overflow-hidden">
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-semibold font-heading text-foreground">Transaction History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/60 border-border">
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Transaction ID</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Items</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Amount</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Payment</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cashier</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.map((sale) => (
                      <TableRow key={sale.id} className="border-border/50 hover:bg-accent/50">
                        <TableCell className="text-xs font-mono text-muted-foreground">{sale.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{sale.date}</TableCell>
                        <TableCell className="text-sm text-right">{sale.items}</TableCell>
                        <TableCell className="text-sm font-semibold text-right">₦{sale.total.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px] rounded">{sale.paymentMethod}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{sale.cashier}</TableCell>
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
                <div className="flex items-center justify-between px-4 py-2 border-t border-border">
                  <span className="text-[11px] text-muted-foreground">{recentSales.length} transactions</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-6 w-6" disabled={salesPage === 1} onClick={() => setSalesPage(salesPage - 1)}><ChevronLeft className="h-3 w-3" /></Button>
                    <span className="text-xs text-muted-foreground px-2">Page {salesPage} of {totalSalesPages}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" disabled={salesPage === totalSalesPages} onClick={() => setSalesPage(salesPage + 1)}><ChevronRight className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Report Tab */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Total SKUs" value={products.length.toString()} icon={<ShoppingBag className="h-4 w-4 text-primary" />} iconBg="bg-primary/10" />
              <StatCard title="Inventory Value" value={`₦${(products.reduce((a, p) => a + p.price * p.quantity, 0) / 1000000).toFixed(1)}M`} icon={<DollarSign className="h-4 w-4 text-success" />} iconBg="bg-success/10" />
              <StatCard title="Cost Value" value={`₦${(products.reduce((a, p) => a + p.costPrice * p.quantity, 0) / 1000000).toFixed(1)}M`} icon={<TrendingUp className="h-4 w-4 text-info" />} iconBg="bg-info/10" />
            </div>
            <Card className="border-border shadow-xs overflow-hidden">
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-semibold font-heading text-foreground">Inventory Valuation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/60 border-border">
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Qty</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Unit Price</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Cost Price</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Stock Value</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Margin</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id} className="border-border/50 hover:bg-accent/50">
                        <TableCell className="text-sm font-medium">{p.name}</TableCell>
                        <TableCell className="text-sm text-right">{p.quantity}</TableCell>
                        <TableCell className="text-sm text-right">₦{p.price.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right text-muted-foreground">₦{p.costPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right font-semibold">₦{(p.price * p.quantity).toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right font-medium text-success">{((1 - p.costPrice / p.price) * 100).toFixed(0)}%</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
