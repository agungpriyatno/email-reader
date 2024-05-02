"use client";

import Link from "next/link";
import { useClientUpdatePassword } from "./hooks/client-auth";
import { SubmitButton } from "./ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "./ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const UpdatePasswordForm = () => {
  const { form, submit } = useClientUpdatePassword();
  const {
    control,
    formState: { isSubmitting },
  } = form;
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={submit} className="grid gap-4">
            <FormField
              control={control}
              name={"old"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input type={'password'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={"new"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type={'password'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton submitting={isSubmitting}>UPDATE</SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { UpdatePasswordForm };
