import "only-server";
import { Prisma } from "@prisma/client";
import db from "../db";

const count = (where?: Prisma.UserWhereInput) => {
  return db.user.count({where});
};

const find = (key: string) => {
  return db.user.findFirst({
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
  return db.user.findMany({
    take,
    skip,
    where: {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    },
  });
};

const create = (data: Omit<Prisma.UserCreateInput, "id">) => {
  return db.user.create({ data });
};

const update = (
  key: string,
  data: Omit<Prisma.UserUpdateInput, "id" | "updatedAt">
) => {
  return db.user.update({ where: { id: key }, data });
};

const remove = (key: string) => {
  return db.user.delete({ where: { id: key } });
};

const userRepo = {
  create,
  update,
  remove,
  find,
  findMany,
  count,
};

export default userRepo;
