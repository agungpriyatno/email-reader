import "only-server";
import db from "../db";
import { Prisma } from "@prisma/client";

const count = () => {
  return db.client.count();
};

const find = (key: string) => {
  return db.client.findFirst({
    where: { OR: [{ id: key }, { email: key }] },
  });
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
  return db.client.findMany({
    take,
    skip,
    orderBy: {
      name: "asc"
    },
    include: {
      _count: {
        select: {
          imaps: true,
        },
      },
    },
    where: {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    },
  });
};

const create = (data: Omit<Prisma.ClientCreateInput, "id">) => {
  return db.client.create({ data: { ...data } });
};

const update = (
  key: string,
  data: Omit<Prisma.ClientUpdateInput, "id" | "updatedAt">
) => {
  return db.client.update({ where: { id: key }, data });
};

const remove = (key: string) => {
  return db.client.delete({ where: { id: key } });
};

const clientRepo = {
  create,
  update,
  remove,
  find,
  findMany,
  count,
};

export default clientRepo;
