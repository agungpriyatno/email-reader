"use client";

import { clientRemove } from "@/lib/actions/clientAction";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { clientImapRemove } from "@/lib/actions/clientImapAction";

type ClientImapDeleteProps = {
  clientId: string;
  imapId: string;
  onActionSuccess?: () => void;
};

const ClientImapDelete = ({ clientId, imapId, onActionSuccess }: ClientImapDeleteProps) => {
  const onSubmit = async () => {
    try {
      await clientImapRemove(clientId, imapId);
      toast("OK");
      onActionSuccess && onActionSuccess();
    } catch (err) {
      toast("FAIL");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"default"}>
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ClientImapDelete };
