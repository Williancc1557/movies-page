"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalChatsContext } from "@/context/globalChatContext";
import { useState } from "react";

export function NewChatDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setChats } = useGlobalChatsContext();

  const handle = async () => {
    setIsLoading(true);
    await fetch("/api/create-chat", {
      method: "POST",
    });
    setOpen(false);
    const response = await fetch("/api/get-all-chats", {
      method: "GET",
    });

    setChats(await response.json());
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-32">
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
          <DialogDescription>
            Create a new chat for your platform
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="My new chat" className="col-span-3" />
          </div> */}
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={async () => await handle()}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
