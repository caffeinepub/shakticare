import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  currentPage: AppPage;
  navigate: (path: string) => void;
}

const pageTitles: Record<AppPage, string> = {
  "/": "Thozhi",
  "/sos": "🆘 SOS Emergency",
  "/diet": "🥗 Health & Diet",
  "/first-aid": "🩹 First Aid",
  "/workouts": "🧘 Workouts",
  "/services": "🏥 Local Services",
};

export function Header({ currentPage, navigate }: HeaderProps) {
  const {
    login,
    clear,
    isLoggingIn,
    isLoginSuccess,
    identity,
    isInitializing,
  } = useInternetIdentity();
  const [loginOpen, setLoginOpen] = useState(false);

  const isLoggedIn = isLoginSuccess && !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "";

  const handleLogin = () => {
    setLoginOpen(false);
    login();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Helpline Marquee Banner */}
      <div className="bg-primary text-primary-foreground py-1 px-4 overflow-hidden text-xs font-medium">
        <div className="marquee-track inline-block">
          📞 Tamil Nadu Women's Helpline: 181 &nbsp;|&nbsp; Emergency: 108
          &nbsp;|&nbsp; Police: 100 &nbsp;|&nbsp; Child Helpline: 1098
          &nbsp;|&nbsp; Domestic Violence: 181 &nbsp;|&nbsp; Tamil Nadu Women's
          Helpline: 181 &nbsp;|&nbsp; Emergency: 108 &nbsp;|&nbsp; Police: 100
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo & Title */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
          data-ocid="nav.home_tab"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm ring-2 ring-primary/20">
            <img
              src="/assets/generated/shakticare-logo-transparent.dim_200x200.png"
              alt="Thozhi Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-lg text-primary leading-none">
              Thozhi
            </h1>
            <p className="text-xs text-muted-foreground leading-none">
              {pageTitles[currentPage] !== "Thozhi"
                ? pageTitles[currentPage]
                : "Your Health & Safety Companion"}
            </p>
          </div>
          <div className="block sm:hidden">
            <h1 className="font-display font-bold text-base text-primary leading-none">
              {pageTitles[currentPage]}
            </h1>
          </div>
        </button>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isInitializing ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {shortPrincipal.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-foreground max-w-24 truncate">
                    {shortPrincipal}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="truncate text-xs">{shortPrincipal}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clear}
                  className="gap-2 text-destructive focus:text-destructive"
                  data-ocid="auth.logout_button"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => setLoginOpen(true)}
              className="gap-1.5 text-xs px-3 rounded-full"
              data-ocid="auth.login_button"
            >
              {isLoggingIn ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <LogIn className="h-3 w-3" />
              )}
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-sm rounded-2xl" data-ocid="auth.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-center text-primary">
              Welcome to Thozhi
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-2">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 shadow-md">
              <img
                src="/assets/generated/shakticare-logo-transparent.dim_200x200.png"
                alt="Thozhi"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in with Internet Identity to save your emergency contacts,
                personal diet notes, and more.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can also browse as a guest without signing in.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full rounded-xl gap-2"
                data-ocid="auth.login_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {isLoggingIn
                  ? "Signing in..."
                  : "Sign In with Internet Identity"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLoginOpen(false)}
                className="w-full rounded-xl text-muted-foreground"
                data-ocid="auth.cancel_button"
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
