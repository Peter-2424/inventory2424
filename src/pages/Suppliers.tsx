import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { suppliers } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";

const Suppliers = () => {
  return (
    <Layout title="Suppliers" subtitle="Manage supplier relationships and deliveries">
      <div className="space-y-6 animate-slide-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-9 h-9 bg-card border-border/50" />
          </div>
          <Button className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Supplier Cards (top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.slice(0, 3).map((supplier) => (
            <Card key={supplier.id} className="glass-card border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-foreground">{supplier.name}</h3>
                    <StatusBadge status={supplier.status} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuItem>View Deliveries</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{supplier.address}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{supplier.productsCount} products</span>
                  <span className="text-xs text-muted-foreground">Last delivery: {supplier.lastDelivery}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Suppliers Table */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 border-border/50">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Supplier</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Products</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Delivery</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="border-border/30 hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-sm font-medium">{supplier.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.address}</TableCell>
                    <TableCell className="text-sm text-right font-semibold">{supplier.productsCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{supplier.lastDelivery}</TableCell>
                    <TableCell><StatusBadge status={supplier.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
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
