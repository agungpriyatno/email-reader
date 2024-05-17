import { Prisma } from "@prisma/client";
import "only-server";
import db from "../db";

const count = (where: Prisma.ImapWhereInput) => db.imap.count({ where });
type D = Prisma.ClientImapListRelationFilter;
const find = (key: string) => {
  return db.imap.findUnique({ where: { id: key } });
};

const findMany = ({
  take,
  skip,
  search,
}: {
  take: number;
  skip: number;
  search: string;
}) => {
  return db.imap.findMany({
    take,
    skip,
    include: {
      _count: {
        select: {
          clients: true,
        },
      },
    },
    where: {
      OR: [
        { id: { contains: search, mode: "insensitive" } },
        { user: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      user: "asc",
    },
  });
};

const findManyWithout = (
  userId: string,
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
  return db.imap.findMany({
    take,
    skip,
    include: {
      clients: true,
      _count: {
        select: {
          clients: true,
        },
      },
    },
    where: {
      clients: {
        some: {
          clientId: "helo",
        },
      },
      // AND: [
      //   {
      //     NOT: {
      //       clients: {
      //         none: { clientId: userId },
      //       },
      //     },
      //   },
      //   { OR: [{ id: { contains: search, mode: "insensitive" } }, { user: { contains: search, mode: "insensitive" } }] },
      // ],
    },
  });
};

const create = (data: Omit<Prisma.ImapCreateInput, "id">) => {
  return db.imap.create({ data });
};

const update = (
  key: string,
  data: Omit<Prisma.ImapUpdateInput, "id" | "updatedAt">
) => {
  return db.imap.update({ where: { id: key }, data });
};

const remove = (key: string) => {
  return db.imap.delete({ where: { id: key } });
};

const imapRepo = {
  create,
  update,
  remove,
  find,
  findMany,
  count,
  findManyWithout,
};

export default imapRepo;
