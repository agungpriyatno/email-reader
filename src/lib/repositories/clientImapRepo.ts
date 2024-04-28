import { Prisma } from "@prisma/client";
import db from "../db";

const createMany = (data: Prisma.ClientImapCreateManyInput[]) => {
  return db.clientImap.createMany({ data });
};

const count = (id: string) => {
  return db.clientImap.count({ where: { clientId: id } });
};

const remove = (clientId: string, imapId: string) => {
  return db.clientImap.delete({
    where: { clientId_imapId: { clientId, imapId } },
  });
};

const findMany = (
  id: string,
  {
    take,
    skip,
    search,
  }: {
    take: number;
    skip: number;
    search: string;
  }
) => {
  return db.clientImap.findMany({
    take,
    skip,
    include: { imap: true },
    where: {
      AND: [
        { clientId: id },
        {
          OR: [{ imap: { user: { contains: search } } }],
        },
      ],
    },
  });
};

const findManyExpired = (
  id: string,
  {
    take,
    skip,
    search,
  }: {
    take: number;
    skip: number;
    search: string;
  }
) => {
  const today = new Date();
  return db.clientImap.findMany({
    take,
    skip,
    include: { imap: true },
    where: {
      AND: [
        { clientId: id, expiredTime: { gte: today } },
        {
          OR: [{ imap: { user: { contains: search } } }],
        },
      ],
    },
  });
};
const clientImapRepo = {
  findManyExpired,
  createMany,
  findMany,
  remove,
  count,
};

export default clientImapRepo;
