import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const CODEWORD = "HilbertRaum58";

interface CodewordDialogProps {
  onSuccess: () => void;
}

export default function CodewordDialog({ onSuccess }: CodewordDialogProps) {
  const [codeword, setCodeword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (codeword === CODEWORD) {
      onSuccess();
      toast.success("Access granted");
    } else {
      toast.error("Incorrect codeword");
      setCodeword("");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
          <DialogDescription>
            Enter the one-time codeword to access the admin panel
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codeword">Codeword</Label>
            <Input
              id="codeword"
              type="password"
              value={codeword}
              onChange={(e) => setCodeword(e.target.value)}
              placeholder="Enter codeword"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
