"use server";
import db from "../db";

type TFindManyFilter = {
  page: number;
  take: number;
  search: string;
};

const findManyFilter = async ({ page, take, search }: TFindManyFilter) => {
  const skip = (page - 1) * take;
  const data = await db.filter.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" },
    where: { name: { contains: search } },
  });
  const total = await db.filter.count({
    where: { name: { contains: search } },
  });
  const totalPage = Math.ceil(total / take);
  return { data, total, totalPage, currentPage: page };
};

const findAllFilter = async () => {
  const data = await db.filter.findMany();
  return data;
};

const createFilter = async (payloads: string[]) => {
  await db.filter.createMany({
    data: payloads.map((item) => {
      return { name: item };
    }),
  });
};

const updateFilter = async (filterId: string, payload: string) => {
  await db.filter.update({
    where: { id: filterId },
    data: { name: payload },
  });
};

const removeFilter = async (filterId: string) => {
  await db.filter.delete({
    where: { id: filterId },
  });
};

export {
  createFilter,
  updateFilter,
  removeFilter,
  findManyFilter,
  findAllFilter,
};
