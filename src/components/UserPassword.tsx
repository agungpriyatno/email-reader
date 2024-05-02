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
import { updateIdPassword } from "@/lib/schemas/updatePassword";
import { userIdUpdatePassword } from "@/lib/actions/userAuthAction";

type UserPasswordProps = {
  id: string;
  children?: React.ReactNode;
  onActionSuccess?: () => void;
};

const UserPassword = ({ id, children, onActionSuccess }: UserPasswordProps) => {
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
      await userIdUpdatePassword(id, val);
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
        <DialogTitle>Update Password</DialogTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
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
            <SubmitButton submitting={isSubmitting}>Update</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { UserPassword };
