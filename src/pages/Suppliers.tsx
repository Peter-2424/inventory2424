import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { suppliers, Supplier } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Search, MoreHorizontal, Mail, Phone, MapPin, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, Download, X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SupplierTab = "all" | "active" | "inactive";

const Suppliers = () => {
  const [tab, setTab] = useState<SupplierTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let list = [...suppliers];
    if (tab !== "all") list = list.filter((s) => s.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    return list;
  }, [tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every((s) => selected.has(s.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(paginated.map((s) => s.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const tabCounts = {
    all: suppliers.length,
    active: suppliers.filter((s) => s.status === "active").length,
    inactive: suppliers.filter((s) => s.status === "inactive").length,
  };

  return (
    <Layout title="Suppliers" subtitle="Manage supplier relationships and deliveries">
      <div className="space-y-3 animate-slide-in">
        {/* Tab Filters */}
        <Tabs value={tab} onValueChange={(v) => { setTab(v as SupplierTab); setPage(1); }}>
          <TabsList className="h-9 bg-card border border-border rounded p-0.5">
            <TabsTrigger value="all" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              All Suppliers <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              Active <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              Inactive <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts.inactive}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search suppliers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-8 h-8 bg-card border-border text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success("Suppliers exported")}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Supplier
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {someSelected && (
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded">
            <span className="text-xs font-medium">{selected.size} selected</span>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.success(`${selected.size} suppliers exported`)}>
              <Download className="h-3 w-3 mr-1" /> Export
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] text-destructive hover:text-destructive" onClick={() => { toast.success(`${selected.size} suppliers removed`); setSelected(new Set()); }}>
              <Trash2 className="h-3 w-3 mr-1" /> Remove
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-muted-foreground" onClick={() => setSelected(new Set())}><X className="h-3.5 w-3.5" /></Button>
          </div>
        )}

        {/* Supplier Cards (Top 3 active) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.filter(s => s.status === "active").slice(0, 3).map((supplier) => (
            <Card key={supplier.id} className="border-border shadow-xs hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setDetailSupplier(supplier)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-foreground">{supplier.name}</h3>
                    <StatusBadge status={supplier.status} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailSupplier(supplier)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{supplier.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{supplier.phone}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="h-3 w-3 shrink-0" /><span>{supplier.address}</span></div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
                  <span className="text-[11px] text-muted-foreground">{supplier.productsCount} products</span>
                  <span className="text-[11px] text-muted-foreground">Last: {supplier.lastDelivery}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Suppliers Table */}
        <Card className="border-border shadow-xs overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60 border-border">
                  <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} className="h-3.5 w-3.5" /></TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Supplier</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contact</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Location</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Products</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Last Delivery</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((supplier) => (
                  <TableRow key={supplier.id} className={cn("border-border/50 hover:bg-accent/50 transition-colors cursor-pointer", selected.has(supplier.id) && "bg-primary/5")} onClick={() => setDetailSupplier(supplier)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selected.has(supplier.id)} onCheckedChange={() => toggleOne(supplier.id)} className="h-3.5 w-3.5" />
                    </TableCell>
                    <TableCell className="text-sm font-medium">{supplier.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.address}</TableCell>
                    <TableCell className="text-sm text-right font-semibold">{supplier.productsCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.lastDelivery}</TableCell>
                    <TableCell><StatusBadge status={supplier.status} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailSupplier(supplier)}><Eye className="h-3.5 w-3.5 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{filtered.length} suppliers</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <span className="text-xs text-muted-foreground px-2">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailSupplier} onOpenChange={(o) => !o && setDetailSupplier(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">{detailSupplier?.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Supplier ID: {detailSupplier?.id}</DialogDescription>
          </DialogHeader>
          {detailSupplier && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p><p className="font-medium">{detailSupplier.email}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p><p className="font-medium">{detailSupplier.phone}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address</p><p className="font-medium">{detailSupplier.address}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p><StatusBadge status={detailSupplier.status} /></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Products</p><p className="font-bold">{detailSupplier.productsCount}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Delivery</p><p className="font-medium">{detailSupplier.lastDelivery}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setDetailSupplier(null)}>Close</Button>
            <Button size="sm" className="text-xs"><Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Supplier Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">Add New Supplier</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Enter the supplier details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Company Name</Label><Input className="h-8 text-xs" placeholder="e.g. Dangote Industries" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Email</Label><Input type="email" className="h-8 text-xs" placeholder="email@company.com" /></div>
              <div className="space-y-1"><Label className="text-xs">Phone</Label><Input className="h-8 text-xs" placeholder="+234..." /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Address</Label><Input className="h-8 text-xs" placeholder="Lagos, Nigeria" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button size="sm" className="text-xs" onClick={() => { toast.success("Supplier added"); setShowAddDialog(false); }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Suppliers;
