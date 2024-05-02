"use client";

import { useUserUpdatePassword } from "./hooks/user-auth";
import { SubmitButton } from "./ui/button";
import {
  Card,
  CardContent,
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

const UserUpdatePassword = () => {
  const { form, submit } = useUserUpdatePassword();
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

export { UserUpdatePassword };
