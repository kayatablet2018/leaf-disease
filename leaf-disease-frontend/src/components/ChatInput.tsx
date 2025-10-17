import { useState, useRef, useCallback } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { VoiceRecorder } from './VoiceRecorder';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim() && !selectedFile) return;

    onSendMessage(message, selectedFile || undefined);
    setMessage('');
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Please select image file only",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTranscript = useCallback((transcript: string) => {
    setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
  }, []);

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={selectedImage}
            alt="Preview"
            className="h-20 rounded-lg border border-border"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <VoiceRecorder onTranscriptReceived={handleTranscript} />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="icon"
          variant="secondary"
          className="h-10 w-10 rounded-full flex-shrink-0"
          disabled={disabled}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mesajınızı yazın..."
          className="min-h-[40px] max-h-[120px] resize-none bg-secondary/50 border-border"
          disabled={disabled}
          rows={1}
        />

        <Button
          onClick={handleSend}
          size="icon"
          disabled={(!message.trim() && !selectedFile) || disabled}
          className="h-10 w-10 rounded-full flex-shrink-0 bg-primary hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};