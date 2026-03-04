import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { StockMovement } from "@/data/mockData";
import { useProducts, useStockMovements } from "@/hooks/useFirestore";
import { addStockMovement as fbAddMovement } from "@/services/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Warehouse, AlertTriangle, ArrowDownRight, ArrowUpRight, TrendingDown,
  Search, Plus, Download, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MovementTab = "all" | "in" | "out" | "adjustment";

const Inventory = () => {
  const { products } = useProducts();
  const { movements: stockMovements } = useStockMovements();
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStock = products.filter((p) => p.status === "low-stock").length;
  const outOfStock = products.filter((p) => p.status === "out-of-stock").length;

  const [movementTab, setMovementTab] = useState<MovementTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [stockView, setStockView] = useState<"all" | "low" | "out">("all");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredMovements = useMemo(() => {
    let list = [...stockMovements];
    if (movementTab !== "all") list = list.filter((m) => m.type === movementTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => m.productName.toLowerCase().includes(q));
    }
    return list;
  }, [movementTab, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (stockView === "low") return products.filter((p) => p.status === "low-stock");
    if (stockView === "out") return products.filter((p) => p.status === "out-of-stock");
    return products;
  }, [stockView]);

  const totalMovementPages = Math.max(1, Math.ceil(filteredMovements.length / perPage));
  const paginatedMovements = filteredMovements.slice((page - 1) * perPage, page * perPage);

  return (
    <Layout title="Inventory" subtitle="Track stock levels and movements">
      <div className="space-y-5 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="cursor-pointer" onClick={() => setStockView("all")}>
            <StatCard title="Total Items in Stock" value={totalItems.toLocaleString()} icon={<Warehouse className="h-4 w-4 text-primary" />} iconBg="bg-primary/10" />
          </div>
          <div className="cursor-pointer" onClick={() => setStockView("low")}>
            <StatCard title="Low Stock Alerts" value={lowStock.toString()} change="Needs restocking" changeType="negative" icon={<AlertTriangle className="h-4 w-4 text-warning" />} iconBg="bg-warning/10" />
          </div>
          <div className="cursor-pointer" onClick={() => setStockView("out")}>
            <StatCard title="Out of Stock" value={outOfStock.toString()} change="Order immediately" changeType="negative" icon={<TrendingDown className="h-4 w-4 text-destructive" />} iconBg="bg-destructive/10" />
          </div>
        </div>

        {/* Stock Levels */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold font-heading text-foreground">
              Stock Levels {stockView !== "all" && <Badge variant="outline" className="ml-2 text-[10px]">{stockView === "low" ? "Low Stock Only" : "Out of Stock Only"}</Badge>}
            </CardTitle>
            {stockView !== "all" && (
              <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => setStockView("all")}>Show All</Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4">
            {filteredProducts.map((product) => {
              const percentage = Math.min((product.quantity / (product.minStock * 3)) * 100, 100);
              return (
                <div key={product.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{product.quantity} / {product.minStock * 3}</span>
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
          <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold font-heading text-foreground">Stock Movement History</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.success("Movements exported")}>
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button size="sm" className="h-7 text-[11px]" onClick={() => setShowAdjustDialog(true)}>
                <Plus className="h-3 w-3 mr-1" /> New Movement
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2 border-b border-border flex items-center gap-3">
              <Tabs value={movementTab} onValueChange={(v) => { setMovementTab(v as MovementTab); setPage(1); }}>
                <TabsList className="h-8 bg-secondary p-0.5">
                  <TabsTrigger value="all" className="text-[11px] h-7">All</TabsTrigger>
                  <TabsTrigger value="in" className="text-[11px] h-7">Stock In</TabsTrigger>
                  <TabsTrigger value="out" className="text-[11px] h-7">Stock Out</TabsTrigger>
                  <TabsTrigger value="adjustment" className="text-[11px] h-7">Adjustments</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative flex-1 max-w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Search products..." className="pl-7 h-7 text-[11px] bg-card border-border" />
              </div>
            </div>
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
                {paginatedMovements.map((m) => (
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
                {paginatedMovements.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">No movements found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground">{filteredMovements.length} total records</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-6 w-6" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">Page {page} of {totalMovementPages}</span>
                <Button variant="outline" size="icon" className="h-6 w-6" disabled={page === totalMovementPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Stock Movement Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">Record Stock Movement</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Add a new stock in, out, or adjustment record</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Product</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Movement Type</Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" className="h-8 text-xs" placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Note</Label>
              <Textarea className="text-xs min-h-[60px]" placeholder="Reason for movement..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAdjustDialog(false)}>Cancel</Button>
            <Button size="sm" className="text-xs" onClick={() => { toast.success("Stock movement recorded"); setShowAdjustDialog(false); }}>
              Save Movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Inventory;
