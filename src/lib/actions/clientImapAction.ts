"use server";

import clientImapRepo from "../repositories/clientImapRepo";
import { clientSession } from "./clientAuthAction";

const clientImapRemove = async (clientId: string, imapId: string) => {
  await clientImapRepo.remove(clientId, imapId);
};

const clientImapCreateMany = async (
  id: string,
  payload: { imapId: string }[]
) => {
  const data = payload.map(({ imapId }) => {
    return { clientId: id, imapId };
  });
  await clientImapRepo.createMany(data);
};

const clientImapFindMany = async (
  id: string,
  {
    page,
    take,
    search,
  }: {
    page: number;
    take: number;
    search: string;
  }
) => {
  const skip = (page - 1) * take;
  const resp = await clientImapRepo.findMany(id, { take, skip, search });
  const total = await clientImapRepo.count(id);
  const totalPage = Math.ceil(total / take);
  const data = resp.map((item) => item.imap);
  return { data, total, totalPage, currentPage: page };
};

const clientImapFindManySession = async (
  token: string,
  {
    page,
    take,
    search,
  }: {
    page: number;
    take: number;
    search: string;
  }
) => {
  const user = await clientSession(token);
  const skip = (page - 1) * take;
  const resp = await clientImapRepo.findMany(user.data.id, { take, skip, search });
  const total = await clientImapRepo.count(user.data.id);
  const totalPage = Math.ceil(total / take);
  const data = resp.map((item) => item.imap);
  return { data, total, totalPage, currentPage: page };
};

export { clientImapCreateMany, clientImapFindMany, clientImapRemove, clientImapFindManySession };
