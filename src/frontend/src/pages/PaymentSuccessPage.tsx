import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. You will receive a confirmation email
            shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/shop" })}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
