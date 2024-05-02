"use client";

import {
  userSession,
  userSignIn,
  userSignUp,
  userUpdatePassword,
} from "@/lib/actions/userAuthAction";
import clientAuthSchema from "@/lib/schemas/clientAuthSchema";
import userAuthSchema from "@/lib/schemas/userAuthSchema";
import userSchema from "@/lib/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const useUserSignIn = () => {
  const schema = userAuthSchema.signIn;

  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (value) => {
    try {
      const { data } = await userSignIn(value);
      localStorage.setItem("user_session", data.accessToken);
      router.push("/backoffice/dashboard");
      toast("OK");
    } catch (error) {
      console.log(error);
      toast("FAIL");
    }
  });

  return {
    schema,
    form,
    submit,
  };
};

const useUserSignUp = () => {
  const schema = userSchema.create;

  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (value) => {
    try {
      await userSignUp(value);
      toast("OK");
      router.push("/backoffice/signin");
    } catch (error) {
      console.log(error);
      toast("FAIL");
    }
  });

  return {
    schema,
    form,
    submit,
  };
};

const useUserSession = () => {
  const accessToken = localStorage.getItem("user_session");
  const fetcher = async () => {
    if (!accessToken) throw new ApiError(401, "UNAUTHORIZED");
    return await userSession(accessToken ?? "");
  };

  const query = useQuery({
    queryKey: [""],
    queryFn: fetcher,
    refetchInterval: 5000,
  });

  return query;
};

const useUserUpdatePassword = () => {
  const schema = clientAuthSchema.updatePassword;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      old: "",
      new: "",
    },
  });

  const submit = form.handleSubmit(async (value) => {
    try {
      const token = localStorage.getItem("user_session");
      await userUpdatePassword(token ?? "", value);
      toast("OK");
      form.reset();
    } catch (error) {
      if (error instanceof ApiError) {
      }
      toast("FAIL");
      console.log(error);
    }
  });

  return {
    schema,
    form,
    submit,
  };
};

export {
  useUserSession,
  useUserSignIn,
  useUserSignUp,
  useUserUpdatePassword,
};
