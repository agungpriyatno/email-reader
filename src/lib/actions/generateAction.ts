"use server";

import { EMAIL } from "@/constants/email";
import db from "../db";

const generateEmail = async () => {
  const raw = EMAIL;
  const list = raw.split("\n");
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    console.log(item);
      const data = await db.imap.findUnique({ where: { user: item } });
      if (!data) {
        await db.imap.create({ data: { user: item } });
      } 
  }
};

export { generateEmail };
