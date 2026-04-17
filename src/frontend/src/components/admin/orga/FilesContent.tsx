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
  Download,
  File,
  Folder,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type FileItem } from "../../../backend";
import {
  useAddFile,
  useDeleteFile,
  useGetFiles,
} from "../../../hooks/useQueries";

export default function FilesContent() {
  const { data: files, isLoading } = useGetFiles();
  const addFile = useAddFile();
  const deleteFile = useDeleteFile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setNewFolderName("");
    setUploadingFiles([]);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setUploadingFiles(Array.from(selectedFiles));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setUploadingFiles(Array.from(droppedFiles));
      setDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const folderName = newFolderName.trim() || currentFolder || "General";

    try {
      for (const file of uploadingFiles) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const externalBlob = ExternalBlob.fromBytes(bytes);

        const fileItem: FileItem = {
          id: `file_${Date.now()}_${Math.random()}`,
          name: file.name,
          folder: folderName,
          file: externalBlob,
        };

        await addFile.mutateAsync(fileItem);
      }

      toast.success(`${uploadingFiles.length} file(s) uploaded successfully`);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await deleteFile.mutateAsync(id);
        toast.success("File deleted successfully");
      } catch (error) {
        toast.error("Failed to delete file");
        console.error(error);
      }
    }
  };

  const handleDownload = (fileItem: FileItem) => {
    const url = fileItem.file.getDirectURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = fileItem.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const groupedFiles =
    files?.reduce(
      (acc, file) => {
        if (!acc[file.folder]) {
          acc[file.folder] = [];
        }
        acc[file.folder].push(file);
        return acc;
      },
      {} as Record<string, FileItem[]>,
    ) || {};

  const folders = Object.keys(groupedFiles).sort();

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
          <h3 className="text-xl font-bold">Files</h3>
          <p className="text-muted-foreground">
            Manage internal band files with drag & drop support
          </p>
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
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-accent bg-accent/10" : "border-border"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here, or click to select
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
              </div>

              {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({uploadingFiles.length})</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadingFiles.map((file, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: file upload order
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <File className="h-4 w-4" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="folder">Folder Name</Label>
                <Input
                  id="folder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={
                    currentFolder ||
                    "Enter folder name or leave empty for 'General'"
                  }
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={addFile.isPending || uploadingFiles.length === 0}
              >
                {addFile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload{" "}
                {uploadingFiles.length > 0 && `(${uploadingFiles.length})`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentFolder("")}
          >
            All Folders
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{currentFolder}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-accent bg-accent/10" : "border-border/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">Drop files or folders here</p>
        <p className="text-sm text-muted-foreground">
          Drag and drop multiple files or entire folders to upload
        </p>
      </div>

      {/* Folder View */}
      {!currentFolder && folders.length > 0 && (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folderName) => (
            <Card
              key={folderName}
              className="cursor-pointer hover:border-accent/50 transition-all"
              onClick={() => setCurrentFolder(folderName)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Folder className="h-16 w-16 mb-4 text-accent" />
                <h4 className="font-bold mb-1">{folderName}</h4>
                <p className="text-sm text-muted-foreground">
                  {groupedFiles[folderName].length} file(s)
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File List View */}
      {currentFolder && groupedFiles[currentFolder] && (
        <Card>
          <CardHeader>
            <CardTitle>{currentFolder}</CardTitle>
            <CardDescription>
              {groupedFiles[currentFolder].length} file(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {groupedFiles[currentFolder].map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{fileItem.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(fileItem)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(fileItem.id, fileItem.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {folders.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <p className="text-muted-foreground text-center">
              No files uploaded yet. Drag & drop files above or click "Upload
              Files"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
