import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginButton from "../components/LoginButton";
import ProfileSetupDialog from "../components/ProfileSetupDialog";
import BandOrgaTab from "../components/admin/BandOrgaTab";
import CodewordDialog from "../components/admin/CodewordDialog";
import ContentTab from "../components/admin/ContentTab";
import DesignTab from "../components/admin/DesignTab";
import MaintenanceTab from "../components/admin/MaintenanceTab";
import MediaTab from "../components/admin/MediaTab";
import ShopTab from "../components/admin/ShopTab";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

export default function AdminPage() {
  const navigate = useNavigate();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [codewordVerified, setCodewordVerified] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const verified = localStorage.getItem("oneiric_codeword_verified");
    if (verified === "true") {
      setCodewordVerified(true);
    }
  }, []);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    localStorage.removeItem("oneiric_codeword_verified");
    setCodewordVerified(false);
    navigate({ to: "/" });
  };

  const handleCodewordSuccess = () => {
    setCodewordVerified(true);
    localStorage.setItem("oneiric_codeword_verified", "true");
  };

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show login screen if not authenticated
  if (!isAuthenticated || loginStatus === "logging-in") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md px-4">
            <h1 className="text-4xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-8">
              Please log in with Internet Identity and enter the codeword to
              access the admin panel
            </p>
            <LoginButton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!codewordVerified) {
    return <CodewordDialog onSuccess={handleCodewordSuccess} />;
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You do not have admin privileges
            </p>
            <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="orga">Band Orga</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="design">
              <DesignTab />
            </TabsContent>

            <TabsContent value="media">
              <MediaTab />
            </TabsContent>

            <TabsContent value="shop">
              <ShopTab />
            </TabsContent>

            <TabsContent value="content">
              <ContentTab />
            </TabsContent>

            <TabsContent value="orga">
              <BandOrgaTab />
            </TabsContent>

            <TabsContent value="maintenance">
              <MaintenanceTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
