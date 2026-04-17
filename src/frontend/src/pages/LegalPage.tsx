import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetLegalContent } from "../hooks/useQueries";

export default function LegalPage() {
  const { data: legalContent, isLoading } = useGetLegalContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Legal Information</h1>

          <Tabs defaultValue="imprint" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="imprint">Imprint</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            </TabsList>

            <TabsContent value="imprint">
              <Card>
                <CardContent className="pt-6">
                  {legalContent?.imprint ? (
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">
                        {legalContent.imprint}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No imprint information available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardContent className="pt-6">
                  {legalContent?.privacyPolicy ? (
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">
                        {legalContent.privacyPolicy}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No privacy policy available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardContent className="pt-6">
                  {legalContent?.termsOfService ? (
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">
                        {legalContent.termsOfService}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No terms of service available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
