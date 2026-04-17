import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetCanisterStatus } from "../../hooks/useQueries";

export default function MaintenanceTab() {
  const {
    data: status,
    isLoading,
    refetch,
    isFetching,
  } = useGetCanisterStatus();
  const [copying, setCopying] = useState(false);

  const formatCycles = (cycles: bigint): string => {
    const trillion = 1_000_000_000_000n;
    const billion = 1_000_000_000n;

    if (cycles >= trillion) {
      return `${(Number(cycles) / Number(trillion)).toFixed(2)} T`;
    }
    if (cycles >= billion) {
      return `${(Number(cycles) / Number(billion)).toFixed(2)} B`;
    }
    return cycles.toString();
  };

  const formatBytes = (bytes: bigint): string => {
    const mb = 1024 * 1024;
    const gb = mb * 1024;

    const numBytes = Number(bytes);
    if (numBytes >= gb) {
      return `${(numBytes / gb).toFixed(2)} GB`;
    }
    if (numBytes >= mb) {
      return `${(numBytes / mb).toFixed(2)} MB`;
    }
    return `${(numBytes / 1024).toFixed(2)} KB`;
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusInfo = (cycles: bigint) => {
    const trillion = 1_000_000_000_000n;

    if (cycles > 2n * trillion) {
      return {
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        label: "Normal",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      };
    }
    if (cycles > trillion) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        label: "Warning",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      };
    }
    return {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    };
  };

  const handleCopyTopUpCommand = async () => {
    if (!status) return;

    const command = `dfx canister deposit-cycles ${status.canisterId} <amount>`;

    try {
      await navigator.clipboard.writeText(command);
      setCopying(true);
      toast.success("Top-up command copied to clipboard");
      setTimeout(() => setCopying(false), 2000);
    } catch (_error) {
      toast.error("Failed to copy command");
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Canister status refreshed");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading canister status...
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">
          Unable to load canister status
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(status.cycles);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Canister Maintenance</h2>
          <p className="text-muted-foreground mt-1">
            Monitor your canister's health and resource usage
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isFetching}
          variant="outline"
          className="hover-outline-effect"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Status Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
          <CardDescription>
            Current canister health and resource status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center gap-4 p-4 rounded-lg"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            {statusInfo.icon}
            <div>
              <div className={`text-lg font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {statusInfo.label === "Normal" &&
                  "Canister is operating normally"}
                {statusInfo.label === "Warning" &&
                  "Cycle balance is getting low"}
                {statusInfo.label === "Critical" && "Immediate top-up required"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canister Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Canister ID</CardTitle>
            <CardDescription>Your canister's unique identifier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm bg-muted p-3 rounded-md break-all">
              {status.canisterId}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Balance</CardTitle>
            <CardDescription>Available computational resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${statusInfo.color}`}>
              {formatCycles(status.cycles)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {status.cycles.toString()} cycles
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Current memory consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatBytes(status.memorySize)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {status.memorySize.toString()} bytes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Hash</CardTitle>
            <CardDescription>Current deployed code version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs bg-muted p-3 rounded-md break-all">
              {status.moduleHash
                ? `${Array.from(new Uint8Array(status.moduleHash))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("")
                    .substring(0, 32)}...`
                : "Not available"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
          <CardDescription>
            Recent maintenance and top-up events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Last Maintenance Check</div>
              <div className="text-sm text-muted-foreground">
                {formatTimestamp(status.lastMaintenanceCheck)}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-medium">Last Top-Up</div>
              <div className="text-sm text-muted-foreground">
                {status.lastTopUpTime
                  ? formatTimestamp(status.lastTopUpTime)
                  : "No top-ups recorded"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top-Up Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Top-Up Instructions</CardTitle>
          <CardDescription>How to add cycles to your canister</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To add cycles to your canister, use the following command from your
            terminal or NNS wallet:
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-sm bg-muted p-3 rounded-md overflow-x-auto">
              dfx canister deposit-cycles {status.canisterId} &lt;amount&gt;
            </div>
            <Button
              onClick={handleCopyTopUpCommand}
              variant="outline"
              size="icon"
              disabled={copying}
              className="hover-outline-effect shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Replace &lt;amount&gt; with the number of cycles you want to add
            (e.g., 1000000000000 for 1 trillion cycles)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
