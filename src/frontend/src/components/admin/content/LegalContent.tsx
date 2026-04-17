import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetLegalContent,
  useUpdateLegalContent,
} from "../../../hooks/useQueries";

export default function LegalContent() {
  const { data: legalContent, isLoading } = useGetLegalContent();
  const updateContent = useUpdateLegalContent();

  const [imprint, setImprint] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");

  useEffect(() => {
    if (legalContent) {
      setImprint(legalContent.imprint);
      setPrivacyPolicy(legalContent.privacyPolicy);
      setTermsOfService(legalContent.termsOfService);
    }
  }, [legalContent]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({
        imprint,
        privacyPolicy,
        termsOfService,
        lastUpdated: BigInt(Date.now() * 1000000),
      });
      toast.success("Legal content updated successfully");
    } catch (error) {
      toast.error("Failed to update content");
      console.error(error);
    }
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
          <CardTitle>Imprint</CardTitle>
          <CardDescription>
            Legal information about your band (accessible at /imprint)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={imprint}
            onChange={(e) => setImprint(e.target.value)}
            placeholder="Enter imprint information..."
            rows={8}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>
            Your privacy policy (accessible at /privacy-policy)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            placeholder="Enter privacy policy..."
            rows={8}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardDescription>
            Your terms of service (accessible at /terms-of-service)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={termsOfService}
            onChange={(e) => setTermsOfService(e.target.value)}
            placeholder="Enter terms of service..."
            rows={8}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending}>
        {updateContent.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Changes
      </Button>
    </div>
  );
}
