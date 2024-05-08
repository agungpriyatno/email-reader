"use client";

import { createFilter } from "@/lib/actions/filterAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, SubmitButton } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";

const schema = z.object({
  filter: z.array(z.object({ name: z.string().min(1).max(255) })),
});

type FilterCreateProps = {
  children?: React.ReactNode;
  onActionSuccess?: () => void;
};

const FilterCreate = ({ children, onActionSuccess }: FilterCreateProps) => {
  const createSchema = schema;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      filter: [{ name: "" }],
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

  const { append, fields, remove } = useFieldArray({
    name: "filter",
    control: form.control,
  });

  const onSubmit = handleSubmit(async (val) => {
    try {
      await createFilter(val.filter.map((item) => item.name));
      reset();
      toast("OK");
      setModal(false);
      onActionSuccess && onActionSuccess();
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
        <DialogTitle>New Filters</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            {fields.map((item, i) => (
              <React.Fragment key={i}>
                <FormField
                  control={form.control}
                  name={`filter.${i}.name`}
                  key={item.id}
                  render={({ field }) => (
                    <div className="flex gap-3 w-full relative">
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <Input placeholder="Subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Button
                        type="button"
                        onClick={() => remove(fields.length - 1)}
                        size={"icon"}
                        variant={"destructive"}
                        className="flex-shrink-0"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  )}
                />
              </React.Fragment>
            ))}

            <div className="flex w-full gap-3 place-items-center">
              <div className=" h-10 w-full bg-muted rounded"></div>
              <Button
                type="button"
                onClick={() => append({ name: "" })}
                size={"icon"}
                variant={"outline"}
              >
                <PlusIcon />
              </Button>
            </div>

            <SubmitButton submitting={isSubmitting}>Add</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { FilterCreate };
