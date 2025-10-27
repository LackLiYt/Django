import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button1";
import { Card } from "@/components/ui/card1";
import { useToast } from "@/app/hooks/use-toast";

interface TextOutputAreaProps {
  extractedText: string;
}

export default function TextOutputArea({ extractedText }: TextOutputAreaProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your text file is being downloaded",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Extracted Text</h3>
          <div
            className="w-full min-h-96 p-4 rounded-md border bg-background font-mono text-sm leading-relaxed overflow-auto"
            data-testid="text-output"
          >
            {extractedText}
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleCopy}
          className="flex-1 bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          data-testid="button-copy"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground"
          data-testid="button-download"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as TXT
        </Button>
      </div>
    </div>
  );
}
