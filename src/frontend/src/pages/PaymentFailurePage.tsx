import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="h-20 w-20 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was not completed. No charges have been made to your
            account.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate({ to: "/shop" })}>
              Return to Shop
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Go Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
