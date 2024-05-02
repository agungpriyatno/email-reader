"use server";

import { WHITE_LIST } from "@/constants/whitelist";
import { google } from "googleapis";
import { ApiError } from "next/dist/server/api-utils";
import { oauth2SetCredential } from "../oauth";
import { redis } from "../redis";
import { tokenRepo } from "../repositories/tokenRepo";

type TMessage = {
  id?: string | null;
  to?: string | null;
  from?: string | null;
  date?: Date | null;
  subject?: string | null;
  body?: string | null;
};

const findMessages = async (to?: string) => {
  const whitelist = WHITE_LIST;
  const token = await tokenRepo.find();
  if (!token) throw new ApiError(405, "Bad Request");
  const messages: TMessage[] = [];
  const oauth2 = oauth2SetCredential(token);
  const gmail = google.gmail({ version: "v1", auth: oauth2 }).users.messages;
  const toQuery = `to:(${to})`;
  const { data } = await gmail.list({
    userId: "me",
    maxResults: 10,
    labelIds: ["Label_5022770114818890206"],
    q: `from:(info@account.netflix.com) ${to ? toQuery : ""}`,
  });

  await redis.connect();

  if (data.messages)
    for (const item of data.messages) {
      if (item.id) {
        const cached = await redis.get(item.id);
        if (!cached) {
          const { data } = await gmail.get({ userId: "me", id: item.id });
          const { payload } = data;
          const subject = payload?.headers?.find(
            (data) => data.name === "Subject"
          );
          const match = whitelist.find((item) =>
            subject?.value?.includes(item)
          );
          if (match) {
            let body = "";
            const to = payload?.headers?.find((data) => data.name === "To");
            const from = payload?.headers?.find((data) => data.name === "From");
            const date = payload?.headers?.find((data) => data.name === "Date");
            const part = payload?.parts?.find(
              (data) => data.mimeType === "text/html"
            );
            if (part?.body?.data) {
              const buffer = Buffer.from(part.body.data, "base64");
              const bodyString = buffer.toString();
              body = bodyString;
            }
            const message: TMessage = {
              id: item.id,
              to: to?.value,
              from: from?.value,
              date: date?.value ? new Date(Date.parse(date.value)) : undefined,
              subject: subject?.value,
              body,
            };
            messages.push(message);
            await redis.set(item.id, JSON.stringify(message), {
              EX: 60 * 60 * 24 * 3,
            });
          }
        } else {
          const { date, ...others } = JSON.parse(cached);
          const dd = new Date(Date.parse(date as string));
          const message: TMessage = { date: dd, ...others };
          messages.push(message);
        }
      }
    }

  await redis.disconnect();

  return messages;
};

export { findMessages };
