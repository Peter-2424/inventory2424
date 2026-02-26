import { useState } from "react";
import { Layout } from "@/components/Layout";
import { products } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScanBarcode, Plus, Minus, Trash2, Receipt, CreditCard, Banknote, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([
    { id: "P001", name: "Premium Cement (50kg)", price: 4500, quantity: 2 },
    { id: "P005", name: "Iron Rod 12mm", price: 5800, quantity: 3 },
    { id: "P004", name: "Emulsion Paint (20L)", price: 18500, quantity: 1 },
  ]);
  const [discount, setDiscount] = useState(5);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Layout title="Point of Sale" subtitle="Process sales and generate receipts">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan barcode or search product..."
                className="pl-10 h-11 bg-card border-border/50 text-sm"
              />
            </div>
            <Button variant="outline" className="h-11 px-4">
              <ScanBarcode className="h-4 w-4 mr-2" />
              Camera
            </Button>
          </div>

          {/* Quick Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.filter(p => p.status !== "out-of-stock").slice(0, 8).map((product) => (
              <Card
                key={product.id}
                className="glass-card border-border/50 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <CardContent className="p-3 text-center">
                  <div className="w-10 h-10 rounded-lg bg-secondary mx-auto mb-2 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">{product.sku.slice(0, 3)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm font-bold text-primary mt-1">₦{product.price.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{product.quantity} in stock</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <Card className="glass-card border-border/50 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-heading flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold w-20 text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ScanBarcode className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No items in cart</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-14 h-7 text-xs text-right p-1"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  <span className="text-sm font-medium ml-1">-₦{discountAmount.toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-bold font-heading">Total</span>
                <span className="font-bold font-heading text-primary">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button variant="outline" className="h-10 text-xs flex-col gap-0.5">
                <Banknote className="h-4 w-4" />
                Cash
              </Button>
              <Button variant="outline" className="h-10 text-xs flex-col gap-0.5">
                <CreditCard className="h-4 w-4" />
                POS
              </Button>
              <Button variant="outline" className="h-10 text-xs flex-col gap-0.5">
                <Smartphone className="h-4 w-4" />
                Transfer
              </Button>
            </div>
            <Button className="w-full mt-3 h-11 font-semibold">
              Complete Sale — ₦{total.toLocaleString()}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default POS;
