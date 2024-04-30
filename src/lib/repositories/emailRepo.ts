"use server";

import db from "../db";

const emailFindMany = async (to?: string) => {
  const data = await db.mail.findMany({
    where: { to },
    take: 20,
    orderBy: { date: "desc" },
  });
  return data;
};

export { emailFindMany };
