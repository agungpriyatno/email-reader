"use client";

import { clientCreate, clientUpdate } from "@/lib/actions/clientAction";
import clientSchema from "@/lib/schemas/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client, Imap } from "@prisma/client";
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
import { Input, InputPassword } from "./ui/input";
import imapSchema from "@/lib/schemas/imapSchema";
import { imapCreate, imapUpdate } from "@/lib/actions/imapAction";

type ImapCreateUpdateProps = {
  children?: React.ReactNode;
  data?: Imap;
  onActionSuccess?: () => void;
};

const ImapCreateUpdate = ({
  children,
  data,
  onActionSuccess,
}: ImapCreateUpdateProps) => {
  const createSchema = imapSchema.create;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      user: data?.user ?? "",
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
      if (data) await imapUpdate(data.id, val);
      if (!data) await imapCreate(val);
      if (!data) reset();
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
        <DialogTitle>
          {data != undefined ? "Edit Client" : "New Client"}
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton submitting={isSubmitting}>
              {data != undefined ? "Edit" : "Add"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ImapCreateUpdate };
