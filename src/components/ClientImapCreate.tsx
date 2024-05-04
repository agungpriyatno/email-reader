"use client";

import {
  clientImapCreateMany
} from "@/lib/actions/clientImapAction";
import clientImapSchema from "@/lib/schemas/clientImapSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, SubmitButton } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { SelectSearch } from "./ui/select-search";

type ClientImapCreateProps = {
  id: string;
  children?: React.ReactNode;
  onActionSuccess?: () => void;
};

type TData = {
  data: {
    id: string;
    user: string;
  };
};

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const ClientImapCreate = ({
  id,
  children,
  onActionSuccess,
}: ClientImapCreateProps) => {
  const createSchema = clientImapSchema.create;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      imaps: [
        { imapId: "", user: "", expiredTime: "" },
      ],
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
    name: "imaps",
    control: form.control,
  });

  const onSubmit = handleSubmit(async (val) => {
    try {
      await clientImapCreateMany(id, val.imaps);
      reset();
      toast("OK");
      setModal(false);
      onActionSuccess && onActionSuccess();
    } catch (error) {
      toast("FAIL");
    }
  });

  const getValueId = (val: string) => {
   return  getValues().imaps.find((item) => item.imapId === val )
  }

  const onOpenChange = (val: boolean) => {
    setModal(val);
  };

  return (
    <Dialog open={showModal} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-screen overflow-y-auto">
        <DialogTitle>New Client Imap</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            {fields.map((item, i) => (
              <React.Fragment key={i}>
                <FormField
                  control={form.control}
                  name={`imaps.${i}.imapId`}
                  key={item.id}
                  render={({ field }) => (
                    <div className="flex gap-3 w-full relative">
                      <FormItem className="flex-1 w-full">
                        <SelectSearch id={id} whitelist={getValues().imaps} index={i} value={getValueId(field.value)?.user ?? ""} onChange={(ids, user) => {
                          setValue(`imaps.${i}.imapId`, ids)
                          setValue(`imaps.${i}.user`, user)
                        }}/>
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
                <FormField
                  control={form.control}
                  name={`imaps.${i}.expiredTime`}
                  key={item.id}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl className="w-full flex">
                        <Input
                          className="w-full"
                          type={"date"}
                          placeholder="Expired Time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))}

            <div className="flex w-full gap-3 place-items-center">
              <div className=" h-10 w-full bg-muted rounded"></div>
              <Button
                type="button"
                onClick={() => append({ imapId: "", expiredTime: "", user: "" })}
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

export { ClientImapCreate };
