import { PrismaClient } from '@prisma/client'
import { ImapFlow } from "imapflow";

import "server-only"

declare global {
  var cachedImap: ImapFlow
}

let imap: ImapFlow
if (process.env.NODE_ENV === 'production') {
  imap = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    logger: false,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!,
    },
  });
} else {
  if (!global.cachedImap) {
    global.cachedImap = new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: true,
      logger: false,
      auth: {
        user: process.env.IMAP_USER!,
        pass: process.env.IMAP_PASS!,
      },
    });
  }
  imap = global.cachedImap
}

const clientImap = imap

export default clientImap


