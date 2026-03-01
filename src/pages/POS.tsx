import { useState } from "react";
import { Layout } from "@/components/Layout";
import { products } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-in">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <ScanBarcode className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Scan barcode or search product..."
                className="pl-8 h-9 bg-card border-border text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <ScanBarcode className="h-3.5 w-3.5 mr-1.5" />
              Camera
            </Button>
          </div>

          {/* Quick Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.filter(p => p.status !== "out-of-stock").slice(0, 8).map((product) => (
              <Card
                key={product.id}
                className="border-border shadow-xs cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                <CardContent className="p-3 text-center">
                  <div className="w-9 h-9 rounded bg-secondary mx-auto mb-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">{product.sku.slice(0, 3)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">₦{product.price.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{product.quantity} in stock</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <Card className="border-border shadow-xs flex flex-col">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold font-heading flex items-center gap-2 text-foreground">
              <Receipt className="h-4 w-4 text-primary" />
              Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col px-4 pb-4">
            <div className="flex-1 space-y-2 mb-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded bg-secondary/50 border border-border/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs font-semibold w-16 text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ScanBarcode className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No items in cart</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Discount</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-12 h-6 text-[11px] text-right p-1"
                  />
                  <span className="text-[11px] text-muted-foreground">%</span>
                  <span className="text-xs font-medium ml-1">-₦{discountAmount.toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-bold font-heading">Total</span>
                <span className="text-sm font-bold font-heading text-primary">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5">
                <Banknote className="h-3.5 w-3.5" />
                Cash
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5">
                <CreditCard className="h-3.5 w-3.5" />
                POS
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5">
                <Smartphone className="h-3.5 w-3.5" />
                Transfer
              </Button>
            </div>
            <Button size="sm" className="w-full mt-2 h-9 font-semibold text-xs">
              Complete Sale — ₦{total.toLocaleString()}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default POS;
