import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Product } from "@/data/mockData";
import { useProducts } from "@/hooks/useFirestore";
import { addProduct as fbAddProduct, deleteProducts as fbDeleteProducts } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, MoreHorizontal, Image, QrCode, Trash2, Edit, Download, Upload,
  ChevronLeft, ChevronRight, ArrowUpDown, Eye, Copy, X,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
type SortField = "name" | "price" | "quantity" | "lastUpdated";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const Products = () => {
  const { products, loading: productsLoading } = useProducts();
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (tab !== "all") list = list.filter((p) => p.status === tab);
    if (category !== "all") list = list.filter((p) => p.category.toLowerCase().includes(category));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mul * a.name.localeCompare(b.name);
      if (sortField === "price") return mul * (a.price - b.price);
      if (sortField === "quantity") return mul * (a.quantity - b.quantity);
      return mul * a.lastUpdated.localeCompare(b.lastUpdated);
    });
    return list;
  }, [tab, search, category, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const allSelected = paginated.length > 0 && paginated.every((p) => selected.has(p.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const tabCounts = {
    all: products.length,
    "in-stock": products.filter((p) => p.status === "in-stock").length,
    "low-stock": products.filter((p) => p.status === "low-stock").length,
    "out-of-stock": products.filter((p) => p.status === "out-of-stock").length,
  };

  return (
    <Layout title="Products" subtitle="Manage your product catalog">
      <div className="space-y-3 animate-slide-in">
        {/* Tab Filters */}
        <Tabs value={tab} onValueChange={(v) => { setTab(v as TabFilter); setPage(1); }}>
          <TabsList className="h-9 bg-card border border-border rounded p-0.5">
            <TabsTrigger value="all" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              All Products <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in-stock" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              In Stock <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts["in-stock"]}</Badge>
            </TabsTrigger>
            <TabsTrigger value="low-stock" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              Low Stock <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts["low-stock"]}</Badge>
            </TabsTrigger>
            <TabsTrigger value="out-of-stock" className="text-xs h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              Out of Stock <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5 rounded">{tabCounts["out-of-stock"]}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 w-full sm:w-64 h-8 bg-card border-border text-xs"
              />
            </div>
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="w-40 h-8 bg-card border-border text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="building">Building Materials</SelectItem>
                <SelectItem value="roofing">Roofing</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="paints">Paints</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="flooring">Flooring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success("Export started")}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Import
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {someSelected && (
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded">
            <span className="text-xs font-medium text-foreground">{selected.size} selected</span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.success(`${selected.size} products exported`)}>
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-[11px] text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-muted-foreground" onClick={() => setSelected(new Set())}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Products Table */}
        <Card className="border-border shadow-xs overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60 border-border">
                  <TableHead className="w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} className="h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold cursor-pointer select-none" onClick={() => handleSort("name")}>
                    <span className="flex items-center gap-1">Product <ArrowUpDown className="h-3 w-3" /></span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">SKU</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Category</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right cursor-pointer select-none" onClick={() => handleSort("price")}>
                    <span className="flex items-center gap-1 justify-end">Price <ArrowUpDown className="h-3 w-3" /></span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right cursor-pointer select-none" onClick={() => handleSort("quantity")}>
                    <span className="flex items-center gap-1 justify-end">Stock <ArrowUpDown className="h-3 w-3" /></span>
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Supplier</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((product) => (
                  <TableRow
                    key={product.id}
                    className={cn(
                      "border-border/50 hover:bg-accent/50 transition-colors cursor-pointer",
                      selected.has(product.id) && "bg-primary/5"
                    )}
                    onClick={() => setDetailProduct(product)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(product.id)}
                        onCheckedChange={() => toggleOne(product.id)}
                        className="h-3.5 w-3.5"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                          <Image className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{product.name}</span>
                          <p className="text-[10px] text-muted-foreground">{product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{product.sku}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] rounded">{product.category}</Badge></TableCell>
                    <TableCell className="text-sm font-semibold text-right">₦{product.price.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{product.quantity}</TableCell>
                    <TableCell><StatusBadge status={product.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.supplier}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailProduct(product)}>
                            <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit dialog would open")}>
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="h-3.5 w-3.5 mr-2" /> Generate QR
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-sm">
                      No products found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Show</span>
            <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-16 h-7 text-xs bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>of {filtered.length} products</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className="h-7 w-7 text-xs"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailProduct} onOpenChange={(o) => !o && setDetailProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">{detailProduct?.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Product ID: {detailProduct?.id} · SKU: {detailProduct?.sku}</DialogDescription>
          </DialogHeader>
          {detailProduct && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</p><p className="font-medium">{detailProduct.category}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Selling Price</p><p className="font-bold text-primary">₦{detailProduct.price.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cost Price</p><p className="font-medium">₦{detailProduct.costPrice.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Margin</p><p className="font-medium text-success">{((1 - detailProduct.costPrice / detailProduct.price) * 100).toFixed(1)}%</p></div>
              </div>
              <div className="space-y-3">
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Stock</p><p className="font-bold">{detailProduct.quantity}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Min Stock Level</p><p className="font-medium">{detailProduct.minStock}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Supplier</p><p className="font-medium">{detailProduct.supplier}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p><StatusBadge status={detailProduct.status} /></div>
              </div>
              <div className="col-span-2"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Updated</p><p className="font-medium">{detailProduct.lastUpdated}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setDetailProduct(null)}>Close</Button>
            <Button size="sm" className="text-xs" onClick={() => { toast.info("Edit mode"); setDetailProduct(null); }}>
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">Add New Product</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Fill in the product details below</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1"><Label className="text-xs">Product Name</Label><Input className="h-8 text-xs" placeholder="e.g. Premium Cement (50kg)" /></div>
            <div className="space-y-1"><Label className="text-xs">SKU</Label><Input className="h-8 text-xs" placeholder="CEM-001" /></div>
            <div className="space-y-1"><Label className="text-xs">Category</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">Building Materials</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="paints">Paints</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Selling Price (₦)</Label><Input type="number" className="h-8 text-xs" placeholder="0" /></div>
            <div className="space-y-1"><Label className="text-xs">Cost Price (₦)</Label><Input type="number" className="h-8 text-xs" placeholder="0" /></div>
            <div className="space-y-1"><Label className="text-xs">Quantity</Label><Input type="number" className="h-8 text-xs" placeholder="0" /></div>
            <div className="space-y-1"><Label className="text-xs">Min Stock</Label><Input type="number" className="h-8 text-xs" placeholder="0" /></div>
            <div className="col-span-2 space-y-1"><Label className="text-xs">Supplier</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dangote">Dangote Industries</SelectItem>
                  <SelectItem value="aluminum">Aluminum Corp</SelectItem>
                  <SelectItem value="plumbtech">PlumbTech Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button size="sm" className="text-xs" onClick={() => { toast.success("Product added successfully"); setShowAddDialog(false); }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-heading">Confirm Delete</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete {selected.size} product(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" className="text-xs" onClick={() => { toast.success(`${selected.size} products deleted`); setSelected(new Set()); setShowDeleteConfirm(false); }}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Products;
