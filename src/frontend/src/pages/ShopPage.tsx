import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  ExternalBlob,
  Product,
  ProductVariant,
  ShoppingItem,
} from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCreateCheckoutSession, useGetProducts } from "../hooks/useQueries";

type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export default function ShopPage() {
  const { data: products, isLoading } = useGetProducts();
  const createCheckout = useCreateCheckoutSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ExternalBlob[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (products) {
      const autoSelected: Record<string, string> = {};
      for (const product of products) {
        if (product.variants.length === 1) {
          autoSelected[product.id] = product.variants[0].id;
        }
      }
      setSelectedVariants((prev) => ({ ...autoSelected, ...prev }));
    }
  }, [products]);

  const openLightbox = (images: ExternalBlob[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length,
    );
  };

  const addToCart = (product: Product, variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return;

    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.variant.id === variantId,
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id && item.variant.id === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, variant, quantity: 1 }]);
    }

    toast.success("Zum Warenkorb hinzugefügt");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Ihr Warenkorb ist leer");
      return;
    }

    const items: ShoppingItem[] = cart.map((item) => ({
      productName: `${item.product.name} - ${item.variant.name}`,
      productDescription: item.product.description,
      priceInCents: item.variant.price,
      quantity: BigInt(item.quantity),
      currency: "eur",
    }));

    try {
      const session = await createCheckout.mutateAsync(items);
      window.location.href = session.url;
    } catch (error) {
      toast.error("Fehler beim Erstellen der Checkout-Sitzung");
      console.error(error);
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Shop wird geladen...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Shop</h1>
            {cart.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Warenkorb Gesamt
                  </p>
                  <p className="text-2xl font-bold">
                    €{(cartTotal / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  Zur Kasse ({cart.length})
                </Button>
              </div>
            )}
          </div>

          {!products || products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Noch keine Produkte verfügbar
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productImages = product.images || [];
                const hasSingleVariant = product.variants.length === 1;
                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden flex flex-col"
                  >
                    {productImages.length > 0 && (
                      <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center relative group">
                        <button
                          type="button"
                          className="w-full h-full p-0 bg-transparent border-0 cursor-pointer"
                          onClick={() => openLightbox(productImages, 0)}
                        >
                          <img
                            src={productImages[0].getDirectURL()}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                        {productImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            +{productImages.length - 1} Bilder
                          </div>
                        )}
                      </div>
                    )}
                    {productImages.length > 1 && (
                      <div className="px-4 pt-2">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {productImages.slice(0, 4).map((image, index) => (
                            <button
                              type="button"
                              // biome-ignore lint/suspicious/noArrayIndexKey: thumbnail position matters
                              key={index}
                              className="h-16 w-16 flex-shrink-0 p-0 bg-transparent border-0 cursor-pointer"
                              onClick={() => openLightbox(productImages, index)}
                            >
                              <img
                                src={image.getDirectURL()}
                                alt={`${product.name} ${index + 1}`}
                                className="h-16 w-16 object-cover rounded hover:opacity-75 transition-opacity"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.categories.map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!hasSingleVariant && (
                        <Select
                          value={selectedVariants[product.id] || ""}
                          onValueChange={(value) =>
                            setSelectedVariants({
                              ...selectedVariants,
                              [product.id]: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Variante wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.variants.map((variant) => (
                              <SelectItem key={variant.id} value={variant.id}>
                                {variant.name} - €
                                {(Number(variant.price) / 100).toFixed(2)}
                                {Number(variant.stock) === 0 &&
                                  " (Ausverkauft)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {hasSingleVariant && (
                        <div className="text-2xl font-bold">
                          €
                          {(Number(product.variants[0].price) / 100).toFixed(2)}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() =>
                          addToCart(product, selectedVariants[product.id])
                        }
                        disabled={
                          !selectedVariants[product.id] ||
                          Number(
                            product.variants.find(
                              (v) => v.id === selectedVariants[product.id],
                            )?.stock || 0,
                          ) === 0
                        }
                      >
                        In den Warenkorb
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0">
          <DialogHeader className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {lightboxImages.length > 0 && (
              <>
                <img
                  src={lightboxImages[lightboxIndex].getDirectURL()}
                  alt={`Bild ${lightboxIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                {lightboxImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                      {lightboxIndex + 1} / {lightboxImages.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
