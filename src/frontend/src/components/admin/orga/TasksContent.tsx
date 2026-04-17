import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Task } from "../../../backend";
import { TaskStatus } from "../../../backend";
import {
  useAddTask,
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "../../../hooks/useQueries";

export default function TasksContent() {
  const { data: tasks, isLoading } = useGetTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.todo);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setAssignedTo("");
    setStatus(TaskStatus.todo);
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const task: Task = {
      id: editingTask?.id || `task_${Date.now()}`,
      title,
      description,
      deadline: BigInt(new Date(deadline || Date.now()).getTime() * 1000000),
      assignedTo: assignedTo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status,
    };

    try {
      if (editingTask) {
        await updateTask.mutateAsync(task);
        toast.success("Task updated successfully");
      } else {
        await addTask.mutateAsync(task);
        toast.success("Task added successfully");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save task");
      console.error(error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(
      new Date(Number(task.deadline) / 1000000).toISOString().split("T")[0],
    );
    setAssignedTo(task.assignedTo.join(", "));
    setStatus(task.status);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask.mutateAsync(id);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error(error);
      }
    }
  };

  const getStatusBadge = (taskStatus: TaskStatus) => {
    const variants: Record<TaskStatus, "default" | "secondary" | "outline"> = {
      [TaskStatus.todo]: "outline",
      [TaskStatus.inProgress]: "secondary",
      [TaskStatus.completed]: "default",
    };
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.todo]: "To Do",
      [TaskStatus.inProgress]: "In Progress",
      [TaskStatus.completed]: "Completed",
    };
    return <Badge variant={variants[taskStatus]}>{labels[taskStatus]}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Tasks</h3>
          <p className="text-muted-foreground">Manage band tasks and to-dos</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned">Assigned To (comma-separated)</Label>
                <Input
                  id="assigned"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Member 1, Member 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.todo}>To Do</SelectItem>
                    <SelectItem value={TaskStatus.inProgress}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={TaskStatus.completed}>
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addTask.isPending || updateTask.isPending}
              >
                {(addTask.isPending || updateTask.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTask ? "Update" : "Add"} Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Band task list</CardDescription>
        </CardHeader>
        <CardContent>
          {!tasks || tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tasks yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>
                      {new Date(
                        Number(task.deadline) / 1000000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {task.assignedTo.join(", ") || "Unassigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
