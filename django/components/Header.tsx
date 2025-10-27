import { FileText } from "lucide-react";
import ProfileMenu from "@/components/ProfileMenu";

interface HeaderProps {
  onShowHistory: () => void;
}

export default function Header({ onShowHistory }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-primary to-secondary">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PDFExtract
              </h1>
              <p className="text-xs text-muted-foreground">Text Converter</p>
            </div>
          </div>
          
          <ProfileMenu onShowHistory={onShowHistory} />
        </div>
      </div>
    </header>
  );
}
