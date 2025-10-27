import { User, History, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileMenuProps {
  onShowHistory: () => void;
}

export default function ProfileMenu({ onShowHistory }: ProfileMenuProps) {
  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          data-testid="button-profile"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onShowHistory} data-testid="menu-history">
          <History className="w-4 h-4 mr-2" />
          Conversion History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} data-testid="menu-settings">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
