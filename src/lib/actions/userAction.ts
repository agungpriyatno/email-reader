"use server";

import { z } from "zod";
import userSchema from "../schemas/userSchema";
import { ApiError } from "next/dist/server/api-utils";
import bcrypt from "../bcrypt";
import userRepo from "../repositories/userRepo";

const createSchema = userSchema.create;
const updateSchema = userSchema.update;

const userFind = async (id: string) => {
  const data = await userRepo.find(id);
  return { data };
};

const userFindMany = async ({
  page,
  take,
  search,
}: {
  page: number;
  take: number;
  search: string;
}) => {
  const skip = (page - 1) * take;
  const data = await userRepo.findMany({ take, skip, search });
  const total = await userRepo.count();  
  const totalPage = Math.ceil(total / take)
  return { data, total, totalPage, currentPage: page };
};

const userCreate = async (payload: z.infer<typeof createSchema>) => {
  const { success } = createSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const { password, ...others } = payload;
  const hash = await bcrypt.hash(password, 10);
  await userRepo.create({ ...others, hash });
};

const userUpdate = async (
  id: string,
  payload: z.infer<typeof updateSchema>
) => {
  const { success } = updateSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  await userRepo.update(id, payload);
};

const userRemove = async (id: string) => {
  await userRepo.remove(id);
};

export { userFind, userFindMany, userCreate, userUpdate, userRemove };
