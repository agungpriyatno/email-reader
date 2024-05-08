"use client";

import { updateFilter } from "@/lib/actions/filterAction";
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

const schema = z.object({ name: z.string().min(1).max(255) });

type FilterUpdateProps = {
  children?: React.ReactNode;
  data: string;
  id: string;
  onActionSuccess?: () => void;
};

const FilterUpdate = ({
  children,
  id,
  data,
  onActionSuccess,
}: FilterUpdateProps) => {
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data,
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
      updateFilter(id, val.name);
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
        <DialogTitle>Update Filter</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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

export { FilterUpdate };
