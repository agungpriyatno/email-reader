"use server";

import { FetchMessageObject } from "imapflow";
import db from "../db";

type Message = Omit<FetchMessageObject, "source"> & {
  parsed?: {
    subject: string | undefined;
    html: string | false;
    date?: Date;
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

// const emailFindMany = async (to?: string) => {
//   const messages: Message[] = [];
//   const client = new ImapFlow({
//     host: "imap.gmail.com",
//     port: 993,
//     secure: true,
//     logger: false,
//     auth: {
//       user: process.env.IMAP_USER!,
//       pass: process.env.IMAP_PASS!,
//     },
//   });
//   await client.connect();
//   let lock = await client.getMailboxLock("INBOX");
//   try {
//     const fetcher = client.fetch(
//       {
//         seq: "1:*",
//         since: lastWeek(),
//         to,
//         from: "info@account.netflix.com",
//         // subject: "A PIN for profile"
//         // seen: false,
//       },
//       {
//         envelope: true,
//         source: true,
//       }
//     );

//     for await (let message of fetcher) {

//       console.log(message.emailId);
//       const found = whitelist.find((item) =>
//         message.envelope.subject.includes(item)
//       );
//       if (found) {
//         const { source, ...other } = message;
//         const parsed = await parseEmail(source);
//         messages.push({ ...other, parsed });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   } finally {
//     lock.release();
//   }
//   await client.logout();
//   return messages;
// };

// // Function to parse the email content.
// const parseEmail = async (source: Buffer) => {
//   const parsedEmail = await simpleParser(source, { skipHtmlToText: true });
//   return {
//     subject: parsedEmail.subject,
//     html: parsedEmail.html,
//     date: parsedEmail.date,
//   };
// };

const emailFindMany = async (to?: string) => {
  const data = await db.mail.findMany({
    where: { to },
    take: 20,
    orderBy: { date: "desc" },
  });
  return data;
};

export { emailFindMany };
