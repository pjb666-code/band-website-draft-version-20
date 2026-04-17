import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarContent from "./orga/CalendarContent";
import ChatContent from "./orga/ChatContent";
import FilesContent from "./orga/FilesContent";
import TasksContent from "./orga/TasksContent";

export default function BandOrgaTab() {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks">
        <TasksContent />
      </TabsContent>

      <TabsContent value="files">
        <FilesContent />
      </TabsContent>

      <TabsContent value="chat">
        <ChatContent />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarContent />
      </TabsContent>
    </Tabs>
  );
}
