"use client";

import { createBatchEmail } from "@/lib/actions/generateAction";
import { updateIdPassword } from "@/lib/schemas/updatePassword";
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
import { Textarea } from "./ui/textarea";

type ClientCreateBatchProps = {
  children?: React.ReactNode;
  onActionSuccess?: () => void;
};

const ClientCreateBatch = ({  children, onActionSuccess }: ClientCreateBatchProps) => {
  const createSchema = updateIdPassword;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      password: "",
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
      await createBatchEmail(val);
      reset();
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
        <DialogTitle>Create Batch</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Email</FormLabel>
                  <FormControl>
                    <Textarea rows={15} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton submitting={isSubmitting}>Create</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ClientCreateBatch };
