import { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage, Message } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useToast } from '@/hooks/use-toast';

type ConnectionState = 'connected' | 'disconnected' | 'connecting';

const API_URL = 'http://127.0.0.1:5001';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you? You can upload an image for leaf disease detection or ask general questions.',
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('connecting');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      setConnectionStatus('connecting');
      try {
        let storedSessionId = localStorage.getItem('sessionId');

        if (storedSessionId) {
          setSessionId(storedSessionId);
          setConnectionStatus('connected');
          console.log('Using stored session ID:', storedSessionId);
          return;
        }

        const response = await fetch(`${API_URL}/chatbot/chat_session`);
        if (!response.ok) {
          throw new Error('Failed to fetch session ID');
        }
        const newSessionId = await response.json();
        
        setSessionId(newSessionId);
        localStorage.setItem('sessionId', newSessionId);
        setConnectionStatus('connected');
        toast({
          title: "Connection established",
          description: `A new session has been started.`,
        });

      } catch (error) {
        console.error("Connection error:", error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Could not connect to backend API. Please make sure it is working.",
          variant: "destructive",
        });
      }
    };

    fetchSession();
  }, [toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!sessionId) {
      toast({ title: "Error", description: "Session ID not found. Refresh the page.", variant: "destructive" });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      image: file ? URL.createObjectURL(file) : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      if (content) {
        formData.append('question', content);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`${API_URL}/chatbot/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Send message error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, an error occurred. Please try again or come back later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({ title: "Submission Error", description: "Your message could not be sent.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Chatbot</h1>
            <p className="text-xs text-muted-foreground">
              Leaf Disease Diagnosis Assistant
            </p>
          </div>
        </div>
        <ConnectionStatus status={connectionStatus} sessionId={sessionId} />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isProcessing && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Preparing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isProcessing || connectionStatus !== 'connected'}
      />
    </div>
  );
};

export default Index;
