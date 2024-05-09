"use server";

import { z } from "zod";
import db from "../db";
import { schema } from "@/components/DashboardImapUpdate";

type TQuery = {
  page: number;
  take: number;
  search: string;
};

const findManyClient = async ({ page, take, search }: TQuery) => {
  const skip = (page - 1) * take;
  const data = await db.clientImap.findMany({
    skip,
    take,
    include: { client: true, imap: true },
    orderBy: {
      expiredTime: "asc",
    },
    where: {
      OR: [
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { email: { contains: search, mode: "insensitive" } } },
        { imap: { user: { contains: search, mode: "insensitive" } } },
      ],
    },
  });
  const total = await db.clientImap.count({
    where: {
      OR: [
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { email: { contains: search, mode: "insensitive" } } },
        { imap: { user: { contains: search, mode: "insensitive" } } },
      ],
    },
  });
  const totalPage = Math.ceil(total / take);
  return { data, total, totalPage, currentPage: page };
};

const updateClientImap = async ({
  clientId,
  imapId,
  newImapId,
  newImapName,
}: z.infer<typeof schema>) => {
  await db.clientImap.update({
    where: { clientId_imapId: { clientId, imapId } },
    data: { imapId: newImapId },
  });
};

const findManyImapClient = async (
  clientId: string,
  { page, take, search }: TQuery
) => {
  const skip = (page - 1) * take;
  const blacklist = await db.clientImap.findMany({
    skip,
    take,
    where: { clientId },
  });

  const data = await db.imap.findMany({
    skip,
    take,
    where: {
      AND: [
        {
          NOT: blacklist.map(({ imapId }) => {
            return { id: imapId };
          }),
        },
        {
          OR: [{ user: { contains: search, mode: "insensitive" } }],
        },
      ],
    },
  });
  const total = await db.imap.count({
    where: {
      AND: [
        {
          NOT: blacklist.map(({ imapId }) => {
            return { id: imapId };
          }),
        },
        {
          OR: [{ user: { contains: search, mode: "insensitive" } }],
        },
      ],
    },
  });
  const totalPage = Math.ceil(total / take);
  return { data, total, totalPage, currentPage: page };
};

export { findManyClient, updateClientImap, findManyImapClient };
