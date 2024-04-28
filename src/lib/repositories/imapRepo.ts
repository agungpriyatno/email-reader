import "only-server";
import db from "../db";
import { Prisma } from "@prisma/client";

const count = () => db.imap.count();

const find = (key: string) => {
  return db.imap.findUnique({ where: { id: key }});
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
        { id: { contains: search } },
        { user: { contains: search } },
      ],
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
  count
};

export default imapRepo;
