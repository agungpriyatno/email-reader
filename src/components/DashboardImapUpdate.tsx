"use client";

import { updateClientImap } from "@/lib/actions/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SubmitButton } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { SelectSearch, SelectSearch2 } from "./ui/select-search";

type DashboardImapUpdateProps = {
  imapId: string;
  clientId: string;
  children?: React.ReactNode;
  onActionSuccess?: () => Promise<void>;
};

export const schema = z.object({
  imapId: z.string().min(1).max(255),
  clientId: z.string().min(1).max(255),
  newImapId: z.string().min(1).max(255),
  newImapName: z.string().min(1).max(255),
});

const DashboardImapUpdate = ({
  imapId,
  clientId,
  children,
  onActionSuccess,
}: DashboardImapUpdateProps) => {
  const createSchema = schema;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      imapId: imapId,
      clientId: clientId,
      newImapId: "",
      newImapName: "",
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (val) => {
    try {
      await updateClientImap(val);
      reset();
      toast("OK");
      onActionSuccess && await onActionSuccess();
      setModal(false);
    } catch (error) {
      toast("FAIL");
    }
  });

  const onOpenChange = (val: boolean) => {
    setModal(val);
  };

  return (
    <Dialog open={showModal} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-screen overflow-y-auto">
        <DialogTitle>Update Subcription</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name={`newImapId`}
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <SelectSearch2
                    index={1}
                    id={clientId}
                    whitelist={[]}
                    value={getValues("newImapName")}
                    onChange={(id, user) => {
                      setValue("newImapId", id);
                      setValue("newImapName", user);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton submitting={isSubmitting}>Add</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { DashboardImapUpdate };
