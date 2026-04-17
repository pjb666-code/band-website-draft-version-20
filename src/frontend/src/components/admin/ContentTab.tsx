import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import AboutContent from "./content/AboutContent";
import BookingContent from "./content/BookingContent";
import ContactContent from "./content/ContactContent";
import HomepageContent from "./content/HomepageContent";
import LegalContent from "./content/LegalContent";
import ShowsContent from "./content/ShowsContent";
import SocialMediaContent from "./content/SocialMediaContent";

export default function ContentTab() {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="homepage">Homepage</TabsTrigger>
        <TabsTrigger value="shows">Shows</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="booking">Booking</TabsTrigger>
        <TabsTrigger value="legal">Legal</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
      </TabsList>
      <TabsContent value="homepage">
        <HomepageContent />
      </TabsContent>
      <TabsContent value="shows">
        <ShowsContent />
      </TabsContent>
      <TabsContent value="about">
        <AboutContent />
      </TabsContent>
      <TabsContent value="contact">
        <ContactContent />
      </TabsContent>
      <TabsContent value="booking">
        <BookingContent />
      </TabsContent>
      <TabsContent value="legal">
        <LegalContent />
      </TabsContent>
      <TabsContent value="social">
        <SocialMediaContent />
      </TabsContent>
    </Tabs>
  );
}
