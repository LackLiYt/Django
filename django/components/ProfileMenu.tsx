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
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileMenuProps {
  onShowHistory: () => void;
}

export default function ProfileMenu({ onShowHistory }: ProfileMenuProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      unsubscribe = () => subscription.unsubscribe();
    };
    init();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleSettings = () => {
    // no-op for now
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const initials = (user?.email || 'U')
    .split('@')[0]
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || 'U';

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
            <p className="text-sm font-medium">{user?.email || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">{user?.id || ''}</p>
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
