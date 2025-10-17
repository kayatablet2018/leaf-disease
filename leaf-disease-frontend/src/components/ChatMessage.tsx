import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  audioUrl?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => message.audioUrl ? new Audio(message.audioUrl) : null);

  const toggleAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 animate-in fade-in-50 slide-in-from-bottom-3 duration-500",
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 shadow-lg transition-all duration-300",
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border'
        )}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="rounded-lg mb-3 max-w-full h-auto"
          />
        )}
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-xs opacity-60">
            {message.timestamp.toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {message.audioUrl && (
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleAudio}
              className="h-7 w-7 p-0"
            >
              {isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
