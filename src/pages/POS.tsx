import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useProducts } from "@/hooks/useFirestore";
import { addSale } from "@/services/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ScanBarcode, Plus, Minus, Trash2, Receipt, CreditCard, Banknote, Smartphone,
  Search, CheckCircle2, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQty: number;
}

const POS = () => {
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          toast.error("Cannot exceed available stock");
          return prev;
        }
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, maxQty: product.quantity }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.maxQty, item.quantity + delta)) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompleteSale = (method: string) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setPaymentMethod(method);
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    setCart([]);
    setDiscount(0);
    setShowReceipt(false);
    setPaymentMethod(null);
    toast.success("Ready for new sale");
  };

  const availableProducts = products.filter((p) => p.status !== "out-of-stock");
  const categories = [...new Set(availableProducts.map((p) => p.category))];

  const filteredProducts = availableProducts.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout title="Point of Sale" subtitle="Process sales and generate receipts">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-in">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Scan barcode or search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 bg-card border-border text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <ScanBarcode className="h-3.5 w-3.5 mr-1.5" /> Camera
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList className="h-8 bg-card border border-border p-0.5 flex-wrap">
              <TabsTrigger value="all" className="text-[11px] h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-[11px] h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">{cat}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const inCart = cart.find((c) => c.id === product.id);
              return (
                <Card
                  key={product.id}
                  className={cn(
                    "border-border shadow-xs cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all relative",
                    inCart && "border-primary/40 bg-primary/5"
                  )}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-3 text-center">
                    {inCart && (
                      <Badge className="absolute top-1.5 right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground rounded-full">
                        {inCart.quantity}
                      </Badge>
                    )}
                    <div className="w-9 h-9 rounded bg-secondary mx-auto mb-2 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-foreground">{product.sku.slice(0, 3)}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">₦{product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{product.quantity} in stock</p>
                  </CardContent>
                </Card>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground text-sm">No products found.</div>
            )}
          </div>
        </div>

        {/* Cart */}
        <Card className="border-border shadow-xs flex flex-col">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold font-heading flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Current Sale
              </span>
              {cart.length > 0 && (
                <Badge variant="secondary" className="text-[10px]">{cart.length} items</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col px-4 pb-4">
            <div className="flex-1 space-y-2 mb-3 max-h-[350px] overflow-auto">
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
                  <p className="text-xs">Click products to add to cart</p>
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
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
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
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5" onClick={() => handleCompleteSale("Cash")}>
                <Banknote className="h-3.5 w-3.5" /> Cash
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5" onClick={() => handleCompleteSale("POS")}>
                <CreditCard className="h-3.5 w-3.5" /> POS
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-[11px] flex-col gap-0.5" onClick={() => handleCompleteSale("Transfer")}>
                <Smartphone className="h-3.5 w-3.5" /> Transfer
              </Button>
            </div>
            <Button size="sm" className="w-full mt-2 h-9 font-semibold text-xs" onClick={() => handleCompleteSale("Cash")} disabled={cart.length === 0}>
              Complete Sale — ₦{total.toLocaleString()}
            </Button>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full mt-1 h-7 text-[11px] text-destructive" onClick={() => { setCart([]); toast.info("Cart cleared"); }}>
                Clear Cart
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-heading flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Sale Completed
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Transaction ID: TXN-{Date.now().toString().slice(-6)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-secondary/60 rounded p-3 space-y-1.5 font-mono text-xs">
              <div className="text-center mb-2">
                <p className="font-bold text-sm">NUKAH STORE</p>
                <p className="text-[10px] text-muted-foreground">Receipt</p>
              </div>
              <Separator />
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate flex-1">{item.name} x{item.quantity}</span>
                  <span className="font-semibold ml-2">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-destructive"><span>Discount ({discount}%)</span><span>-₦{discountAmount.toLocaleString()}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-sm"><span>TOTAL</span><span>₦{total.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Payment</span><span>{paymentMethod}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toast.success("Receipt printed")}>
                <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
              </Button>
              <Button size="sm" className="flex-1 text-xs" onClick={handleNewSale}>
                New Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default POS;
