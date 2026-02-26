import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, MoreHorizontal, Image, QrCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Products = () => {
  return (
    <Layout title="Products" subtitle="Manage your product catalog">
      <div className="space-y-6 animate-slide-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 w-full sm:w-72 h-9 bg-card border-border/50" />
            </div>
            <Select>
              <SelectTrigger className="w-40 h-9 bg-card border-border/50">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="building">Building Materials</SelectItem>
                <SelectItem value="roofing">Roofing</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="paints">Paints</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 border-border/50">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Product</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Price</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Stock</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Supplier</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-border/30 hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Image className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-sm font-semibold text-right">₦{product.price.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{product.quantity}</TableCell>
                    <TableCell><StatusBadge status={product.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.supplier}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="h-3.5 w-3.5 mr-2" /> Generate QR
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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

export default Products;
