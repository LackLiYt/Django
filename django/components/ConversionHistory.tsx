import { FileText, Download, X, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card1";
import { Button } from "@/components/ui/button1";
import { ScrollArea } from "@/components/ui/scroll-area1";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConversionRecord {
  id: string;
  fileName: string;
  date: string;
  textPreview: string;
  fullText: string;
}

interface ConversionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversionRecord[];
  onDelete: (id: string) => void;
  onRestore: (record: ConversionRecord) => void;
}

export default function ConversionHistory({
  isOpen,
  onClose,
  history,
  onDelete,
  onRestore,
}: ConversionHistoryProps) {
  const handleDownload = (record: ConversionRecord) => {
    const blob = new Blob([record.fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.fileName.replace('.pdf', '')}-extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conversion History</DialogTitle>
        </DialogHeader>
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No conversion history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your converted PDFs will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {history.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium font-mono text-sm truncate mb-1">
                        {record.fileName}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {record.date}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {record.textPreview}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRestore(record)}
                        data-testid={`button-restore-${record.id}`}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload(record)}
                        data-testid={`button-download-${record.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(record.id)}
                        data-testid={`button-delete-${record.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
