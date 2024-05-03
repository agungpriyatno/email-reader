"use client";

import { userCreate, userUpdate } from "@/lib/actions/userAction";
import userSchema from "@/lib/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
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

type UserCreateUpdateProps = {
  children?: React.ReactNode;
  data?: User;
  onActionSuccess?: () => void;
};

const UserCreateUpdate = ({
  children,
  data,
  onActionSuccess,
}: UserCreateUpdateProps) => {
  const createSchema = userSchema.create;
  const [showModal, setModal] = useState(false);
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      password: data?.hash ?? "",
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
      if (data) await userUpdate(data.id, { name: val.name });
      if (!data) await userCreate(val);
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
          {data != undefined ? "Edit User" : "New User"}
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field: { ...props } }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...props} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {data === undefined && (
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <SubmitButton submitting={isSubmitting}>
              {data != undefined ? "Edit" : "Add"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { UserCreateUpdate };
