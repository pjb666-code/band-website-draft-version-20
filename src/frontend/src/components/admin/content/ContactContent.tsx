import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ContactConfig } from "../../../backend";
import {
  useGetContactConfig,
  useGetContactMessages,
  useMarkContactMessageAsRead,
  useUpdateContactConfig,
} from "../../../hooks/useQueries";

export default function ContactContent() {
  const { data: contactConfig, isLoading } = useGetContactConfig();
  const { data: messages } = useGetContactMessages();
  const updateConfig = useUpdateContactConfig();
  const markAsRead = useMarkContactMessageAsRead();

  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (contactConfig) {
      setHeadline(contactConfig.headline);
      setEmail(contactConfig.email);
    }
  }, [contactConfig]);

  const handleSave = async () => {
    try {
      const config: ContactConfig = {
        headline,
        email,
        socialMediaLinks: contactConfig?.socialMediaLinks || [],
      };
      await updateConfig.mutateAsync(config);
      toast.success("Contact configuration updated");
    } catch (error) {
      toast.error("Failed to update contact configuration");
      console.error(error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
      toast.success("Message marked as read");
    } catch (error) {
      toast.error("Failed to mark message as read");
      console.error(error);
    }
  };

  const sortedMessages =
    messages?.sort((a, b) => Number(b.timestamp) - Number(a.timestamp)) || [];
  const unreadCount = messages?.filter((m) => !m.read).length || 0;

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
          <CardTitle>Contact Page Configuration</CardTitle>
          <CardDescription>Customize the contact page content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Page Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Contact Us"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@oneiric.com"
            />
          </div>

          <Button onClick={handleSave} disabled={updateConfig.isPending}>
            {updateConfig.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Form Messages</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} Unread</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Messages submitted through the contact form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedMessages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No messages yet
            </p>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-4 space-y-2 ${
                    message.read ? "bg-muted/30" : "bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{message.name}</h4>
                        {!message.read && <Badge variant="default">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </p>
                    </div>
                    {!message.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markAsRead.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Subject: {message.subject}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {message.message}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(message.timestamp) / 1000000,
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
