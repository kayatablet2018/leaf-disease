import { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscriptReceived: (transcript: string) => void;
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const VoiceRecorder = ({ onTranscriptReceived }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'tr-TR';

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Please speak now.",
      });
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      if (event.results[event.results.length - 1].isFinal) {
        onTranscriptReceived(transcript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') {
        return; // Kullanıcı manuel durdurunca gelen hatayı gösterme
      }
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscriptReceived, toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start recognition:", error);
        toast({
          title: "Initialization Error",
          description: "Speech recognition failed to initialize.",
          variant: "destructive",
        });
      }
    }
  };

  if (!SpeechRecognition) {
     return (
      <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full" disabled>
        <Mic className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleRecording}
      size="icon"
      variant={isRecording ? "destructive" : "secondary"}
      className="h-10 w-10 rounded-full transition-colors"
    >
      <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
    </Button>
  );
};
