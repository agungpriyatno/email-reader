"use client";

import { clientImapCreateMany, clientImapFindManyID, clientImapFindManyNotID } from "@/lib/actions/clientImapAction";
import { imapFindMany, imapFindManyWithout } from "@/lib/actions/imapAction";
import clientImapSchema from "@/lib/schemas/clientImapSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { DeleteIcon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, SubmitButton } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ClientImapCreateProps = {
  id: string;
  children?: React.ReactNode;
  onActionSuccess?: () => void;
};

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
      imaps: [{ imapId: "" }],
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { append, fields, remove } = useFieldArray({
    name: "imaps",
    control: form.control,
  });

  const [search, setSearch] = useState("");

  const fetcher = async () => {
    return await clientImapFindManyNotID({ id, search });
  };

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["imap-list-select"],
    queryFn: fetcher,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    refetch();
  };

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

  const onOpenChange = (val: boolean) => {
    setModal(val)
    if (val) {
      refetch()
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
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
                    <div className="flex gap-3 w-full">
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full flex">
                            <SelectTrigger className="w-full flex-1">
                              <SelectValue placeholder="Search Imap" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent onClick={(e) => e.stopPropagation()}>
                            <Input
                              className="mb-2"
                              placeholder="Search"
                              defaultValue={search}
                              onChange={onChange}
                            />
                            {!isLoading &&
                              data?.data.map((item, i) => (
                                <SelectItem
                                  key={i}
                                  value={item.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {item.user}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                      <Button
                        type="button"
                        onClick={() => remove(fields.length - 1)}
                        size={"icon"}
                        variant={"destructive"}
                        className="flex-shrink-0"
                      >
                        <Trash2Icon/>
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
                onClick={() => append({ imapId: "", expiredTime: "" })}
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
