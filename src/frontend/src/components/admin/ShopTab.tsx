import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ExternalBlob,
  type Product,
  type ProductVariant,
  type StripeConfiguration,
} from "../../backend";
import {
  useAddProduct,
  useDeleteProduct,
  useGetProducts,
  useIsStripeConfigured,
  useSetStripeConfiguration,
  useUpdateProduct,
  useUpdateProductOrder,
} from "../../hooks/useQueries";

export default function ShopTab() {
  const { data: products, isLoading } = useGetProducts();
  const { data: stripeConfigured } = useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProductOrder = useUpdateProductOrder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ExternalBlob[]>([]);
  const [isDigital, setIsDigital] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "1", name: "Standard", price: BigInt(0), stock: BigInt(0) },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [stripeKey, setStripeKey] = useState("");
  const [allowedCountries, setAllowedCountries] = useState("US,CA,GB,DE,FR");

  const [draggedProduct, setDraggedProduct] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImages([]);
    setIsDigital(false);
    setVariants([
      { id: "1", name: "Standard", price: BigInt(0), stock: BigInt(0) },
    ]);
    setCategories([]);
    setNewCategory("");
    setEditingProduct(null);
  };

  const handleImageUpload = async (files: FileList) => {
    const newImages: ExternalBlob[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = new Uint8Array(await file.arrayBuffer());
      newImages.push(ExternalBlob.fromBytes(bytes));
    }
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Produktname ist erforderlich");
      return;
    }

    if (images.length === 0) {
      toast.error("Mindestens ein Bild ist erforderlich");
      return;
    }

    const product: Product = {
      id: editingProduct?.id || `product_${Date.now()}`,
      name,
      description,
      images,
      variants,
      isDigital,
      categories,
      createdAt: editingProduct?.createdAt || BigInt(Date.now() * 1000000),
      order: editingProduct?.order || BigInt(products?.length || 0),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(product);
        toast.success("Produkt erfolgreich aktualisiert");
      } else {
        await addProduct.mutateAsync(product);
        toast.success("Produkt erfolgreich hinzugefügt");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Fehler beim Speichern des Produkts");
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setImages(product.images || []);
    setIsDigital(product.isDigital);
    setVariants(product.variants);
    setCategories(product.categories || []);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie dieses Produkt wirklich löschen?")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Produkt erfolgreich gelöscht");
      } catch (error) {
        toast.error("Fehler beim Löschen des Produkts");
        console.error(error);
      }
    }
  };

  const handleStripeSetup = async () => {
    if (!stripeKey.trim()) {
      toast.error("Stripe Secret Key ist erforderlich");
      return;
    }

    const config: StripeConfiguration = {
      secretKey: stripeKey,
      allowedCountries: allowedCountries.split(",").map((c) => c.trim()),
    };

    try {
      await setStripeConfig.mutateAsync(config);
      toast.success("Stripe erfolgreich konfiguriert");
      setStripeDialogOpen(false);
    } catch (error) {
      toast.error("Fehler bei der Stripe-Konfiguration");
      console.error(error);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `${variants.length + 1}`,
        name: "",
        price: BigInt(0),
        stock: BigInt(0),
      },
    ]);
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | bigint,
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleDragStart = (productId: string) => {
    setDraggedProduct(productId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetProductId: string) => {
    if (!draggedProduct || !products) return;

    const draggedIndex = products.findIndex((p) => p.id === draggedProduct);
    const targetIndex = products.findIndex((p) => p.id === targetProductId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newProducts = [...products];
    const [removed] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, removed);

    const productIds = newProducts.map((p) => p.id);

    try {
      await updateProductOrder.mutateAsync(productIds);
      toast.success("Produktreihenfolge aktualisiert");
    } catch (error) {
      toast.error("Fehler beim Aktualisieren der Reihenfolge");
      console.error(error);
    }

    setDraggedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!stripeConfigured && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle>Stripe-Konfiguration erforderlich</CardTitle>
            <CardDescription>
              Konfigurieren Sie Stripe, um die Checkout-Funktion zu aktivieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStripeDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Stripe konfigurieren
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shop-Verwaltung</h2>
          <p className="text-muted-foreground">
            Produkte und Merchandise verwalten
          </p>
        </div>
        <div className="flex gap-2">
          {stripeConfigured && (
            <Button variant="outline" onClick={() => setStripeDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Stripe-Einstellungen
            </Button>
          )}
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Produkt hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct
                    ? "Produkt bearbeiten"
                    : "Neues Produkt hinzufügen"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Produktname</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Produktname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Produktbeschreibung"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">
                    Produktbilder (mehrere möglich)
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files)
                    }
                  />
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {images.map((image, index) => (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: image position matters
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={image.getDirectURL()}
                            alt={`Vorschau ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs">
                              Hauptbild
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Kategorien</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="z.B. Shirts, Hoodies, Kleidung"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCategory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="gap-1"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="digital"
                    checked={isDigital}
                    onCheckedChange={(checked) =>
                      setIsDigital(checked as boolean)
                    }
                  />
                  <Label htmlFor="digital">Digitales Produkt</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Varianten</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Name</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
                          placeholder="Variantenname"
                        />
                      </div>
                      <div className="w-32">
                        <Label>Preis (€)</Label>
                        <Input
                          type="number"
                          value={Number(variant.price) / 100}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              BigInt(
                                Math.round(
                                  Number.parseFloat(e.target.value) * 100,
                                ),
                              ),
                            )
                          }
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div className="w-24">
                        <Label>Lagerbestand</Label>
                        <Input
                          type="number"
                          value={Number(variant.stock)}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              BigInt(Number.parseInt(e.target.value) || 0),
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={addProduct.isPending || updateProduct.isPending}
                >
                  {(addProduct.isPending || updateProduct.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProduct ? "Aktualisieren" : "Hinzufügen"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produkte</CardTitle>
          <CardDescription>
            Alle Shop-Produkte (Ziehen zum Sortieren)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine Produkte vorhanden
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12" />
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Bilder</TableHead>
                  <TableHead>Kategorien</TableHead>
                  <TableHead>Varianten</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    draggable
                    onDragStart={() => handleDragStart(product.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(product.id)}
                    className="cursor-move"
                  >
                    <TableCell>
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.isDigital ? "Digital" : "Physisch"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>{product.images?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categories?.map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-xs"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{product.variants.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={stripeDialogOpen} onOpenChange={setStripeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stripe-Konfiguration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripeKey">Stripe Secret Key</Label>
              <Input
                id="stripeKey"
                type="password"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                placeholder="sk_test_..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countries">Erlaubte Länder (kommagetrennt)</Label>
              <Input
                id="countries"
                value={allowedCountries}
                onChange={(e) => setAllowedCountries(e.target.value)}
                placeholder="US,CA,GB,DE,FR"
              />
            </div>
            <Button
              onClick={handleStripeSetup}
              disabled={setStripeConfig.isPending}
            >
              {setStripeConfig.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Konfiguration speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
