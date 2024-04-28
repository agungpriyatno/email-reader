import { z } from "zod";

const create = z.object({
  imaps: z.array(z.object({ imapId: z.string().min(1).max(255) })),
});

const clientImapSchema = {
  create,
};

export default clientImapSchema;
