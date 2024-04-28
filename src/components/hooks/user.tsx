import userAction from "@/lib/actions/userAction";
import userSchema from "@/lib/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useCreateUpdate = () => {
  const [selected, setSelected] = useState<User>();

  const form = useForm<z.infer<typeof userSchema.create>>({
    resolver: zodResolver(userSchema.create),
  });

  const fetcher = async () => {
    userAction.findMany({ take: 10, skip: 0, search: "" });
  };

  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetcher,
  });

  const create = form.handleSubmit(async (value) => {
    userAction.create(value);
    try {
    } catch (error) {}
  });
};
