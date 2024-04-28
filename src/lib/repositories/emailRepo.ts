"use server";

import { FetchMessageObject, ImapFlow } from "imapflow";
import { Attachment, simpleParser } from "mailparser";
import { lastWeek } from "../utils";

type Message = Omit<FetchMessageObject, "source"> & {
  parsed?: {
    subject: string | undefined;
    text: string | undefined;
    html: string | false;
    attachments: Attachment[];
  };
};

const whitelist = [
  "A PIN for profile",
  "Reset your password ",
  "Atur ulang sandi",
  "Selesaikan permintaanmu untuk mengatur ulang sandi",
  "Complete your password reset request",
  "Kode akses sementaramu",
  "Your temporary access code",
  "Your Netflix temporary access code",
  "Kode akses sementara Netflix-mu",
  "Perlindungan PIN telah ditambahkan ke profil berikut",
  "PIN protection has been added to the following profile",
  "Perangkat baru menggunakan akunmu",
  "A new device is using your account",
];

const emailFindMany = async (to?: string) => {
  const messages: Message[] = [];
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    logger: false,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!,
    },
  });
  await client.connect();
  let lock = await client.getMailboxLock("INBOX");
  try {
    const fetcher = client.fetch(
      {
        seq: "1:*",
        since: lastWeek(),
        all: true,
        to,
        from: "info@account.netflix.com",
        // subject: "A PIN for profile"
        // seen: false,
      },
      {
        envelope: true,
        flags: true,
        uid: true,
        bodyStructure: true,
        source: true,
      }
    );

    for await (let message of fetcher) {
      const found = whitelist.find((item) =>
        message.envelope.subject.includes(item)
      );
      if (found) {
        const { source, ...other } = message;
        const parsed = await parseEmail(source);
        messages.push({ ...other, parsed });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    lock.release();
  }
  await client.logout();
  return messages;
};

const connectToMailbox = async () => {
  // Replace these with the Ethereal SMTP server details obtained while creating the account.
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    logger: false,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!,
    },
  });

  await client.connect();
  return client;
};

// Function to parse the email content.
const parseEmail = async (source: Buffer) => {
  const parsedEmail = await simpleParser(source);
  return {
    subject: parsedEmail.subject,
    text: parsedEmail.text,
    html: parsedEmail.html,
    attachments: [],
  };
};

export { emailFindMany };
