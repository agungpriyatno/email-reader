"use server";

import { z } from "zod";
import clientSchema from "../schemas/clientSchema";
import { ApiError } from "next/dist/server/api-utils";
import bcrypt from "../bcrypt";
import clientRepo from "../repositories/clientRepo";
import clientImapRepo from "../repositories/clientImapRepo";

const createSchema = clientSchema.create;
const updateSchema = clientSchema.update;

const clientFind = async (id: string) => {
  const data = await clientRepo.find(id);
  return { data };
};

const clientFindMany = async ({
  page,
  take,
  search,
}: {
  page: number;
  take: number;
  search: string;
}) => {
  const skip = (page - 1) * take;
  const data = await clientRepo.findMany({ take, skip, search });
  const total = await clientRepo.count();
  const totalPage = Math.ceil(total / take);
  return { data, total, totalPage, currentPage: page };
};

const clientCreate = async (
  payloadA: z.infer<typeof createSchema>,
  payloadB?: string[]
) => {
  const { success } = createSchema.safeParse(payloadA);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const { password, imaps, ...others } = payloadA;
  const hash = await bcrypt.hash(password, 10);
  const data = await clientRepo.create({ ...others, hash });
  if (payloadB) {
    const imaps = payloadB.map((val) => {
      return { imapId: val, clientId: data.id };
    });
    await clientImapRepo.createMany(imaps);
  }
};

const clientUpdate = async (
  id: string,
  payloadA: z.infer<typeof updateSchema>,
  payloadB?: string[]
) => {
  const { success } = updateSchema.safeParse(payloadA);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const data = await clientRepo.update(id, payloadA);
  if (payloadB) {
    const imaps = payloadB.map((val) => {
      return { imapId: val, clientId: data.id };
    });
    await clientImapRepo.createMany(imaps);
  }
};

const clientRemove = async (id: string) => {
  await clientRepo.remove(id);
};

export { clientFind, clientFindMany, clientCreate, clientUpdate, clientRemove };
