import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ConnectionState = 'connected' | 'disconnected' | 'connecting';

interface ConnectionStatusProps {
  status: ConnectionState;
  sessionId?: string;
}

export const ConnectionStatus = ({ status, sessionId }: ConnectionStatusProps) => {
  const getIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Bağlı';
      case 'connecting':
        return 'Bağlanıyor...';
      case 'disconnected':
        return 'Bağlantı yok';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border hover:bg-card transition-colors cursor-pointer">
            <div className="relative">
              {getIcon()}
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-card',
                  getStatusColor()
                )}
              />
            </div>
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Connection Status</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-mono">{getStatusText()}</span>
              </div>
              {sessionId && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="font-mono text-primary">{sessionId}</span>
                </div>
              )}
              {status === 'connected' && (
                <div className="pt-2 text-green-600 dark:text-green-400">
                  ✓ API connection active
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
