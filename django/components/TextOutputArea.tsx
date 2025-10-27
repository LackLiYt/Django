import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button1";
import { Card } from "@/components/ui/card1";
import { useToast } from "@/app/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TextOutputAreaProps {
  extractedText: string;
  markdownText?: string;
  sourceName?: string;
}

export default function TextOutputArea({ extractedText, markdownText, sourceName = "document" }: TextOutputAreaProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Use markdown text if available, otherwise use plain text
  const contentToRender = markdownText || extractedText;
  
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

  const handleDownload = (format: 'txt' | 'md') => {
    const content = format === 'md' && markdownText ? markdownText : extractedText;
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    const extension = format === 'md' ? 'md' : 'txt';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName.replace(/\.(pdf|docx?|pptx?|xlsx?|txt|md|html|csv)$/i, '')}-extracted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Your ${format === 'md' ? 'Markdown' : 'text'} file is being downloaded`,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Extracted Text</h3>
          <div
            className="w-full min-h-96 max-h-[600px] p-6 rounded-md border bg-background overflow-auto prose prose-sm dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-foreground prose-p:mb-4 prose-li:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4 prose-blockquote:border-primary prose-blockquote:italic prose-a:text-primary prose-a:underline hover:prose-a:opacity-80 prose-strong:text-foreground prose-strong:font-bold prose-em:text-foreground prose-em:italic"
            data-testid="text-output"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Customize heading styles
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
                // Customize paragraph
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                // Customize lists
                ul: ({node, ...props}) => <ul className="mb-4 ml-6 list-disc" {...props} />,
                ol: ({node, ...props}) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                // Customize code
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono" {...props} />
                  ) : (
                    <code className="block p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto" {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="mb-4" {...props} />,
                // Customize blockquotes
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic" {...props} />,
                // Customize links
                a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                // Customize tables
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-4">
                    <table className="border-collapse border border-border" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => <thead className="bg-muted" {...props} />,
                th: ({node, ...props}) => <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />,
                td: ({node, ...props}) => <td className="border border-border px-4 py-2" {...props} />,
                // Customize horizontal rule
                hr: ({node, ...props}) => <hr className="my-6 border-border" {...props} />,
                // Customize images
                img: ({node, ...props}) => (
                  <img className="max-w-full h-auto rounded-lg my-4" {...props} />
                ),
              }}
            >
              {contentToRender}
            </ReactMarkdown>
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col gap-4">
        <Button
          onClick={handleCopy}
          className="w-full bg-gradient-to-br from-primary to-secondary text-primary-foreground"
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
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => handleDownload('txt')}
            className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground"
            data-testid="button-download-txt"
          >
            <Download className="w-4 h-4 mr-2" />
            Download as TXT
          </Button>
          {markdownText && (
            <Button
              onClick={() => handleDownload('md')}
              className="flex-1 bg-gradient-to-r from-secondary via-accent to-primary text-primary-foreground"
              data-testid="button-download-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Download as MD
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
