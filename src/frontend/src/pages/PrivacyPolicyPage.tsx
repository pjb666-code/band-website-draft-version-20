import { Loader2 } from "lucide-react";
import { useGetLegalContent } from "../hooks/useQueries";

export default function PrivacyPolicyPage() {
  const { data: legalContent, isLoading } = useGetLegalContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
            {legalContent?.privacyPolicy || "No privacy policy available."}
          </div>
        </div>
      </div>
    </div>
  );
}
