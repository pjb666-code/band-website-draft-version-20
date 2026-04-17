import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  GripVertical,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Palette,
  Plus,
  ShoppingBag,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ButtonStyle,
  ExternalBlob,
  HeroMediaType,
  type HeroVideo,
  type LogoVisibility,
  type QuickButton,
} from "../../backend";
import {
  useGetDesignConfig,
  useUpdateDesignConfig,
} from "../../hooks/useQueries";

const COLOR_PALETTES = [
  { name: "Teal & Purple", primary: "#14b8a6", secondary: "#a855f7" },
  { name: "Blue & Pink", primary: "#3b82f6", secondary: "#ec4899" },
  { name: "Green & Orange", primary: "#10b981", secondary: "#f97316" },
  { name: "Indigo & Yellow", primary: "#6366f1", secondary: "#eab308" },
  { name: "Red & Cyan", primary: "#ef4444", secondary: "#06b6d4" },
];

const ICON_OPTIONS = [
  { value: "headphones", label: "Headphones (Listen Now)", icon: Headphones },
  { value: "calendar", label: "Calendar (Upcoming Shows)", icon: Calendar },
  {
    value: "shopping-bag",
    label: "Shopping Bag (Shop Merch)",
    icon: ShoppingBag,
  },
];

export default function DesignTab() {
  const { data: designConfig, isLoading } = useGetDesignConfig();
  const updateConfig = useUpdateDesignConfig();

  const [logo, setLogo] = useState<ExternalBlob | null>(null);
  const [heroImage, setHeroImage] = useState<ExternalBlob | null>(null);
  const [heroMediaType, setHeroMediaType] = useState<HeroMediaType>(
    HeroMediaType.image,
  );
  const [heroVideoFile, setHeroVideoFile] = useState<ExternalBlob | null>(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroVideoAutoplay, setHeroVideoAutoplay] = useState(true);
  const [heroVideoLoop, setHeroVideoLoop] = useState(true);
  const [heroVideoMuted, setHeroVideoMuted] = useState(true);
  const [tagline, setTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [hoverOutlineColor, setHoverOutlineColor] = useState("#8b5cf6");
  const [heroTextColor, setHeroTextColor] = useState("#FFFFFF");
  const [heroTextSize, setHeroTextSize] = useState(48);
  const [logoSize, setLogoSize] = useState(100);
  const [logoVisibility, setLogoVisibility] = useState<LogoVisibility>({
    header: true,
    hero: true,
  });
  const [quickButtons, setQuickButtons] = useState<QuickButton[]>([]);

  // Button style states
  const [buttonBgColor, setButtonBgColor] = useState("#8b5cf6");
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF");
  const [buttonBorderColor, setButtonBorderColor] = useState("#8b5cf6");
  const [buttonBorderRadius, setButtonBorderRadius] = useState(8);
  const [buttonBorderWidth, setButtonBorderWidth] = useState(2);
  const [buttonBorderStyle, setButtonBorderStyle] = useState("solid");
  const [buttonHoverBgColor, setButtonHoverBgColor] = useState("#7c3aed");
  const [buttonHoverTextColor, setButtonHoverTextColor] = useState("#FFFFFF");
  const [buttonHoverBorderColor, setButtonHoverBorderColor] =
    useState("#7c3aed");
  const [buttonShape, setButtonShape] = useState("rounded");
  const [buttonSize, setButtonSize] = useState(48);

  useEffect(() => {
    if (designConfig) {
      setLogo(designConfig.logo || null);
      setHeroImage(designConfig.heroImage || null);
      setHeroMediaType(designConfig.heroMediaType || HeroMediaType.image);

      if (designConfig.heroVideo) {
        setHeroVideoFile(designConfig.heroVideo.file || null);
        setHeroVideoUrl(designConfig.heroVideo.externalUrl || "");
        setHeroVideoAutoplay(designConfig.heroVideo.autoplay ?? true);
        setHeroVideoLoop(designConfig.heroVideo.shouldLoop ?? true);
        setHeroVideoMuted(designConfig.heroVideo.muted ?? true);
      }

      setTagline(designConfig.tagline);
      setHeroSubtitle(designConfig.heroSubtitle || "");
      setAccentColor(designConfig.accentColor);
      setHoverOutlineColor(
        designConfig.hoverOutlineColor || designConfig.accentColor,
      );
      setHeroTextColor(designConfig.heroTextColor || "#FFFFFF");
      setHeroTextSize(Number(designConfig.heroTextSize || 48));
      setLogoSize(Number(designConfig.logoSize || 100));
      setLogoVisibility(
        designConfig.logoVisibility || { header: true, hero: true },
      );
      setQuickButtons(designConfig.quickButtons || []);

      if (designConfig.buttonStyle) {
        setButtonBgColor(designConfig.buttonStyle.backgroundColor);
        setButtonTextColor(designConfig.buttonStyle.textColor);
        setButtonBorderColor(designConfig.buttonStyle.borderColor);
        setButtonBorderRadius(Number(designConfig.buttonStyle.borderRadius));
        setButtonBorderWidth(Number(designConfig.buttonStyle.borderWidth));
        setButtonBorderStyle(designConfig.buttonStyle.borderStyle);
        setButtonHoverBgColor(designConfig.buttonStyle.hoverBackgroundColor);
        setButtonHoverTextColor(designConfig.buttonStyle.hoverTextColor);
        setButtonHoverBorderColor(designConfig.buttonStyle.hoverBorderColor);
        setButtonShape(designConfig.buttonStyle.shape);
        setButtonSize(Number(designConfig.buttonStyle.size || 48));
      }
    }
  }, [designConfig]);

  const handleFileUpload = async (
    file: File,
    type: "logo" | "hero" | "heroVideo",
  ) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);

    if (type === "logo") {
      setLogo(blob);
    } else if (type === "hero") {
      setHeroImage(blob);
    } else if (type === "heroVideo") {
      setHeroVideoFile(blob);
    }
  };

  const applyPalette = (palette: (typeof COLOR_PALETTES)[0]) => {
    setAccentColor(palette.primary);
    setHoverOutlineColor(palette.primary);
    setButtonBgColor(palette.primary);
    setButtonBorderColor(palette.primary);
    setButtonHoverBgColor(palette.secondary);
    setButtonHoverBorderColor(palette.secondary);
  };

  const addQuickButton = () => {
    const newButton: QuickButton = {
      id: `btn-${Date.now()}`,
      buttonLabel: "New Button",
      url: "/",
      icon: "headphones",
      enabled: true,
      order: BigInt(quickButtons.length),
      size: BigInt(buttonSize),
    };
    setQuickButtons([...quickButtons, newButton]);
  };

  const updateQuickButton = (id: string, updates: Partial<QuickButton>) => {
    setQuickButtons(
      quickButtons.map((btn) => (btn.id === id ? { ...btn, ...updates } : btn)),
    );
  };

  const deleteQuickButton = (id: string) => {
    setQuickButtons(quickButtons.filter((btn) => btn.id !== id));
  };

  const moveQuickButton = (index: number, direction: "up" | "down") => {
    const newButtons = [...quickButtons];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newButtons.length) return;

    [newButtons[index], newButtons[targetIndex]] = [
      newButtons[targetIndex],
      newButtons[index],
    ];
    newButtons.forEach((btn, idx) => {
      btn.order = BigInt(idx);
    });
    setQuickButtons(newButtons);
  };

  const handleSave = async () => {
    try {
      const buttonStyle: ButtonStyle = {
        backgroundColor: buttonBgColor,
        textColor: buttonTextColor,
        borderColor: buttonBorderColor,
        borderRadius: BigInt(buttonBorderRadius),
        borderWidth: BigInt(buttonBorderWidth),
        borderStyle: buttonBorderStyle,
        hoverBackgroundColor: buttonHoverBgColor,
        hoverTextColor: buttonHoverTextColor,
        hoverBorderColor: buttonHoverBorderColor,
        shape: buttonShape,
        size: BigInt(buttonSize),
      };

      const heroVideo: HeroVideo | undefined =
        heroVideoFile || heroVideoUrl
          ? {
              file: heroVideoFile || undefined,
              externalUrl: heroVideoUrl || undefined,
              autoplay: heroVideoAutoplay,
              shouldLoop: heroVideoLoop,
              muted: heroVideoMuted,
            }
          : undefined;

      await updateConfig.mutateAsync({
        logo: logo || undefined,
        heroImage: heroImage || undefined,
        heroMediaType,
        heroVideo,
        tagline,
        heroSubtitle,
        accentColor,
        hoverOutlineColor,
        heroTextColor,
        heroTextSize: BigInt(heroTextSize),
        logoSize: BigInt(logoSize),
        buttonStyle,
        logoVisibility,
        quickButtons,
      });
      toast.success("Design updated successfully");
    } catch (error) {
      toast.error("Failed to update design");
      console.error(error);
    }
  };

  const getButtonBorderRadiusStyle = () => {
    if (buttonShape === "square") return 0;
    if (buttonShape === "pill") return 9999;
    return buttonBorderRadius;
  };

  const getIconForButton = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("listen") || lowerLabel.includes("music"))
      return "headphones";
    if (lowerLabel.includes("show") || lowerLabel.includes("tour"))
      return "calendar";
    if (lowerLabel.includes("shop") || lowerLabel.includes("merch"))
      return "shopping-bag";
    return "headphones";
  };

  const renderIcon = (iconValue: string) => {
    const IconComponent = ICON_OPTIONS.find(
      (opt) => opt.value === iconValue,
    )?.icon;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
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
      <Card>
        <CardHeader>
          <CardTitle>Design Configuration</CardTitle>
          <CardDescription>
            Customize the visual appearance of your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload(e.target.files[0], "logo")
              }
            />
            {logo && (
              <div className="mt-2">
                <img
                  src={logo.getDirectURL()}
                  alt="Logo preview"
                  style={{ height: `${logoSize}px`, width: "auto" }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoSize">Logo Size (px)</Label>
            <Input
              id="logoSize"
              type="number"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              min={20}
              max={200}
            />
          </div>

          <div className="space-y-3">
            <Label>Logo Visibility</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logo-header"
                  checked={logoVisibility.header}
                  onCheckedChange={(checked) =>
                    setLogoVisibility({
                      ...logoVisibility,
                      header: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="logo-header"
                  className="font-normal cursor-pointer"
                >
                  Show logo in header
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logo-hero"
                  checked={logoVisibility.hero}
                  onCheckedChange={(checked) =>
                    setLogoVisibility({
                      ...logoVisibility,
                      hero: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="logo-hero"
                  className="font-normal cursor-pointer"
                >
                  Show logo in hero section
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <Label>Hero Background Media Type</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setHeroMediaType(HeroMediaType.image)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  heroMediaType === HeroMediaType.image
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                <span>Hero Image</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroMediaType(HeroMediaType.video)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  heroMediaType === HeroMediaType.video
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <Video className="h-5 w-5" />
                <span>Hero Video</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {heroMediaType === HeroMediaType.video
                ? "Hero Video will be displayed when both image and video are available"
                : "Hero Image will be used as the background"}
            </p>
          </div>

          {heroMediaType === HeroMediaType.image && (
            <div className="space-y-2">
              <Label htmlFor="hero">Hero Image</Label>
              <Input
                id="hero"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileUpload(e.target.files[0], "hero")
                }
              />
              {heroImage && (
                <div className="mt-2">
                  <img
                    src={heroImage.getDirectURL()}
                    alt="Hero preview"
                    className="h-40 w-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {heroMediaType === HeroMediaType.video && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="heroVideo">Hero Video File</Label>
                <Input
                  id="heroVideo"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileUpload(e.target.files[0], "heroVideo")
                  }
                />
                {heroVideoFile && (
                  <div className="mt-2">
                    <video
                      src={heroVideoFile.getDirectURL()}
                      className="h-40 w-auto rounded-lg"
                      controls
                    >
                      <track kind="captions" />
                    </video>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroVideoUrl">
                  Or External Video URL (YouTube, etc.)
                </Label>
                <Input
                  id="heroVideoUrl"
                  type="url"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-xs text-muted-foreground">
                  For YouTube videos, use the embed URL format
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <Label>Video Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video-autoplay"
                      checked={heroVideoAutoplay}
                      onCheckedChange={(checked) =>
                        setHeroVideoAutoplay(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="video-autoplay"
                      className="font-normal cursor-pointer"
                    >
                      Autoplay video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video-loop"
                      checked={heroVideoLoop}
                      onCheckedChange={(checked) =>
                        setHeroVideoLoop(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="video-loop"
                      className="font-normal cursor-pointer"
                    >
                      Loop video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video-muted"
                      checked={heroVideoMuted}
                      onCheckedChange={(checked) =>
                        setHeroVideoMuted(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="video-muted"
                      className="font-normal cursor-pointer"
                    >
                      Start muted (recommended for autoplay)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Enter your tagline"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle/Description</Label>
            <Textarea
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Enter a subtitle or description for the hero section"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroTextColor">Hero Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="heroTextColor"
                type="color"
                value={heroTextColor}
                onChange={(e) => setHeroTextColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={heroTextColor}
                onChange={(e) => setHeroTextColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroTextSize">Hero Text Size (px)</Label>
            <Input
              id="heroTextSize"
              type="number"
              value={heroTextSize}
              onChange={(e) => setHeroTextSize(Number(e.target.value))}
              min={24}
              max={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoverOutline">
              Hover Outline Color (All Interactive Elements)
            </Label>
            <div className="flex gap-2">
              <Input
                id="hoverOutline"
                type="color"
                value={hoverOutlineColor}
                onChange={(e) => setHoverOutlineColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={hoverOutlineColor}
                onChange={(e) => setHoverOutlineColor(e.target.value)}
                placeholder="#8b5cf6"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This color will be applied to all interactive elements (buttons,
              links, inputs) on hover
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Buttons Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Buttons (Hero Section)</CardTitle>
          <CardDescription>
            Add call-to-action buttons to the hero section with icons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickButtons.map((btn, index) => {
            const detectedIcon = getIconForButton(btn.buttonLabel);
            return (
              <div
                key={btn.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuickButton(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuickButton(index, "down")}
                        disabled={index === quickButtons.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Button {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={btn.enabled}
                      onCheckedChange={(checked) =>
                        updateQuickButton(btn.id, {
                          enabled: checked as boolean,
                        })
                      }
                    />
                    <Label className="text-sm">Enabled</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuickButton(btn.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Button Label</Label>
                    <Input
                      value={btn.buttonLabel}
                      onChange={(e) =>
                        updateQuickButton(btn.id, {
                          buttonLabel: e.target.value,
                        })
                      }
                      placeholder="e.g., Listen Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={btn.url}
                      onChange={(e) =>
                        updateQuickButton(btn.id, { url: e.target.value })
                      }
                      placeholder="e.g., /media or https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>
                    Button Size (px): {Number(btn.size || buttonSize)}
                  </Label>
                  <Slider
                    value={[Number(btn.size || buttonSize)]}
                    onValueChange={(value) =>
                      updateQuickButton(btn.id, { size: BigInt(value[0]) })
                    }
                    min={32}
                    max={80}
                    step={4}
                    className="w-full"
                  />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {renderIcon(detectedIcon)}
                    <span>
                      Icon auto-detected:{" "}
                      {
                        ICON_OPTIONS.find((opt) => opt.value === detectedIcon)
                          ?.label
                      }
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Icons are automatically selected based on button label
                    keywords (listen/music → headphones, show/tour → calendar,
                    shop/merch → shopping bag)
                  </p>
                </div>
              </div>
            );
          })}
          <Button onClick={addQuickButton} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Quick Button
          </Button>
        </CardContent>
      </Card>

      {/* Button Styling Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Button Styling</CardTitle>
          <CardDescription>
            Customize button appearance across the site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Palette Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Predefined Palettes
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {COLOR_PALETTES.map((palette) => (
                <button
                  type="button"
                  key={palette.name}
                  onClick={() => applyPalette(palette)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-accent transition-colors"
                >
                  <div className="flex gap-1">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <span className="text-xs text-center">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Button Size (px): {buttonSize}</Label>
            <Slider
              value={[buttonSize]}
              onValueChange={(value) => setButtonSize(value[0])}
              min={32}
              max={80}
              step={4}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              This sets the default size for new Quick Buttons. Individual
              buttons can be resized separately.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonBgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonBgColor"
                  type="color"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonTextColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={buttonTextColor}
                  onChange={(e) => setButtonTextColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={buttonTextColor}
                  onChange={(e) => setButtonTextColor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonBorderColor">Border Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonBorderColor"
                  type="color"
                  value={buttonBorderColor}
                  onChange={(e) => setButtonBorderColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={buttonBorderColor}
                  onChange={(e) => setButtonBorderColor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonShape">Shape</Label>
              <Select value={buttonShape} onValueChange={setButtonShape}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {buttonShape === "rounded" && (
              <div className="space-y-2">
                <Label htmlFor="buttonBorderRadius">Border Radius (px)</Label>
                <Input
                  id="buttonBorderRadius"
                  type="number"
                  value={buttonBorderRadius}
                  onChange={(e) =>
                    setButtonBorderRadius(Number(e.target.value))
                  }
                  min={0}
                  max={50}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="buttonBorderWidth">Border Width (px)</Label>
              <Input
                id="buttonBorderWidth"
                type="number"
                value={buttonBorderWidth}
                onChange={(e) => setButtonBorderWidth(Number(e.target.value))}
                min={0}
                max={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonBorderStyle">Border Style</Label>
              <Select
                value={buttonBorderStyle}
                onValueChange={setButtonBorderStyle}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-4">Hover Effects</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonHoverBgColor">Hover Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonHoverBgColor"
                    type="color"
                    value={buttonHoverBgColor}
                    onChange={(e) => setButtonHoverBgColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={buttonHoverBgColor}
                    onChange={(e) => setButtonHoverBgColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonHoverTextColor">Hover Text</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonHoverTextColor"
                    type="color"
                    value={buttonHoverTextColor}
                    onChange={(e) => setButtonHoverTextColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={buttonHoverTextColor}
                    onChange={(e) => setButtonHoverTextColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonHoverBorderColor">Hover Border</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonHoverBorderColor"
                    type="color"
                    value={buttonHoverBorderColor}
                    onChange={(e) => setButtonHoverBorderColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={buttonHoverBorderColor}
                    onChange={(e) => setButtonHoverBorderColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={updateConfig.isPending}
        size="lg"
        className="w-full"
      >
        {updateConfig.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Save All Changes
      </Button>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg p-8 text-center space-y-6">
            {logo && logoVisibility.hero && (
              <img
                src={logo.getDirectURL()}
                alt="Logo"
                style={{ height: `${logoSize}px`, width: "auto" }}
                className="mx-auto"
              />
            )}
            <h2
              className="font-bold"
              style={{
                fontSize: `${heroTextSize}px`,
                color: heroTextColor,
              }}
            >
              {tagline || "Your tagline here"}
            </h2>
            {heroSubtitle && (
              <p
                className="text-lg"
                style={{ color: heroTextColor, opacity: 0.9 }}
              >
                {heroSubtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              {quickButtons
                .filter((btn) => btn.enabled)
                .map((btn) => {
                  const icon = getIconForButton(btn.buttonLabel);
                  const btnSize = Number(btn.size || buttonSize);
                  return (
                    <button
                      type="button"
                      key={btn.id}
                      className="px-6 font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: buttonBgColor,
                        color: buttonTextColor,
                        borderColor: buttonBorderColor,
                        borderWidth: `${buttonBorderWidth}px`,
                        borderStyle: buttonBorderStyle,
                        borderRadius: `${getButtonBorderRadiusStyle()}px`,
                        height: `${btnSize}px`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          buttonHoverBgColor;
                        e.currentTarget.style.color = buttonHoverTextColor;
                        e.currentTarget.style.borderColor =
                          buttonHoverBorderColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = buttonBgColor;
                        e.currentTarget.style.color = buttonTextColor;
                        e.currentTarget.style.borderColor = buttonBorderColor;
                      }}
                    >
                      {renderIcon(icon)}
                      <span>{btn.buttonLabel}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
