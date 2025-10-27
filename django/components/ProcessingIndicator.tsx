import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  message?: string;
}

export default function ProcessingIndicator({ message = "Extracting text from PDF..." }: ProcessingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" data-testid="processing-indicator">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground" data-testid="text-processing-message">{message}</p>
    </div>
  );
}
