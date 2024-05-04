"use server";

import db from "../db";
import clientImapRepo from "../repositories/clientImapRepo";
import { clientSession } from "./clientAuthAction";

const clientImapRemove = async (clientId: string, imapId: string) => {
  await clientImapRepo.remove(clientId, imapId);
};

const clientImapUpdate = async (
  clientId: string,
  imapId: string,
  expiredTime: string
) => {
  const date = new Date(Date.parse(expiredTime));
  await db.clientImap.update({
    where: { clientId_imapId: { clientId, imapId } },
    data: { expiredTime: date },
  });
};

const clientImapCreateMany = async (
  id: string,
  payload: { imapId: string; expiredTime: string }[]
) => {
  const data = payload.map(({ imapId, expiredTime }) => {
    const date = new Date(Date.parse(expiredTime));
    return { clientId: id, imapId, expiredTime: date };
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
  const data = resp.map(({ expiredTime, imap }) => {
    return { expiredTime, ...imap };
  });
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
  const resp = await clientImapRepo.findManyExpired(user.data.id, {
    take,
    skip,
    search,
  });
  const total = await clientImapRepo.count(user.data.id);
  const totalPage = Math.ceil(total / take);
  const data = resp.map(({ expiredTime, imap }) => {
    return { expiredTime, ...imap };
  });
  return { data, total, totalPage, currentPage: page };
};

const clientImapFindManyNotID = async ({
  id,
  search,
}: {
  id: string;
  search: string;
}) => {
  const data = await db.imap.findMany({
    take: 20,
    where: {
      AND: [
        { NOT: { clients: { some: { clientId: id } } } },
        { OR: [{ user: { contains: search } }] },
      ],
    },
  });

  return { data };
};

const clientImapFindManyID = async (
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
  const resp = await clientImapRepo.findManyNotID(id, {
    take,
    skip,
    search,
  });
  const total = await clientImapRepo.count(id);
  const totalPage = Math.ceil(total / take);
  const filter = resp.filter((item) => {
    if (item.imap.user === "muscle@shinki.id") {
      console.log(item);
      return false;
    }
    return true;
  });
  const data = resp.map(({ expiredTime, imap }) => {
    return { expiredTime, ...imap };
  });
  return { data, total, totalPage, currentPage: page };
};

export {
  clientImapUpdate,
  clientImapCreateMany,
  clientImapFindMany,
  clientImapRemove,
  clientImapFindManySession,
  clientImapFindManyID,
  clientImapFindManyNotID,
};
