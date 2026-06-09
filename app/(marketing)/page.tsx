// app/(marketing)/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  KeyRound, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  UserPlus 
} from "lucide-react";

export default function AdvancedDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">System Controls</h1>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" /> Advanced Demo
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Interact with Shadcn's deep-tier keyboard, modal, and secure input structures.
          </p>
        </div>

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* 1. THE COMMAND COMPONENT (Embedded In-Line Search) */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4 text-muted-foreground" /> Quick Command Menu
              </CardTitle>
              <CardDescription>
                An inline workspace search engine. Click items or try typing to filter.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Command className="rounded-lg border shadow-sm">
                <CommandInput placeholder="Type a command or search team..." />
                <CommandList className="max-h-[160px]">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Invite Team Member</span>
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      <Terminal className="mr-2 h-4 w-4" />
                      <span>Open API Terminal</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>

          {/* 2. SECURITY CARD (Featuring Input OTP & Dialog) */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-4 w-4 text-muted-foreground" /> Identity Verification
              </CardTitle>
              <CardDescription>
                Confirm critical access using standard 2-Factor Authentication layouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input OTP Component */}
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 border border-dashed rounded-lg space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Enter Verification Code</span>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Action Triggering a Dialog Modality */}
              <Dialog>
                <DialogTrigger>
                  <Button variant="destructive" className="w-full gap-2">
                    <ShieldAlert className="h-4 w-4" /> Revoke All Security Tokens
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently log out all active user sessions and terminate immediate API authentications.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Confirm Revocation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

        </div>

        {/* 3. SETTINGS MATRIX BLOCK (Featuring Switch, Tooltip, and Sheet) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workspace Preferences</CardTitle>
            <CardDescription>
              Toggle granular environmental operations and overlay dynamic flyouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Interactive Switch with Tooltip */}
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Strict Production Environment</span>
                  <Tooltip>
                    <TooltipTrigger className="text-muted-foreground hover:text-foreground text-xs border rounded-full h-4 w-4 inline-flex items-center justify-center font-serif">
                      ?
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Forces rigorous verification workflows across all live deployment clusters.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prevent experimental builds from running inside main execution branches.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            {/* Slide-out Sheet Trigger */}
            <Sheet>
              <SheetTrigger>
                <Button variant="outline" className="w-full">
                  Open Advanced Audit Log Sheet
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Workspace Audit Logs</SheetTitle>
                  <SheetDescription>
                    Review tracking entries detailing chronological events across system primitives.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="rounded-md bg-muted p-4 text-xs font-mono text-muted-foreground">
                    [2026-06-08 09:29:41] - User modified configuration variables via preset template rules.
                  </div>
                  <div className="rounded-md bg-muted p-4 text-xs font-mono text-muted-foreground">
                    [2026-06-08 09:25:12] - Security token handshake completed smoothly over TLS.
                  </div>
                </div>
              </SheetContent>
            </Sheet>

          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}