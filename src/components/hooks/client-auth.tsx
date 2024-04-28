"use client";

import { clientSession, clientSignIn, clientSignUp } from "@/lib/actions/clientAuthAction";
import clientAuthSchema from "@/lib/schemas/clientAuthSchema";
import clientSchema from "@/lib/schemas/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useClientSignIn = () => {
  const schema = clientAuthSchema.signIn;

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
      const { data } = await clientSignIn(value);
      localStorage.setItem("client_session", data.accessToken);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
      }
      console.log(error);
    }
  });

  return {
    schema,
    form,
    submit,
  };
};

const useClientSignUp = () => {
  const schema = clientSchema.create;

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
      await clientSignUp(value);
      router.push("/backoffice/signin");
    } catch (error) {
      if (error instanceof ApiError) {
      }
      console.log(error);
    }
  });

  return {
    schema,
    form,
    submit,
  };
};

const useClientSession = () => {
  const accessToken = localStorage.getItem("user_session");
  const fetcher = async () => {
    return await clientSession(accessToken ?? "");
  };

  const query = useQuery({
    queryKey: [""],
    queryFn: fetcher,
  });

  return query;
};

export { useClientSession, useClientSignIn, useClientSignUp };

