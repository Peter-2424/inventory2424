import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { suppliers } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";

const Suppliers = () => {
  return (
    <Layout title="Suppliers" subtitle="Manage supplier relationships and deliveries">
      <div className="space-y-4 animate-slide-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-8 h-8 bg-card border-border text-xs" />
          </div>
          <Button size="sm" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Supplier
          </Button>
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.slice(0, 3).map((supplier) => (
            <Card key={supplier.id} className="border-border shadow-xs hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-foreground">{supplier.name}</h3>
                    <StatusBadge status={supplier.status} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuItem>View Deliveries</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{supplier.address}</span>
                  </div>
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
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="border-border/50 hover:bg-accent/50 transition-colors">
                    <TableCell className="text-sm font-medium">{supplier.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.address}</TableCell>
                    <TableCell className="text-sm text-right font-semibold">{supplier.productsCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.lastDelivery}</TableCell>
                    <TableCell><StatusBadge status={supplier.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Products</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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

export default Suppliers;
