"use server";

import { EMAIL } from "@/constants/email";
import db from "../db";
import { z } from "zod";
import { updateIdPassword } from "../schemas/updatePassword";

const createBatchEmail = async ({ password }: z.infer<typeof updateIdPassword>) => {
  const raw = password;
  const list = raw.split("\n");
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const data = await db.imap.findUnique({ where: { user: item } });
    if (!data) {
      await db.imap.create({ data: { user: item } });
    }
  }
};

const generateEmail = async () => {
  const raw = EMAIL;
  const list = raw.split("\n");
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const data = await db.imap.findUnique({ where: { user: item } });
    if (!data) {
      await db.imap.create({ data: { user: item } });
    }
  }
};

export { generateEmail, createBatchEmail };
