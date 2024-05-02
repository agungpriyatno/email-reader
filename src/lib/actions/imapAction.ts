"use server";

import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import imapRepo from "../repositories/imapRepo";
import imapSchema from "../schemas/imapSchema";
import { revalidatePath } from "next/cache";

const createSchema = imapSchema.create;
const updateSchema = imapSchema.update;

const imapFind = async (id: string) => {
  const data = await imapRepo.find(id);
  return { data };
};

const imapFindMany = async ({
  page,
  take,
  search,
}: {
  page: number;
  take: number;
  search: string;
}) => {
  const skip = (page - 1) * take;
  const data = await imapRepo.findMany({ take, skip, search });
  const total = await imapRepo.count();
  const totalPage = Math.ceil(total / take);
  return { data, total, totalPage, currentPage: page };
};

const imapCreate = async (payload: z.infer<typeof createSchema>) => {
  const { success } = createSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  await imapRepo.create(payload);
  revalidatePath("/backoffice/dashboard");
};

const imapUpdate = async (
  id: string,
  payload: z.infer<typeof updateSchema>
) => {
  const { success } = createSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  await imapRepo.update(id, payload);
};

const imapRemove = async (id: string) => {
  await imapRepo.remove(id);
  revalidatePath("/backoffice/dashboard");
  
};

export { imapCreate, imapFind, imapFindMany, imapRemove, imapUpdate };
