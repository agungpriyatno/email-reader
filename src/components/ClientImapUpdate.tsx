"use client";

import { clientImapUpdate } from "@/lib/actions/clientImapAction";
import clientImapSchema from "@/lib/schemas/clientImapSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SubmitButton } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type ClientImapUpdateProps = {
  children?: React.ReactNode;
  data: Date;
  clientId: string;
  imapId: string;
  onActionSuccess?: () => void;
};

const ClientImapUpdate = ({
  children,
  clientId,
  imapId,
  data,
  onActionSuccess,
}: ClientImapUpdateProps) => {
  const schema = clientImapSchema.update;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      expiredTime: data.toISOString().slice(0, 10),
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (val) => {
    try {
      clientImapUpdate(clientId, imapId, val.expiredTime);
      setModal(false);
      toast("OK");
      onActionSuccess && onActionSuccess();
    } catch (error) {
      toast("FAIL");
    }
  });

  return (
    <Dialog open={showModal} onOpenChange={setModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>Update Expired Time</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name={"expiredTime"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ExpiredTime</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton submitting={isSubmitting}>Edit</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ClientImapUpdate };
