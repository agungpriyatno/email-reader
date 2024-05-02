"use client";

import { useUserSignIn } from "./hooks/user-auth";
import { SubmitButton } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input, InputPassword } from "./ui/input";

const UserSignInForm = () => {
  const { form, submit } = useUserSignIn();
  const {
    control,
    formState: { isSubmitting },
  } = form;
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">SIGN IN</CardTitle>
        <CardDescription>
          Enter your email below to sign to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={submit} className="grid gap-4">
            <FormField
              control={control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={"password"}
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
            <SubmitButton submitting={isSubmitting}>SIGN IN</SubmitButton>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter>
        <div className="mt-4 text-center text-sm w-full">
          Don&apos;t have an account?{" "}
          <Link href="/backoffice/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export { UserSignInForm };
