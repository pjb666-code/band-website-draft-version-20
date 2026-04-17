import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../../../backend";
import { useAddMessage, useGetMessages } from "../../../hooks/useQueries";
import { useGetCallerUserProfile } from "../../../hooks/useQueries";

export default function ChatContent() {
  const { data: messages, isLoading } = useGetMessages();
  const { data: userProfile } = useGetCallerUserProfile();
  const addMessage = useAddMessage();

  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleSend = async () => {
    if (!content.trim()) {
      return;
    }

    const message: Message = {
      id: `msg_${Date.now()}`,
      sender: userProfile?.name || "Anonymous",
      content: content.trim(),
      timestamp: BigInt(Date.now() * 1000000),
      threadId: "main",
    };

    try {
      await addMessage.mutateAsync(message);
      setContent("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sortedMessages =
    messages?.sort((a, b) => Number(a.timestamp - b.timestamp)) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold">Band Chat</h3>
        <p className="text-muted-foreground">
          Internal messaging for band members
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Band communication</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6" ref={scrollRef}>
            <div className="space-y-4 py-4">
              {sortedMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No messages yet
                </p>
              ) : (
                sortedMessages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">
                        {message.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          Number(message.timestamp) / 1000000,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={addMessage.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={addMessage.isPending || !content.trim()}
              >
                {addMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
