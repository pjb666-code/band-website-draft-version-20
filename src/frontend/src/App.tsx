import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ImprintPage from "./pages/ImprintPage";
import LegalPage from "./pages/LegalPage";
import MediaPage from "./pages/MediaPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ShopPage from "./pages/ShopPage";
import ShowsPage from "./pages/ShowsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const mediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/media",
  component: MediaPage,
});

const showsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shows",
  component: ShowsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: BookingPage,
});

const imprintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/imprint",
  component: ImprintPage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

const termsOfServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms-of-service",
  component: TermsOfServicePage,
});

const legalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal",
  component: LegalPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  shopRoute,
  mediaRoute,
  showsRoute,
  aboutRoute,
  contactRoute,
  bookingRoute,
  imprintRoute,
  privacyPolicyRoute,
  termsOfServiceRoute,
  legalRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
